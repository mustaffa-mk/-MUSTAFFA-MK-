/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ — Group Management Commands
 * kick, promote, demote, tagall, groupinfo, antilink, mute, unmute, open, close
 */

const { addCommand } = require('../command')
const config = require('../config')

// ── KICK ─────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'kick',
  alias    : ['remove', 'ban'],
  desc     : 'Kick a member from the group',
  category : 'group',
  react    : '🦵',

  async function(conn, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins, sender, participants }) {
    if (!isGroup)     return reply('❌ This command is for groups only.')
    if (!isAdmins)    return reply('❌ You need to be an admin.')
    if (!isBotAdmins) return reply('❌ I need to be an admin to kick members.')

    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quoted    = mek.message?.extendedTextMessage?.contextInfo?.participant
    const targets   = mentioned.length ? mentioned : quoted ? [quoted] : []

    if (!targets.length) return reply('❌ Mention or reply to someone to kick them.')

    for (const jid of targets) {
      try {
        await conn.groupParticipantsUpdate(from, [jid], 'remove')
        reply(`✅ Kicked @${jid.split('@')[0]}`)
      } catch (e) {
        reply(`❌ Could not kick @${jid.split('@')[0]}: ${e.message}`)
      }
    }
  }
})

// ── PROMOTE ──────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'promote',
  desc     : 'Promote a member to admin',
  category : 'group',
  react    : '⬆️',

  async function(conn, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins }) {
    if (!isGroup)     return reply('❌ Groups only.')
    if (!isAdmins)    return reply('❌ Admins only.')
    if (!isBotAdmins) return reply('❌ I need to be admin.')

    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quoted    = mek.message?.extendedTextMessage?.contextInfo?.participant
    const targets   = mentioned.length ? mentioned : quoted ? [quoted] : []

    if (!targets.length) return reply('❌ Mention or reply to someone.')

    for (const jid of targets) {
      await conn.groupParticipantsUpdate(from, [jid], 'promote')
      reply(`✅ Promoted @${jid.split('@')[0]} to admin!`)
    }
  }
})

// ── DEMOTE ───────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'demote',
  desc     : 'Demote an admin to member',
  category : 'group',
  react    : '⬇️',

  async function(conn, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins }) {
    if (!isGroup)     return reply('❌ Groups only.')
    if (!isAdmins)    return reply('❌ Admins only.')
    if (!isBotAdmins) return reply('❌ I need to be admin.')

    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quoted    = mek.message?.extendedTextMessage?.contextInfo?.participant
    const targets   = mentioned.length ? mentioned : quoted ? [quoted] : []

    if (!targets.length) return reply('❌ Mention or reply to someone.')

    for (const jid of targets) {
      await conn.groupParticipantsUpdate(from, [jid], 'demote')
      reply(`✅ Demoted @${jid.split('@')[0]}`)
    }
  }
})

// ── TAG ALL ──────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'tagall',
  alias    : ['everyone', 'all'],
  desc     : 'Tag all group members',
  category : 'group',
  react    : '📢',

  async function(conn, mek, m, { from, reply, isGroup, isAdmins, participants, text }) {
    if (!isGroup)  return reply('❌ Groups only.')
    if (!isAdmins) return reply('❌ Admins only.')

    const mentions = participants.map(p => p.id)
    const tags     = mentions.map(j => `@${j.split('@')[0]}`).join(' ')
    const msg      = text ? `📢 *${text}*\n\n${tags}` : `📢 *Attention everyone!*\n\n${tags}`

    await conn.sendMessage(from, { text: msg, mentions }, { quoted: mek })
  }
})

// ── GROUP INFO ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'groupinfo',
  alias    : ['ginfo', 'gc'],
  desc     : 'Show group information',
  category : 'group',
  react    : '📋',

  async function(conn, mek, m, { from, reply, isGroup, groupMetadata, participants }) {
    if (!isGroup) return reply('❌ Groups only.')

    const admins = participants.filter(p => p.admin).map(p => `@${p.id.split('@')[0]}`).join(', ')

    const text =
      `╔════════════════════╗\n` +
      `║  📋 *GROUP INFO*\n` +
      `╠════════════════════╣\n` +
      `║ 📛 Name    : ${groupMetadata.subject || 'N/A'}\n` +
      `║ 👥 Members : ${participants.length}\n` +
      `║ 🆔 ID      : ${from}\n` +
      `║ 📅 Created : ${groupMetadata.creation ? new Date(groupMetadata.creation * 1000).toDateString() : 'N/A'}\n` +
      `║ 👑 Admins  : ${admins || 'None'}\n` +
      `╚════════════════════╝\n\n` +
      `📝 *Desc:* ${groupMetadata.desc || 'No description'}`

    await conn.sendMessage(from, { text }, { quoted: mek })
  }
})

// ── MUTE ─────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'mute',
  alias    : ['close', 'lock'],
  desc     : 'Mute the group (admins only can send)',
  category : 'group',
  react    : '🔇',

  async function(conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins }) {
    if (!isGroup)     return reply('❌ Groups only.')
    if (!isAdmins)    return reply('❌ Admins only.')
    if (!isBotAdmins) return reply('❌ I need to be admin.')
    await conn.groupSettingUpdate(from, 'announcement')
    reply('🔇 Group muted. Only admins can send messages.')
  }
})

// ── UNMUTE ───────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'unmute',
  alias    : ['open', 'unlock'],
  desc     : 'Unmute the group',
  category : 'group',
  react    : '🔊',

  async function(conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins }) {
    if (!isGroup)     return reply('❌ Groups only.')
    if (!isAdmins)    return reply('❌ Admins only.')
    if (!isBotAdmins) return reply('❌ I need to be admin.')
    await conn.groupSettingUpdate(from, 'not_announcement')
    reply('🔊 Group unmuted. Everyone can send messages.')
  }
})

// ── INVITE LINK ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'invitelink',
  alias    : ['link', 'invite'],
  desc     : 'Get group invite link',
  category : 'group',
  react    : '🔗',

  async function(conn, mek, m, { from, reply, isGroup, isAdmins }) {
    if (!isGroup)  return reply('❌ Groups only.')
    if (!isAdmins) return reply('❌ Admins only.')
    try {
      const code = await conn.groupInviteCode(from)
      reply(`🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${code}`)
    } catch (e) {
      reply(`❌ Could not get invite link: ${e.message}`)
    }
  }
})

// ── REVOKE LINK ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'revokelink',
  alias    : ['resetlink'],
  desc     : 'Reset group invite link',
  category : 'group',
  react    : '🔄',

  async function(conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins }) {
    if (!isGroup)     return reply('❌ Groups only.')
    if (!isAdmins)    return reply('❌ Admins only.')
    if (!isBotAdmins) return reply('❌ I need to be admin.')
    try {
      const code = await conn.groupRevokeInvite(from)
      reply(`✅ Link reset!\n🔗 New link: https://chat.whatsapp.com/${code}`)
    } catch (e) {
      reply(`❌ Failed: ${e.message}`)
    }
  }
})
