/**
 * MUSTAFFA-MD — Auto Features Toggle
 * antidelete, autoreact, autocall, autobio, statusview, statusreact, autoread, antilink
 */

const { addCommand } = require('../command')
const config = require('../config')

function parseToggle(args) {
  const v = args[0]?.toLowerCase()
  if (['on', 'true', 'enable', '1'].includes(v))  return 'true'
  if (['off', 'false', 'disable', '0'].includes(v)) return 'false'
  return null
}

function toggleMsg(feature, state) {
  const icon = state === 'true' ? '✅' : '❌'
  return `${icon} *${feature}* has been turned *${state === 'true' ? 'ON' : 'OFF'}*.`
}

// ── ANTIDELETE ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'antidelete',
  alias    : ['antidel'],
  desc     : 'Toggle antidelete on/off',
  category : 'features',
  react    : '🗑️',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.ANTIDELETE === 'true' ? 'ON' : 'OFF'}*\nUsage: antidelete on/off`)
    config.ANTIDELETE = val
    reply(toggleMsg('AntiDelete', val))
  }
})

// ── ANTICALL ─────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'anticall',
  desc     : 'Toggle anticall on/off',
  category : 'features',
  react    : '📞',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.ANTICALL === 'true' ? 'ON' : 'OFF'}*\nUsage: anticall on/off`)
    config.ANTICALL = val
    reply(toggleMsg('AntiCall', val))
  }
})

// ── AUTO REACT ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'autoreact',
  desc     : 'Toggle auto reaction on/off',
  category : 'features',
  react    : '❤️',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.AUTO_REACT === 'true' ? 'ON' : 'OFF'}*\nUsage: autoreact on/off`)
    config.AUTO_REACT = val
    reply(toggleMsg('AutoReact', val))
  }
})

// ── AUTO BIO ──────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'autobio',
  desc     : 'Toggle auto bio update on/off',
  category : 'features',
  react    : '📝',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.AUTO_BIO === 'true' ? 'ON' : 'OFF'}*\nUsage: autobio on/off`)
    config.AUTO_BIO = val
    reply(toggleMsg('AutoBio', val))
  }
})

// ── STATUS VIEW ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'statusview',
  alias    : ['viewstatus', 'autoview'],
  desc     : 'Toggle auto view statuses on/off',
  category : 'features',
  react    : '👁️',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.AUTO_STATUS_SEEN === 'true' ? 'ON' : 'OFF'}*\nUsage: statusview on/off`)
    config.AUTO_STATUS_SEEN = val
    config.AUTO_READ_STATUS = val
    reply(toggleMsg('AutoStatusView', val))
  }
})

// ── STATUS REACT ──────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'statusreact',
  alias    : ['reactstatus', 'autoreactstatus'],
  desc     : 'Toggle auto react to statuses on/off',
  category : 'features',
  react    : '🎭',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.AUTO_STATUS_REACT === 'true' ? 'ON' : 'OFF'}*\nUsage: statusreact on/off`)
    config.AUTO_STATUS_REACT = val
    config.AUTO_REACT_STATUS = val
    reply(toggleMsg('StatusReact', val))
  }
})

// ── AUTO READ ─────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'autoread',
  alias    : ['readall', 'bluetick'],
  desc     : 'Toggle auto-read all messages on/off',
  category : 'features',
  react    : '✅',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.READ_MESSAGE === 'true' ? 'ON' : 'OFF'}*\nUsage: autoread on/off`)
    config.READ_MESSAGE = val
    reply(toggleMsg('AutoRead (Blue Ticks)', val))
  }
})

// ── AUTO TYPING ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'autotyping',
  alias    : ['typing'],
  desc     : 'Toggle auto typing indicator on/off',
  category : 'features',
  react    : '⌨️',
  async function(conn, mek, m, { reply, args, isOwner }) {
    if (!isOwner) return reply('❌ Owner only.')
    const val = parseToggle(args)
    if (!val) return reply(`Current: *${config.AUTO_TYPING === 'true' ? 'ON' : 'OFF'}*\nUsage: autotyping on/off`)
    config.AUTO_TYPING = val
    reply(toggleMsg('AutoTyping', val))
  }
})

// ── FEATURES STATUS ───────────────────────────────────────────────────────────
addCommand({
  pattern  : 'features',
  alias    : ['settings', 'status'],
  desc     : 'Show all feature toggle status',
  category : 'features',
  react    : '⚙️',
  async function(conn, mek, m, { reply }) {
    const on  = (v) => v === 'true' ? '✅' : '❌'
    reply(
      `⚙️ *${config.BOT_NAME} Features*\n\n` +
      `${on(config.ANTIDELETE)}  AntiDelete\n` +
      `${on(config.ANTICALL)}    AntiCall\n` +
      `${on(config.AUTO_REACT)}  AutoReact\n` +
      `${on(config.AUTO_BIO)}    AutoBio\n` +
      `${on(config.AUTO_STATUS_SEEN)} StatusView\n` +
      `${on(config.AUTO_STATUS_REACT)} StatusReact\n` +
      `${on(config.READ_MESSAGE)} AutoRead\n` +
      `${on(config.AUTO_TYPING)} AutoTyping\n` +
      `${on(config.WELCOME_MSG)} WelcomeMsg\n` +
      `${on(config.GOODBYE_MSG)} GoodbyeMsg\n\n` +
      `Use .featurename on/off to toggle.`
    )
  }
})
