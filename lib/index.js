/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ lib/index.js
 * Core helper: sms() message wrapper and AntiDelete stub
 */

const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const config = require('../config')

/**
 * sms() — wraps a raw Baileys message into a convenient object
 */
function sms(conn, mek) {
  const from    = mek.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender  = mek.key.fromMe
    ? (conn.user.id.split(':')[0] + '@s.whatsapp.net')
    : (mek.key.participant || from)

  return {
    conn,
    mek,
    from,
    isGroup,
    sender,
    key: mek.key,

    // React to the message
    react: (emoji) => {
      return conn.sendMessage(from, { react: { text: emoji, key: mek.key } })
    },

    // Reply with text
    reply: (text) => {
      return conn.sendMessage(from, { text }, { quoted: mek })
    },

    // Send image
    sendImage: (url, caption = '') => {
      return conn.sendMessage(from, { image: { url }, caption }, { quoted: mek })
    },

    // Send video
    sendVideo: (url, caption = '') => {
      return conn.sendMessage(from, { video: { url }, caption }, { quoted: mek })
    },

    // Send audio
    sendAudio: (url, ptt = false) => {
      return conn.sendMessage(from, { audio: { url }, ptt, mimetype: 'audio/mpeg' }, { quoted: mek })
    },

    // Send sticker
    sendSticker: (buffer) => {
      return conn.sendMessage(from, { sticker: buffer }, { quoted: mek })
    },

    // Download media from quoted or current message
    downloadMedia: async () => {
      const msg = mek.message
      const types = ['imageMessage','videoMessage','audioMessage','stickerMessage','documentMessage']
      for (const t of types) {
        if (msg[t]) return await downloadMediaMessage(mek, 'buffer', {})
        // Check quoted
        const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage
        if (quoted?.[t]) {
          const fakeMek = { message: quoted, key: { remoteJid: from, fromMe: false, id: '' } }
          return await downloadMediaMessage(fakeMek, 'buffer', {})
        }
      }
      return null
    }
  }
}

// Stub AntiDelete export for backwards compat (real logic in lib/antidelete.js)
const AntiDelete = {}

module.exports = { sms, downloadMediaMessage, AntiDelete }
