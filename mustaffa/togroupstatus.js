// ============================================================
//  POPKID-MD — popkid/togroupstatus.js
//  Group Status / Text Status / Media Status
// ============================================================

const crypto = require('crypto')
const { PassThrough } = require('stream')
const ffmpeg = require('fluent-ffmpeg')
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  downloadContentFromMessage,
} = require('@whiskeysockets/baileys')

const { commands } = require('../command')

const PURPLE_COLOR = '#9C27B0'
const DEFAULT_CAPTION = '_POPKID-MD is on Fire 🔥_'

commands.push({
  pattern: "togroupstatus",
  alias: ["groupstatus", "statusgroup", "togcstatus"],
  react: "📢",
  category: "group",
  description: "Send text or quoted media to group status. Owner only.",
  function: async (conn, mek, m, { from, isGroup, isOwner, text: userText, reply }) => {

    if (!isGroup) return reply("❌ Group only command!")
    if (!isOwner) return reply("❌ Owner Only Command!")

    try {
      const ctxInfo = mek.message?.extendedTextMessage?.contextInfo
      const quotedMsg = ctxInfo?.quotedMessage || null
      const hasQuoted = !!quotedMsg

      // ── TEXT STATUS ────────────────────────────────────────
      if (!hasQuoted) {
        if (!userText) {
          return reply(
            '📝 *Group Status Usage*\n' +
            '• Reply to image/video/audio with:\n' +
            '  `.togroupstatus [optional caption]`\n' +
            '• Or send text only:\n' +
            '  `.togroupstatus Your text here`\n' +
            'Text statuses use a purple background by default.'
          )
        }
        await reply('⏳ Posting text group status...')
        await groupStatus(conn, from, { text: userText, backgroundColor: PURPLE_COLOR })
        return reply('✅ Text group status posted!')
      }

      const mtype = Object.keys(quotedMsg)[0] || ''

      // ── IMAGE ──────────────────────────────────────────────
      if (/image/i.test(mtype)) {
        await reply('⏳ Posting image group status...')
        const buf = await downloadMedia(quotedMsg, 'image')
        const quotedCaption = quotedMsg.imageMessage?.caption || ''
        const finalCaption = userText || quotedCaption || DEFAULT_CAPTION
        await groupStatus(conn, from, { image: buf, caption: finalCaption })
        return reply('✅ Image group status posted!')
      }

      // ── VIDEO ──────────────────────────────────────────────
      if (/video/i.test(mtype)) {
        await reply('⏳ Posting video group status...')
        const buf = await downloadMedia(quotedMsg, 'video')
        const quotedCaption = quotedMsg.videoMessage?.caption || ''
        const finalCaption = userText || quotedCaption || DEFAULT_CAPTION
        await groupStatus(conn, from, { video: buf, caption: finalCaption })
        return reply('✅ Video group status posted!')
      }

      // ── AUDIO / VOICE ──────────────────────────────────────
      if (/audio/i.test(mtype)) {
        await reply('⏳ Posting audio group status...')
        const buf = await downloadMedia(quotedMsg, 'audio')

        let vn = buf
        try { vn = await toVN(buf) } catch (e) { console.log('toVN skipped') }

        let waveform
        try { waveform = await generateWaveform(buf) } catch (e) { console.log('waveform skipped') }

        await groupStatus(conn, from, {
          audio: vn,
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true,
          waveform,
        })
        return reply('✅ Audio group status posted!')
      }

      // ── STICKER ────────────────────────────────────────────
      if (/sticker/i.test(mtype)) {
        await reply('⏳ Posting sticker group status...')
        const buf = await downloadMedia(quotedMsg, 'sticker')
        await groupStatus(conn, from, { image: buf })
        return reply('✅ Sticker group status posted!')
      }

      return reply('❌ Unsupported media type.')

    } catch (e) {
      console.error('togroupstatus error:', e)
      return reply('❌ Error: ' + (e.message || e))
    }
  }
})

// ==================== HELPERS ====================

async function downloadMedia(msg, type) {
  const mediaMsg = msg[`${type}Message`] || msg
  const stream = await downloadContentFromMessage(mediaMsg, type)
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks)
}

async function groupStatus(conn, jid, content) {
  const { backgroundColor } = content
  delete content.backgroundColor

  const inside = await generateWAMessageContent(content, {
    upload: conn.waUploadToServer,
    backgroundColor: backgroundColor || PURPLE_COLOR,
  })

  const secret = crypto.randomBytes(32)

  const msg = generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret: secret },
    groupStatusMessageV2: {
      message: {
        ...inside,
        messageContextInfo: { messageSecret: secret },
      },
    },
  }, {})

  await conn.relayMessage(jid, msg.message, { messageId: msg.key.id })
}

async function toVN(buffer) {
  return new Promise((resolve, reject) => {
    const input = new PassThrough()
    const output = new PassThrough()
    const chunks = []

    output.on('data', chunk => chunks.push(chunk))
    output.on('end', () => resolve(Buffer.concat(chunks)))
    output.on('error', reject)

    input.end(buffer)

    ffmpeg(input)
      .noVideo()
      .audioCodec('libopus')
      .audioChannels(1)
      .audioFrequency(48000)
      .format('ogg')
      .on('error', reject)
      .pipe(output, { end: true })
  })
}

async function generateWaveform(buffer, bars = 64) {
  return new Promise((resolve, reject) => {
    const input = new PassThrough()
    const output = new PassThrough()
    const chunks = []

    output.on('data', chunk => chunks.push(chunk))
    output.on('error', reject)
    output.on('end', () => {
      try {
        const raw = Buffer.concat(chunks)
        if (!raw.length) return resolve(undefined)

        const sampleCount = Math.floor(raw.length / 2)
        const amplitudes = []
        for (let i = 0; i < sampleCount; i++) {
          amplitudes.push(Math.abs(raw.readInt16LE(i * 2)) / 32768)
        }

        const size = Math.floor(amplitudes.length / bars)
        const barsData = Array.from({ length: bars }, (_, i) => {
          const slice = amplitudes.slice(i * size, (i + 1) * size)
          return slice.length ? slice.reduce((a, b) => a + b) / slice.length : 0
        })

        const max = Math.max(...barsData) || 1
        const normalized = barsData.map(v => Math.floor((v / max) * 100))
        resolve(Buffer.from(normalized).toString('base64'))
      } catch (err) {
        reject(err)
      }
    })

    input.end(buffer)

    ffmpeg(input)
      .noVideo()
      .audioChannels(1)
      .audioFrequency(16000)
      .format('s16le')
      .on('error', reject)
      .pipe(output, { end: true })
  })
}
