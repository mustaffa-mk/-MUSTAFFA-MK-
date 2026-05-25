/**
 * ╔══════════════════════════════════════╗
 * ║        𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ WhatsApp Bot      ║
 * ║     Creator: 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲               ║
 * ║     Powered by 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲        ║
 * ╚══════════════════════════════════════╝
 */

console.clear()
console.log("🚀🕷 Starting 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™...")

// ─────────────────────────────────────────
//  GLOBAL ANTI-CRASH
// ─────────────────────────────────────────
process.on("uncaughtException",  (err)    => console.error("❌ Uncaught Exception:",  err))
process.on("unhandledRejection", (reason) => console.error("❌ Unhandled Rejection:", reason))

// ─────────────────────────────────────────
//  IMPORTS
// ─────────────────────────────────────────
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
  generateWAMessageFromContent,
  generateForwardMessageContent,
  proto,
  makeInMemoryStore,
  jidDecode,
  areJidsSameUser,
  downloadContentFromMessage,
} = require('@whiskeysockets/baileys')

const fs      = require('fs')
const path    = require('path')
const os      = require('os')
const util    = require('util')
const P       = require('pino')
const qrcode  = require('qrcode-terminal')
const { File } = require('megajs')
const express = require('express')

const config  = require('./config')
const { sms } = require('./lib')
const { AntideleteHandler }  = require('./lib/antidelete')
const GroupEvents             = require('./lib/groupevents')
const { getGroupAdmins }      = require('./lib/functions')
const { saveMessage }         = require('./data')

// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
const ownerNumber = [config.OWNER_NUMBER]
const sessionDir  = path.join(__dirname, 'sessions')
const BOT_NAME    = config.BOT_NAME
const BOT_IMG     = config.ALIVE_IMG
const CHANNEL_JID = '120363423997837331@newsletter'

// ─────────────────────────────────────────
//  TEMP DIR
// ─────────────────────────────────────────
const tempDir = path.join(os.tmpdir(), 'mustaffa-cache')
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) return
    for (const f of files) fs.unlink(path.join(tempDir, f), () => {})
  })
}
setInterval(clearTempDir, 5 * 60 * 1000)

// ─────────────────────────────────────────
//  SESSION DOWNLOAD
// ─────────────────────────────────────────
if (!fs.existsSync(path.join(sessionDir, 'creds.json'))) {
  if (!config.SESSION_ID) {
    console.error('⚠️  SESSION_ID not set! Add it to config.js or env and restart.')
    process.exit(1)
  }
  const sessdata = config.SESSION_ID.replace('MUSTAFFA;;;', '').replace('MUSTAFFA;;;', '')
  console.log('📥 Downloading session from MEGA...')
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
  filer.download((err, data) => {
    if (err) { console.error('❌ Session download failed:', err); process.exit(1) }
    fs.mkdirSync(sessionDir, { recursive: true })
    fs.writeFile(path.join(sessionDir, 'creds.json'), data, () => {
      console.log('✅ Session saved. Restart the bot.')
    })
  })
}

// ─────────────────────────────────────────
//  EXPRESS SERVER
// ─────────────────────────────────────────
const app  = express()
const port = process.env.PORT || 9090
app.use(express.json())
app.get('/', (req, res) => res.json({
  status : 'active',
  bot    : BOT_NAME,
  uptime : process.uptime().toFixed(0) + 's',
  version: require('./package.json').version
}))
app.listen(port, () => console.log(`🌐 Server on port ${port}`))

// ─────────────────────────────────────────
//  GLOBAL STATE
// ─────────────────────────────────────────
let conn
let reconnectAttempts = 0

// ─────────────────────────────────────────
//  BODY EXTRACTOR
// ─────────────────────────────────────────
function extractBody(mek, type) {
  const msg = mek.message
  if (!msg) return ''
  switch (type) {
    case 'conversation':               return msg.conversation || ''
    case 'extendedTextMessage':        return msg.extendedTextMessage?.text || ''
    case 'imageMessage':               return msg.imageMessage?.caption || ''
    case 'videoMessage':               return msg.videoMessage?.caption || ''
    case 'buttonsResponseMessage':     return msg.buttonsResponseMessage?.selectedButtonId || ''
    case 'listResponseMessage':        return msg.listResponseMessage?.singleSelectReply?.selectedRowId || ''
    case 'templateButtonReplyMessage': return msg.templateButtonReplyMessage?.selectedId || ''
    default:                           return ''
  }
}

