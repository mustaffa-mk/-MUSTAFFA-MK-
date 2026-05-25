/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ lib/groupevents.js
 * Handles group participant events: welcome, goodbye, promote, demote
 */

const config = require('../config')

module.exports = async function GroupEvents(conn, update) {
  const { id, participants, action } = update
  if (!id || !participants) return

  let groupMeta = {}
  try { groupMeta = await conn.groupMetadata(id) } catch (_) { return }

  const groupName = groupMeta.subject || 'This Group'
  const groupDesc = groupMeta.desc    || ''
  const total     = groupMeta.participants?.length || 0
  const ppGroup   = await conn.profilePictureUrl(id, 'image').catch(() => 'https://files.catbox.moe/j9ia5c.png')

  for (const jid of participants) {
    const ppUser = await conn.profilePictureUrl(jid, 'image').catch(() => 'https://files.catbox.moe/j9ia5c.png')
    const tag    = `@${jid.split('@')[0]}`

    // ── WELCOME ─────────────────────────────────────────────────────────
    if (action === 'add' && config.WELCOME_MSG === 'true') {
      const welcomeText =
        `╔══════════════════╗\n` +
        `║  👋 WELCOME!\n` +
        `╠══════════════════╣\n` +
        `║ 👤 USER   : ${tag}\n` +
        `║ 🏠 GROUP  : ${groupName}\n` +
        `║ 👥 MEMBERS: ${total}\n` +
        `╚══════════════════╝\n\n` +
        `Welcome to *${groupName}*, ${tag}! 🎉\n` +
        `Please read the group rules and enjoy your stay.`

      await conn.sendMessage(id, {
        image    : { url: ppUser },
        caption  : welcomeText,
        mentions : [jid]
      }).catch(async () => {
        // Fallback to text if image fails
        await conn.sendMessage(id, { text: welcomeText, mentions: [jid] })
      })
    }

    // ── GOODBYE ─────────────────────────────────────────────────────────
    else if (action === 'remove' && config.GOODBYE_MSG === 'true') {
      const byeText =
        `╔══════════════════╗\n` +
        `║  👋 GOODBYE!\n` +
        `╠══════════════════╣\n` +
        `║ 👤 User   : ${tag}\n` +
        `║ 🏠 Group  : ${groupName}\n` +
        `║ 👥 Members: ${total}\n` +
        `╚══════════════════╝\n\n` +
        `Goodbye ${tag}! 👋\nWe hope to see you again.`

      await conn.sendMessage(id, {
        image    : { url: ppUser },
        caption  : byeText,
        mentions : [jid]
      }).catch(async () => {
        await conn.sendMessage(id, { text: byeText, mentions: [jid] })
      })
    }

    // ── PROMOTE ─────────────────────────────────────────────────────────
    else if (action === 'promote' && config.AUTO_PROMOTE_MSG === 'true') {
      const promoteText =
        `🎉 *ADMIN PROMOTED*\n\n` +
        `👤 ${tag} has been promoted to admin in *${groupName}*!\n` +
        `Congratulations! 🥳`

      await conn.sendMessage(id, { text: promoteText, mentions: [jid] })
    }

    // ── DEMOTE ──────────────────────────────────────────────────────────
    else if (action === 'demote') {
      const demoteText =
        `⬇️ *ADMIN DEMOTED*\n\n` +
        `👤 ${tag} has been removed from admin in *${groupName}*.`

      await conn.sendMessage(id, { text: demoteText, mentions: [jid] })
    }
  }
}
