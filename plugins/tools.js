/**
 * MUSTAFFA-MD — Tool Commands
 * weather, calc, define, translate, paste, qr, base64
 */

const { addCommand } = require('../command')
const { fetchJson }  = require('../lib/functions')
const config = require('../config')
const axios  = require('axios')

// ── WEATHER ───────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'weather',
  alias    : ['w', 'clima'],
  desc     : 'Get weather info for a city',
  category : 'tools',
  react    : '🌤️',

  async function(conn, mek, m, { reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}weather <city>`)

    try {
      const url  = `https://wttr.in/${encodeURIComponent(text)}?format=j1`
      const data = await fetchJson(url)
      const c    = data.current_condition[0]
      const area = data.nearest_area[0]

      const location = area.areaName[0].value + ', ' + area.country[0].value
      const temp_c   = c.temp_C
      const temp_f   = c.temp_F
      const feel_c   = c.FeelsLikeC
      const humidity = c.humidity
      const wind     = c.windspeedKmph
      const desc     = c.weatherDesc[0].value

      reply(
        `🌍 *Weather in ${location}*\n\n` +
        `🌡️ Temp    : ${temp_c}°C / ${temp_f}°F\n` +
        `🤔 Feels   : ${feel_c}°C\n` +
        `💧 Humidity: ${humidity}%\n` +
        `💨 Wind    : ${wind} km/h\n` +
        `☁️ Condition: ${desc}`
      )
    } catch (e) {
      reply(`❌ Could not get weather: ${e.message}`)
    }
  }
})

// ── CALCULATOR ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'calc',
  alias    : ['calculate', 'math'],
  desc     : 'Calculate a math expression',
  category : 'tools',
  react    : '🧮',

  async function(conn, mek, m, { reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}calc <expression>\nExample: ${config.PREFIX}calc 2 + 2 * 10`)

    try {
      // Safe eval using API
      const url    = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(text)}`
      const result = await axios.get(url).then(r => r.data)
      reply(`🧮 *Calculator*\n\n📥 Input : ${text}\n📤 Result: *${result}*`)
    } catch (e) {
      reply(`❌ Calculation failed: invalid expression`)
    }
  }
})

// ── DICTIONARY ────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'define',
  alias    : ['dict', 'meaning', 'definition'],
  desc     : 'Get word definition',
  category : 'tools',
  react    : '📖',

  async function(conn, mek, m, { reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}define <word>`)

    const word = text.trim().split(' ')[0]
    try {
      const url  = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      const data = await fetchJson(url)
      if (!data?.[0]) return reply('❌ Word not found.')

      const entry     = data[0]
      const phonetic  = entry.phonetic || ''
      const meanings  = entry.meanings?.slice(0, 2) || []

      let result = `📖 *${entry.word}* ${phonetic}\n\n`
      for (const m of meanings) {
        result += `*${m.partOfSpeech}*\n`
        const defs = m.definitions?.slice(0, 2) || []
        for (const d of defs) {
          result += `• ${d.definition}\n`
          if (d.example) result += `  _e.g. "${d.example}"_\n`
        }
        result += '\n'
      }

      reply(result.trim())
    } catch (e) {
      reply(`❌ Definition not found for *${word}*.`)
    }
  }
})

// ── TRANSLATE ─────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'translate',
  alias    : ['tr', 'trans'],
  desc     : 'Translate text to English',
  category : 'tools',
  react    : '🌐',

  async function(conn, mek, m, { reply, text, args }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}translate <text>\nOr: ${config.PREFIX}translate <lang> <text>`)

    let targetLang = 'en'
    let inputText  = text

    // If first arg is a 2-letter lang code
    if (args[0]?.length === 2 && /^[a-z]+$/i.test(args[0])) {
      targetLang = args[0].toLowerCase()
      inputText  = args.slice(1).join(' ')
    }

    try {
      const url  = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`
      const data = await fetchJson(url)
      const result = data[0].map(x => x[0]).join('')
      const from   = data[2] || 'auto'
      reply(`🌐 *Translation*\n\n📥 *[${from.toUpperCase()}]* ${inputText}\n📤 *[${targetLang.toUpperCase()}]* ${result}`)
    } catch (e) {
      reply(`❌ Translation failed: ${e.message}`)
    }
  }
})

// ── QR CODE GENERATOR ─────────────────────────────────────────────────────────
addCommand({
  pattern  : 'qr',
  alias    : ['qrcode', 'makeqr'],
  desc     : 'Generate a QR code',
  category : 'tools',
  react    : '📱',

  async function(conn, mek, m, { from, reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}qr <text or URL>`)

    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`
      await conn.sendMessage(from, {
        image  : { url: qrUrl },
        caption: `📱 *QR Code*\n\n📝 Content: ${text}`
      }, { quoted: mek })
    } catch (e) {
      reply(`❌ QR generation failed: ${e.message}`)
    }
  }
})

// ── GITHUB USER ───────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'github',
  alias    : ['git', 'ghuser'],
  desc     : 'Get GitHub user info',
  category : 'tools',
  react    : '🐙',

  async function(conn, mek, m, { from, reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}github <username>`)

    try {
      const data = await fetchJson(`https://api.github.com/users/${text}`)
      if (data.message === 'Not Found') return reply('❌ GitHub user not found.')

      const info =
        `🐙 *GitHub Profile*\n\n` +
        `👤 Name     : ${data.name || 'N/A'}\n` +
        `🔑 Username : ${data.login}\n` +
        `📍 Location : ${data.location || 'N/A'}\n` +
        `📦 Repos    : ${data.public_repos}\n` +
        `👥 Followers: ${data.followers}\n` +
        `👣 Following: ${data.following}\n` +
        `🔗 Profile  : ${data.html_url}`

      await conn.sendMessage(from, {
        image  : { url: data.avatar_url },
        caption: info
      }, { quoted: mek })
    } catch (e) {
      reply(`❌ Failed: ${e.message}`)
    }
  }
})

// ── LYRICS ────────────────────────────────────────────────────────────────────
addCommand({
  pattern  : 'lyrics',
  alias    : ['lyric', 'song_lyrics'],
  desc     : 'Get song lyrics',
  category : 'tools',
  react    : '🎶',

  async function(conn, mek, m, { reply, text }) {
    if (!text) return reply(`❌ Usage: ${config.PREFIX}lyrics <song - artist>`)

    try {
      const q    = encodeURIComponent(text)
      const data = await fetchJson(`https://lyrist.vercel.app/api/${q}`)
      if (!data?.lyrics) return reply('❌ Lyrics not found.')

      const lines = data.lyrics.split('\n').slice(0, 50).join('\n')
      reply(`🎶 *${data.title}* — ${data.artist}\n\n${lines}\n\n_(First 50 lines shown)_`)
    } catch (e) {
      reply(`❌ Lyrics not found: ${e.message}`)
    }
  }
})
