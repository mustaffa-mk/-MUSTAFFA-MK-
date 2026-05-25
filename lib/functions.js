/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ lib/functions.js
 * Shared utility functions
 */

const axios = require('axios')
const fs    = require('fs')

// ── Get buffer from URL ──────────────────────────────────────────────────────
async function getBuffer(url, options = {}) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', ...options })
    return Buffer.from(res.data)
  } catch (e) {
    throw new Error(`getBuffer failed: ${e.message}`)
  }
}

// ── Get group admins from participants array ─────────────────────────────────
async function getGroupAdmins(participants) {
  return participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id)
}

// ── Random element from array ────────────────────────────────────────────────
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Human-readable number e.g. 1000 → 1k ────────────────────────────────────
function h2k(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return String(num)
}

// ── Check if string is a URL ─────────────────────────────────────────────────
function isUrl(str) {
  try {
    new URL(str)
    return true
  } catch (_) { return false }
}

// ── Pretty-print JSON ────────────────────────────────────────────────────────
function Json(obj) {
  return JSON.stringify(obj, null, 2)
}

// ── Bot uptime string ────────────────────────────────────────────────────────
function runtime(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  let str = ''
  if (d) str += `${d}d `
  if (h) str += `${h}h `
  if (m) str += `${m}m `
  str += `${s}s`
  return str.trim()
}

// ── Sleep/delay ──────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ── Fetch JSON from URL ──────────────────────────────────────────────────────
async function fetchJson(url, options = {}) {
  try {
    const res = await axios.get(url, options)
    return res.data
  } catch (e) {
    throw new Error(`fetchJson failed: ${e.message}`)
  }
}

// ── Format file size ─────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024)        return bytes + ' B'
  if (bytes < 1048576)     return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1073741824)  return (bytes / 1048576).toFixed(2) + ' MB'
  return (bytes / 1073741824).toFixed(2) + ' GB'
}

// ── Extract mentioned JIDs from message ──────────────────────────────────────
function getMentions(mek) {
  return mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
}

// ── Get quoted message ───────────────────────────────────────────────────────
function getQuotedMsg(mek) {
  return mek.message?.extendedTextMessage?.contextInfo?.quotedMessage || null
}

// ── Get quoted sender ────────────────────────────────────────────────────────
function getQuotedSender(mek) {
  return mek.message?.extendedTextMessage?.contextInfo?.participant || null
}

module.exports = {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
  formatSize,
  getMentions,
  getQuotedMsg,
  getQuotedSender
}
