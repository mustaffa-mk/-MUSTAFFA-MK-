/**
 * MUSTAFFA-MD — Owner Commands
 * broadcast, block, unblock, restart, setprefix, setbio, joingc, leavegc, deletedb
 */

const { addCommand } = require('../command')
const config = require('../config')
const fs     = require('fs')
const path   = require('path')

// ── BROADCAST ─────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'broadcast',
  alias    : ['bc', 'announce'],
  desc     : 'Broadcast a message to all chats',
  category : 'owner',
  react    : '📢',

  async function(conn, mek, m, { reply, text, isOwner }) {
    if (!isOwner) return reply('❌ Owner only command.')
    if (!text)    return reply(`❌ Usage: ${config.PREFIX}broadcast <message>`)

    try {
      const chats = await conn.groupFetchAllParticipating()
      const ids   = Object.keys(chats)
      let sent = 0

      await reply(`📢 Broadcasting to ${ids.length} groups...`)

      for (const id of ids) {
        try {
          await conn.sendMessage(id, {
            text: `📢 *BROADCAST from ${config.BOT_NAME}*\n\n${text}`
          })
          sent++
        } catch (_) {}
        await new Promise(r => setTimeout(r, 500)) // rate limit
      }

      reply(`✅ Broadcast sent to ${sent}/${ids.length} groups.`)
    } catch (e) {
      reply(`❌ Broadcast failed: ${e.message}`)
    }
  }
})

// ── BLOCK ─────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'block',
  desc     : 'Block a user',
  category : 'owner',
  react    : '🚫',

  async function(conn, mek, m, { from, reply, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')

    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quoted    = mek.message?.extendedTextMessage?.contextInfo?.participant
    const targets   = mentioned.length ? mentioned : quoted ? [quoted] : []

    if (!targets.length) return reply('❌ Mention or reply to the user to block.')

    for (const jid of targets) {
      await conn.updateBlockStatus(jid, 'block')
      reply(`🚫 Blocked @${jid.split('@')[0]}`)
    }
  }
})

// ── UNBLOCK ───────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'unblock',
  desc     : 'Unblock a user',
  category : 'owner',
  react    : '✅',

  async function(conn, mek, m, { from, reply, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')

    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    const quoted    = mek.message?.extendedTextMessage?.contextInfo?.participant
    const targets   = mentioned.length ? mentioned : quoted ? [quoted] : []

    if (!targets.length) return reply('❌ Mention or reply to the user to unblock.')

    for (const jid of targets) {
      await conn.updateBlockStatus(jid, 'unblock')
      reply(`✅ Unblocked @${jid.split('@')[0]}`)
    }
  }
})

// ── JOIN GROUP ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'joingc',
  alias    : ['join'],
  desc     : 'Join a group via invite link',
  category : 'owner',
  react    : '🏠',

  async function(conn, mek, m, { reply, text, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    if (!text || !text.includes('chat.whatsapp.com/'))
      return reply(`❌ Usage: ${config.PREFIX}joingc <invite link>`)

    try {
      const code = text.split('chat.whatsapp.com/')[1]
      await conn.groupAcceptInvite(code)
      reply('✅ Joined the group!')
    } catch (e) {
      reply(`❌ Could not join: ${e.message}`)
    }
  }
})

// ── LEAVE GROUP ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'leavegc',
  alias    : ['leave', 'leavegroup'],
  desc     : 'Leave current group',
  category : 'owner',
  react    : '🚪',

  async function(conn, mek, m, { from, reply, isOwner, isGroup }) {
    if (!isOwner) return reply('❌ Owner only.')
    if (!isGroup) return reply('❌ Groups only.')

    await reply(`👋 Goodbye everyone! ${config.BOT_NAME} is leaving.`)
    await conn.groupLeave(from)
  }
})

// ── RESTART ───────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'restart',
  alias    : ['reboot'],
  desc     : 'Restart the bot',
  category : 'owner',
  react    : '🔄',

  async function(conn, mek, m, { reply, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    await reply('🔄 Restarting bot...')
    setTimeout(() => process.exit(0), 2000)
  }
})

// ── SET PREFIX ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'setprefix',
  alias    : ['prefix'],
  desc     : 'Change bot prefix',
  category : 'owner',
  react    : '🔑',

  async function(conn, mek, m, { reply, text, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    if (!text)    return reply(`❌ Usage: ${config.PREFIX}setprefix <new prefix>`)

    config.PREFIX = text.trim()[0]
    reply(`✅ Prefix changed to: *${config.PREFIX}*\n\nNote: This resets on restart. Edit config.js to make it permanent.`)
  }
})

// ── LIST GROUPS ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'listgroups',
  alias    : ['groups'],
  desc     : 'List all groups bot is in',
  category : 'owner',
  react    : '📋',

  async function(conn, mek, m, { reply, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')

    try {
      const chats = await conn.groupFetchAllParticipating()
      const list  = Object.values(chats)
        .map((g, i) => `${i + 1}. *${g.subject}* (${g.participants.length} members)`)
        .join('\n')

      reply(`📋 *Bot Groups (${Object.keys(chats).length})*:\n\n${list}`)
    } catch (e) {
      reply(`❌ Failed: ${e.message}`)
    }
  }
})

// ── GET NUMBER ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'getnumber',
  alias    : ['number'],
  desc     : 'Get JID of a mentioned user',
  category : 'owner',
  react    : '📞',

  async function(conn, mek, m, { reply, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')

    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
    if (!mentioned.length) return reply('❌ Mention someone.')

    const numbers = mentioned.map(j => `• ${j.split('@')[0]}`).join('\n')
    reply(`📞 *Numbers:*\n${numbers}`)
  }
})