// ─────────────────────────────────────────
//  STATUS HANDLER (LID-aware)
// ─────────────────────────────────────────
async function handleStatus(mek, type) {
  try {
    const shouldRead  = config.AUTO_STATUS_SEEN  === 'true' || config.AUTO_READ_STATUS  === 'true'
    const shouldReact = config.AUTO_STATUS_REACT === 'true' || config.AUTO_REACT_STATUS === 'true'
    const participant = mek.key.participant || null
    if (!participant) return

    let realJid = participant
    if (participant.endsWith('@lid')) {
      const rawPn = mek.key?.participantPn || mek.key?.senderPn
      if (rawPn) {
        realJid = rawPn.includes('@') ? rawPn : `${rawPn}@s.whatsapp.net`
      } else {
        const resolved = await conn.getJidFromLid(participant).catch(() => null)
        if (resolved) realJid = resolved
      }
    }

    const resolvedKey = { ...mek.key, participant: realJid }
    if (shouldRead) await conn.readMessages([resolvedKey])

    if (shouldReact) {
      const reactable = ['imageMessage','videoMessage','extendedTextMessage','conversation','audioMessage']
      if (reactable.includes(type)) {
        const emojis = ['🧩','🍉','💜','🌸','🪴','💊','💫','🍂','🌟','🎋','🫀','🧿','🤖','🚩','🥰','🗿']
        const emoji  = emojis[Math.floor(Math.random() * emojis.length)]
        await conn.sendMessage('status@broadcast',
          { react: { key: resolvedKey, text: emoji } },
          { statusJidList: [realJid, conn.user.id] }
        )
      }
    }

    if (config.AUTO_STATUS_REPLY === 'true' && config.AUTO_STATUS_MSG) {
      await conn.sendMessage(realJid, { text: config.AUTO_STATUS_MSG }, { quoted: mek })
    }
  } catch (e) { console.error('Status handler error:', e.message) }
}

