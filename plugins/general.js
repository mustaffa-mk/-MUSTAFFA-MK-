/**
 * MUSTAFFA-MD — General Commands
 * alive, ping, info, runtime, owner
 */

const { addCommand } = require('../command')
const { runtime }    = require('../lib/functions')
const config         = require('../config')
const os             = require('os')

// ── ALIVE ────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'alive',
  alias    : ['on', 'online'],
  desc     : 'Check if bot is online',
  category : 'general',
  react    : '🤖',

  async function(conn, mek, m, { from, pushname }) {
    const uptime = runtime(process.uptime())
    const mem    = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)

    const text =
      `╔══════════════════╗\n` +
      `║  🤖 *${config.BOT_NAME}*\n` +
      `╠══════════════════╣\n` +
      `║ ✅ Status  : Online\n` +
      `║ ⏱️  Uptime  : ${uptime}\n` +
      `║ 💾 RAM     : ${mem} MB\n` +
      `║ 🖥️  OS      : ${os.platform()}\n` +
      `║ 🔑 Prefix  : ${config.PREFIX}\n` +
      `╚══════════════════╝\n\n` +
      `Hey *${pushname}*! I'm alive and ready. 🚀`

    await conn.sendMessage(from, {
      image  : { url: config.ALIVE_IMG },
      caption: text
    }, { quoted: mek })
  }
})

// ── PING ─────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'ping',
  alias    : ['speed', 'latency'],
  desc     : 'Check response speed',
  category : 'general',
  react    : '🏓',

  async function(conn, mek, m, { reply }) {
    const start = Date.now()
    await reply('🏓 Pong!')
    const end = Date.now()
    await reply(`⚡ Response time: *${end - start}ms*`)
  }
})

// ── RUNTIME ──────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'runtime',
  alias    : ['uptime', 'time'],
  desc     : 'Show bot uptime',
  category : 'general',
  react    : '⏱️',

  async function(conn, mek, m, { reply }) {
    reply(`⏱️ *Bot Uptime:* ${runtime(process.uptime())}`)
  }
})

// ── INFO ─────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'info',
  alias    : ['botinfo', 'about'],
  desc     : 'Bot information',
  category : 'general',
  react    : 'ℹ️',

  async function(conn, mek, m, { from }) {
    const text =
      `╔══════════════════════╗\n` +
      `║   ℹ️ *BOT INFO*\n` +
      `╠══════════════════════╣\n` +
      `║ 🤖 Name    : ${config.BOT_NAME}\n` +
      `║ 🌐 Version : ${config.BOT_VERSION}\n` +
      `║ 👨‍💻 Owner   : ${config.OWNER_NAME}\n` +
      `║ 📞 No.     : ${config.OWNER_NUMBER}\n` +
      `║ 🔑 Prefix  : ${config.PREFIX}\n` +
      `║ 🖥️  Node    : ${process.version}\n` +
      `║ 🏠 Platform: ${os.platform()}\n` +
      `╚══════════════════════╝`

    await conn.sendMessage(from, { text }, { quoted: mek })
  }
})

// ── OWNER ────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'owner',
  alias    : ['creator', 'dev'],
  desc     : 'Get bot owner contact',
  category : 'general',
  react    : '👨‍💻',

  async function(conn, mek, m, { from }) {
    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`
    await conn.sendMessage(from, {
      contacts: {
        displayName: config.OWNER_NAME,
        contacts: [{
          vcard:
            `BEGIN:VCARD\n` +
            `VERSION:3.0\n` +
            `FN:${config.OWNER_NAME}\n` +
            `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:+${config.OWNER_NUMBER}\n` +
            `END:VCARD`
        }]
      }
    }, { quoted: mek })
  }
})
