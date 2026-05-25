/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ lib/antidelete.js
 * Forwards deleted messages back to the chat
 */

const { getContentType, downloadMediaMessage } = require('@whiskeysockets/baileys')
const { loadMessage } = require('../data')
const config = require('../config')

// In-memory message store (backed up by data/saveMessage)
const messageStore = new Map()

/**
 * Store a message for later retrieval on delete
 */
async function AntideleteHandler(conn, mek) {
  try {
    const from = mek.key.remoteJid
    if (!from) return

    // Store message by ID
    const msgId = mek.key.id
    if (mek.message) {
      messageStore.set(msgId, { mek, from, ts: Date.now() })
      // Keep store lean — max 500 entries
      if (messageStore.size > 500) {
        const oldestKey = messageStore.keys().next().value
        messageStore.delete(oldestKey)
      }
    }

    // Detect deletion
    const proto = mek.message?.protocolMessage
    if (proto?.type === 0) { // REVOKE
      const deletedKey = proto.key
      const deletedId  = deletedKey?.id

      if (!deletedId) return

      const setting = config.ANTIDELETE
      if (!setting || setting === 'false') return

      // Retrieve stored message
      const stored = messageStore.get(deletedId) || await loadMessage(deletedId).catch(() => null)
      if (!stored) return

      const storedMek  = stored.mek || stored
      const storedFrom = stored.from || storedMek?.key?.remoteJid || from
      const type       = getContentType(storedMek.message)
      const sender     = storedMek.key.participant || storedMek.key.remoteJid || 'Unknown'
      const senderTag  = `@${sender.split('@')[0]}`

      const header = `🗑️ *DELETED MESSAGE DETECTED*\n👤 From: ${senderTag}\n⏰ Time: ${new Date().toLocaleTimeString()}\n━━━━━━━━━━━━━━━`

      // Send to: same chat (default) or owner only
      const targetJid = setting === 'owner'
        ? `${config.OWNER_NUMBER}@s.whatsapp.net`
        : storedFrom

      try {
        if (type === 'conversation' || type === 'extendedTextMessage') {
          const text = storedMek.message?.conversation
            || storedMek.message?.extendedTextMessage?.text
            || ''
          await conn.sendMessage(targetJid, {
            text: `${header}\n\n💬 *Text:*\n${text}`,
            mentions: [sender]
          })

        } else if (type === 'imageMessage') {
          const buffer = await downloadMediaMessage(storedMek, 'buffer', {}).catch(() => null)
          if (buffer) {
            const caption = storedMek.message.imageMessage?.caption || ''
            await conn.sendMessage(targetJid, {
              image: buffer,
              caption: `${header}\n\n🖼️ *Deleted image*\n${caption}`,
              mentions: [sender]
            })
          }

        } else if (type === 'videoMessage') {
          const buffer = await downloadMediaMessage(storedMek, 'buffer', {}).catch(() => null)
          if (buffer) {
            const caption = storedMek.message.videoMessage?.caption || ''
            await conn.sendMessage(targetJid, {
              video: buffer,
              caption: `${header}\n\n🎥 *Deleted video*\n${caption}`,
              mentions: [sender]
            })
          }

        } else if (type === 'audioMessage') {
          const buffer = await downloadMediaMessage(storedMek, 'buffer', {}).catch(() => null)
          if (buffer) {
            await conn.sendMessage(targetJid, {
              audio: buffer,
              mimetype: 'audio/mpeg',
              caption: `${header}\n\n🎵 *Deleted audio*`,
              mentions: [sender]
            })
          }

        } else if (type === 'stickerMessage') {
          const buffer = await downloadMediaMessage(storedMek, 'buffer', {}).catch(() => null)
          if (buffer) {
            await conn.sendMessage(targetJid, { sticker: buffer })
            await conn.sendMessage(targetJid, { text: `${header}\n\n🎭 *Deleted sticker*`, mentions: [sender] })
          }

        } else {
          await conn.sendMessage(targetJid, {
            text: `${header}\n\n📎 *Deleted ${type}* (media not recoverable)`,
            mentions: [sender]
          })
        }
      } catch (sendErr) {
        console.error('AntiDelete send error:', sendErr.message)
      }
    }
  } catch (e) {
    console.error('AntideleteHandler error:', e.message)
  }
}

module.exports = { AntideleteHandler }
