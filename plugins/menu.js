/**
 * MUSTAFFA-MD — Menu / Help Command
 */

const { addCommand } = require('../command')
const { runtime }    = require('../lib/functions')
const config         = require('../config')
const os             = require('os')

addCommand({
  pattern  : 'menu',
  alias    : ['help', 'start', 'bot'],
  desc     : 'Show main menu',
  category : 'general',
  react    : '📋',

  async function(conn, mek, m, { from, reply, isOwner, pushname }) {
    const uptime = runtime(process.uptime())
    const mem    = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
    const platform = os.platform()

    const menuText =
      `╔══════════════════════════╗\n` +
      `║  🤖  *MUSTAFFA-MD MENU*\n` +
      `╠══════════════════════════╣\n` +
      `║ 👤 User    : ${pushname}\n` +
      `║ ⏱️  Uptime  : ${uptime}\n` +
      `║ 💾 RAM     : ${mem} MB\n` +
      `║ 🔑 Prefix  : ${config.PREFIX}\n` +
      `╚══════════════════════════╝\n\n` +

      `━━━━ 🌐 *GENERAL* ━━━━\n` +
      `• ${config.PREFIX}menu — Show this menu\n` +
      `• ${config.PREFIX}alive — Bot status\n` +
      `• ${config.PREFIX}ping — Response time\n` +
      `• ${config.PREFIX}info — Bot info\n` +
      `• ${config.PREFIX}runtime — Uptime\n\n` +

      `━━━━ 🛠️ *TOOLS* ━━━━\n` +
      `• ${config.PREFIX}tts <text> — Text to speech\n` +
      `• ${config.PREFIX}weather <city> — Weather info\n` +
      `• ${config.PREFIX}define <word> — Dictionary\n` +
      `• ${config.PREFIX}calc <expr> — Calculator\n` +
      `• ${config.PREFIX}translate <text> — Translate\n\n` +

      `━━━━ 🎵 *MEDIA* ━━━━\n` +
      `• ${config.PREFIX}play <name> — Download audio\n` +
      `• ${config.PREFIX}video <name> — Download video\n` +
      `• ${config.PREFIX}sticker — Make sticker\n` +
      `• ${config.PREFIX}toimg — Sticker to image\n\n` +

      `━━━━ 👥 *GROUP* ━━━━\n` +
      `• ${config.PREFIX}kick @user — Kick member\n` +
      `• ${config.PREFIX}promote @user — Promote admin\n` +
      `• ${config.PREFIX}demote @user — Demote admin\n` +
      `• ${config.PREFIX}tagall — Tag all members\n` +
      `• ${config.PREFIX}groupinfo — Group details\n` +
      `• ${config.PREFIX}antilink on/off — Anti-link\n\n` +

      `━━━━ 🔧 *OWNER* ━━━━\n` +
      `• ${config.PREFIX}broadcast <msg> — Broadcast\n` +
      `• ${config.PREFIX}setprefix <p> — Change prefix\n` +
      `• ${config.PREFIX}block @user — Block user\n` +
      `• ${config.PREFIX}unblock @user — Unblock user\n` +
      `• ${config.PREFIX}restart — Restart bot\n\n` +

      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🤖 *${config.BOT_NAME}* v${config.BOT_VERSION}\n` +
      `👨‍💻 Made by *${config.OWNER_NAME}*`

    await conn.sendMessage(from, {
      image  : { url: config.ALIVE_IMG },
      caption: menuText
    }, { quoted: mek })
  }
})