// ─────────────────────────────────────────
//  MAIN CONNECTION
// ─────────────────────────────────────────
async function connectToWA() {
  try {
    console.log(`\n[ ♻ ] Connecting... (attempt ${reconnectAttempts + 1})`)

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version }          = await fetchLatestBaileysVersion()

    conn = makeWASocket({
      logger            : P({ level: 'silent' }),
      printQRInTerminal : false,
      browser           : Browsers.macOS('Firefox'),
      syncFullHistory   : true,
      auth              : state,
      version
    })

    // ── ANTI-CALL ─────────────────────────────────────────────────────────
    conn.ev.on('call', async (calls) => {
      if (config.ANTICALL !== 'true') return
      for (const call of calls) {
        if (call.status === 'offer') {
          console.log(`📞 Rejected call from: ${call.from}`)
          await conn.rejectCall(call.id, call.from)
          await conn.sendMessage(call.from, {
            text: `⚠️ *${BOT_NAME} AUTO-REJECT* ⚠️\nCalls are disabled. Send a text instead.`
          })
        }
      }
    })

    // ── CONNECTION UPDATE ─────────────────────────────────────────────────
    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        console.log('📷 Scan QR Code:')
        qrcode.generate(qr, { small: true })
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode
        if (code === DisconnectReason.loggedOut) {
          console.error('🚫 Logged out. Re-link session.')
          process.exit(1)
        }
        reconnectAttempts++
        const delay = Math.min(5000 * reconnectAttempts, 60000)
        console.log(`🔁 Reconnecting in ${delay / 1000}s...`)
        setTimeout(connectToWA, delay)

      } else if (connection === 'open') {
        reconnectAttempts = 0
        console.log(`\n✅ ${BOT_NAME} connected!\n`)

        // Load plugins
        const dirs = ['./plugins', './popkid']
        let loaded = 0
        for (const dir of dirs) {
          const full = path.join(__dirname, dir)
          if (!fs.existsSync(full)) continue
          for (const f of fs.readdirSync(full).filter(f => f.endsWith('.js'))) {
            try { require(path.join(full, f)); loaded++ }
            catch (e) { console.error(`⚠️  Plugin [${f}]:`, e.message) }
          }
          break // only load first existing dir
        }
        console.log(`[ 🪀 ] ${loaded} plugin(s) loaded`)

        // Connected banner
        const banner =
          `╔════════════════════╗\n` +
          `║ 🤖  ${BOT_NAME}\n` +
          `╠════════════════════╣\n` +
          `║ 🔑 PREFIX   : ${config.PREFIX}\n` +
          `║ 👨‍💻 OWNER    : ${config.OWNER_NAME}\n` +
          `║ 📞 OWNER NO : ${ownerNumber[0]}\n` +
          `║ 🌐 VERSION  : ${config.BOT_VERSION}\n` +
          `╚════════════════════╝`

        await conn.sendMessage(conn.user.id, { image: { url: BOT_IMG }, caption: banner })

        // Follow newsletter
        try {
          await conn.newsletterFollow(CHANNEL_JID)
          console.log(`📡 Followed newsletter`)
        } catch (e) { console.error('Newsletter follow failed:', e.message) }
      }
    })

    conn.ev.on('creds.update', saveCreds)

    // ── AUTO BIO ──────────────────────────────────────────────────────────
    setInterval(async () => {
      if (config.AUTO_BIO !== 'true' || !conn?.user) return
      try {
        const now  = new Date()
        const date = now.toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi' })
        const time = now.toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi', hour12: false })
        await conn.setStatus(`🤖 ${BOT_NAME} is live!\n📅 ${date} ⏰ ${time}`)
      } catch (_) {}
    }, 60000)

    // ── GROUP EVENTS ──────────────────────────────────────────────────────
    conn.ev.on('group-participants.update', async (update) => {
      try { await GroupEvents(conn, update) }
      catch (e) { console.error('Group event error:', e.message) }
    })

    // ── MESSAGES ──────────────────────────────────────────────────────────
    conn.ev.on('messages.upsert', async (mek) => {
      try {
        mek = mek.messages[0]
        if (!mek?.message) return

        // Unwrap ephemeral
        if (getContentType(mek.message) === 'ephemeralMessage')
          mek.message = mek.message.ephemeralMessage.message

        const from = mek.key.remoteJid
        const type = getContentType(mek.message)

        // Status handler
        if (from === 'status@broadcast') { await handleStatus(mek, type); return }

        // Blue ticks
        if (config.READ_MESSAGE === 'true') await conn.readMessages([mek.key])

        // Save to DB
        await saveMessage(mek)

        // AntiDelete
        if (config.ANTIDELETE && config.ANTIDELETE !== 'false')
          await AntideleteHandler(conn, mek)

        // Parse
        const m           = sms(conn, mek)
        const body        = extractBody(mek, type)
        const isCmd       = body.startsWith(config.PREFIX)
        const command     = isCmd ? body.slice(config.PREFIX.length).trim().split(' ').shift().toLowerCase() : ''
        const args        = body.trim().split(/ +/).slice(1)
        const text        = args.join(' ')
        const isGroup     = from.endsWith('@g.us')
        const sender      = mek.key.fromMe
          ? (conn.user.id.split(':')[0] + '@s.whatsapp.net')
          : (mek.key.participant || from)
        const senderNumber = sender.split('@')[0]
        const isOwner     = ownerNumber.includes(senderNumber) || mek.key.fromMe
        const pushname    = mek.pushName || 'User'
        const botNumber2  = await jidNormalizedUser(conn.user.id)

        let groupMetadata = {}, participants = [], groupAdmins = [], isBotAdmins = false, isAdmins = false
        if (isGroup) {
          groupMetadata = await conn.groupMetadata(from).catch(() => ({}))
          participants  = groupMetadata.participants || []
          groupAdmins   = await getGroupAdmins(participants)
          isBotAdmins   = groupAdmins.includes(botNumber2)
          isAdmins      = groupAdmins.includes(sender)
        }

        const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek })

        // Owner eval
        if (isOwner && body.startsWith('%')) {
          try { reply(util.format(eval(body.slice(1)))) } catch (e) { reply(util.format(e)) }
          return
        }
        if (isOwner && body.startsWith('$')) {
          try {
            const r = await eval(`(async()=>{ ${body.slice(1)} })()`)
            if (r !== undefined) reply(util.format(r))
          } catch (e) { reply(util.format(e)) }
          return
        }

        // Auto react
        if (!mek.key.fromMe && config.AUTO_REACT === 'true') {
          const emojis = ['🌼','❤️','💐','🔥','🏵️','❄️','🐋','💥','🥀','✨','💯','🎯']
          m.react(emojis[Math.floor(Math.random() * emojis.length)])
        }

        // Auto typing
        if (isCmd && config.AUTO_TYPING === 'true')
          await conn.sendPresenceUpdate('composing', from)

        // Commands
        if (isCmd) {
          const events = require('./command')
          const cmd = events.commands.find(
            c => c.pattern === command || (c.alias && c.alias.includes(command))
          )
          if (cmd) {
            if (cmd.react) await conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })
            try {
              await cmd.function(conn, mek, m, {
                from, body, isCmd, command, args, text, isGroup,
                sender, senderNumber, botNumber2, pushname, isOwner,
                groupMetadata, participants, groupAdmins, isBotAdmins, isAdmins, reply
              })
            } catch (e) {
              console.error(`[CMD ERR] ${command}:`, e.message)
              reply(`❌ Error in *${command}*: ${e.message}`)
            }
          }
        }

      } catch (err) { console.error('Message handler error:', err.message) }
    })

  } catch (err) {
    console.error('connectToWA error:', err.message)
    setTimeout(connectToWA, Math.min(5000 * (reconnectAttempts + 1), 60000))
  }
}

// ─────────────────────────────────────────
//  START
// ─────────────────────────────────────────
setTimeout(connectToWA, 4000)
