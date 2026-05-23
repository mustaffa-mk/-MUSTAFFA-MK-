/**
 * MUSTAFFA-MD — Media Commands
 * sticker, toimg, play, video, ytmp3, ytmp4
 */

const { addCommand }  = require('../command')
const { getBuffer, fetchJson, sleep } = require('../lib/functions')
const { downloadMediaMessage }        = require('@whiskeysockets/baileys')
const config = require('../config')
const axios  = require('axios')

// ── STICKER (from image/video/GIF) ───────────────────────────────────────────
addCommand({
  pattern  : 'sticker',
  alias    : ['s', 'stiker'],
  desc     : 'Convert image/video to sticker',
  category : 'media',
  react    : '🎭',

  async function(conn, mek, m, { from, reply }) {
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const type   = quoted
      ? Object.keys(quoted)[0]
      : Object.keys(mek.message)[0]

    const targetMek = quoted
      ? { message: quoted, key: { remoteJid: from, fromMe: false, id: mek.message?.extendedTextMessage?.contextInfo?.stanzaId || '' } }
      : mek

    if (!['imageMessage','videoMessage','stickerMessage'].includes(type))
      return reply('❌ Reply to an image, video, or GIF to make a sticker.')

    try {
      await reply('⏳ Making sticker...')
      const buffer = await downloadMediaMessage(targetMek, 'buffer', {})

      // Use wa-sticker-formatter
      const { Sticker, StickerTypes } = require('wa-sticker-formatter')
      const sticker = new Sticker(buffer, {
        pack : config.BOT_NAME,
        author: config.OWNER_NAME,
        type : StickerTypes.FULL,
        categories: ['🤩','🎭'],
        id   : '12345',
        quality: 80,
        background: 'transparent'
      })
      const stickerBuffer = await sticker.toBuffer()
      await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek })
    } catch (e) {
      reply(`❌ Sticker failed: ${e.message}`)
    }
  }
})

// ── TO IMAGE (sticker → image) ────────────────────────────────────────────────
addCommand({
  pattern  : 'toimg',
  alias    : ['stickertoimg', 'unsticker'],
  desc     : 'Convert sticker to image',
  category : 'media',
  react    : '🖼️',

  async function(conn, mek, m, { from, reply }) {
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (!quoted?.stickerMessage) return reply('❌ Reply to a sticker.')

    try {
      const targetMek = {
        message: quoted,
        key: { remoteJid: from, fromMe: false, id: '' }
      }
      const buffer = await downloadMediaMessage(targetMek, 'buffer', {})
      await conn.sendMessage(from, { image: buffer, caption: '🖼️ Here is your image!' }, { quoted: mek })
    } catch (e) {
      reply(`❌ Failed: ${e.message}`)
    }
  }
})

// ── PLAY (audio download via eliteprotech) ────────────────────────────────────
addCommand({
  pattern  : 'play',
  alias    : ['song', 'music', 'audio'],
  desc     : 'Download and send a song',
  category : 'media',
  react    : '🎵',

  async function(conn, mek, m, { from, reply, text, args }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}play <song name>`)

    try {
      await reply(`🔍 Searching for: *${text}*...`)

      // Use eliteprotech YouTube search + download
      const searchUrl  = `${config.ELITE_API}/search?q=${encodeURIComponent(text)}&type=yt`
      const searchData = await fetchJson(searchUrl).catch(() => null)

      if (!searchData?.data?.length) {
        // Fallback: ytdl.org API
        const res = await axios.get(`https://api.yt-scrapper.com/yt/search?q=${encodeURIComponent(text)}&max_results=1`).catch(() => null)
        if (!res?.data) return reply('❌ Could not find that song.')
      }

      const videoId  = searchData?.data?.[0]?.id || searchData?.result?.[0]?.id
      if (!videoId) return reply('❌ No results found.')

      const dlUrl    = `${config.ELITE_API}/youtube/mp3?id=${videoId}`
      const dlData   = await fetchJson(dlUrl).catch(() => null)
      const audioUrl = dlData?.data?.url || dlData?.url

      if (!audioUrl) return reply('❌ Could not get audio download link.')

      const title  = searchData?.data?.[0]?.title || text
      const dur    = searchData?.data?.[0]?.duration || ''

      await conn.sendMessage(from, {
        audio   : { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt     : false
      }, { quoted: mek })

      await reply(`🎵 *${title}*\n⏱️ ${dur}`)
    } catch (e) {
      reply(`❌ Play failed: ${e.message}`)
    }
  }
})

// ── VIDEO DOWNLOAD ────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'video',
  alias    : ['vid', 'ytmp4'],
  desc     : 'Download a YouTube video',
  category : 'media',
  react    : '🎬',

  async function(conn, mek, m, { from, reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}video <name or URL>`)

    try {
      await reply(`🔍 Searching: *${text}*...`)

      const searchUrl  = `${config.ELITE_API}/search?q=${encodeURIComponent(text)}&type=yt`
      const searchData = await fetchJson(searchUrl).catch(() => null)
      const videoId    = searchData?.data?.[0]?.id

      if (!videoId) return reply('❌ No results found.')

      const dlUrl  = `${config.ELITE_API}/youtube/mp4?id=${videoId}`
      const dlData = await fetchJson(dlUrl).catch(() => null)
      const vidUrl = dlData?.data?.url || dlData?.url

      if (!vidUrl) return reply('❌ Could not get video link.')

      const title = searchData?.data?.[0]?.title || text
      const dur   = searchData?.data?.[0]?.duration || ''

      await conn.sendMessage(from, {
        video  : { url: vidUrl },
        caption: `🎬 *${title}*\n⏱️ ${dur}`
      }, { quoted: mek })
    } catch (e) {
      reply(`❌ Video failed: ${e.message}`)
    }
  }
})

// ── IMAGE SEARCH ──────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'img',
  alias    : ['image', 'photo', 'pic'],
  desc     : 'Search and send an image',
  category : 'media',
  react    : '🖼️',

  async function(conn, mek, m, { from, reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}img <query>`)

    try {
      await reply('🔍 Searching images...')
      const url  = `https://api.agify.io/image?q=${encodeURIComponent(text)}`
      // Use a working public image search API
      const res  = await axios.get(`https://source.unsplash.com/800x600/?${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer',
        maxRedirects: 5
      })
      const buffer = Buffer.from(res.data)
      await conn.sendMessage(from, {
        image  : buffer,
        caption: `🖼️ *${text}*`
      }, { quoted: mek })
    } catch (e) {
      reply(`❌ Image search failed: ${e.message}`)
    }
  }
})

// ── TIKTOK DOWNLOAD ───────────────────────────────────────────────────────────
addCommand({
  pattern  : 'tiktok',
  alias    : ['tt', 'tik'],
  desc     : 'Download TikTok video',
  category : 'media',
  react    : '🎵',

  async function(conn, mek, m, { from, reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}tiktok <url>`)
    if (!text.includes('tiktok.com') && !text.includes('vm.tiktok.com'))
      return reply('❌ Please provide a valid TikTok URL.')

    try {
      await reply('⏳ Downloading TikTok video...')
      const url    = `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`
      const data   = await fetchJson(url)

      if (!data?.data?.play) return reply('❌ Could not download this TikTok.')

      const vidUrl = data.data.play
      const title  = data.data.title || 'TikTok Video'

      await conn.sendMessage(from, {
        video  : { url: vidUrl },
        caption: `🎵 *${title}*\n\n_Downloaded by ${config.BOT_NAME}_`
      }, { quoted: mek })
    } catch (e) {
      reply(`❌ TikTok download failed: ${e.message}`)
    }
  }
})
