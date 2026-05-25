/**
 * 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™ data/index.js
 * Simple JSON-based persistence layer
 */

const fs   = require('fs')
const path = require('path')

const DB_DIR = path.join(__dirname)
const FILES  = {
  messages  : path.join(DB_DIR, 'messages.json'),
  contacts  : path.join(DB_DIR, 'contacts.json'),
  groups    : path.join(DB_DIR, 'groups.json'),
  antidel   : path.join(DB_DIR, 'antidelete.json'),
  msgcounts : path.join(DB_DIR, 'msgcounts.json'),
}

// ── Bootstrap empty DBs ──────────────────────────────────────────────────────
for (const [key, file] of Object.entries(FILES)) {
  if (!fs.existsSync(file)) {
    const defaults = { messages: {}, contacts: {}, groups: {}, antidel: {}, msgcounts: {} }
    fs.writeFileSync(file, JSON.stringify(defaults[key] || {}), 'utf-8')
  }
}

// ── Generic read/write ───────────────────────────────────────────────────────
function readDB(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')) }
  catch (_) { return {} }
}

function writeDB(file, data) {
  try { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8') }
  catch (e) { console.error('DB write error:', e.message) }
}

// ── MESSAGES ─────────────────────────────────────────────────────────────────
async function saveMessage(mek) {
  if (!mek?.key?.id || !mek.message) return
  const db = readDB(FILES.messages)
  db[mek.key.id] = {
    key    : mek.key,
    message: mek.message,
    pushName: mek.pushName || '',
    from   : mek.key.remoteJid,
    ts     : Date.now()
  }
  // Keep lean: 1000 messages max
  const keys = Object.keys(db)
  if (keys.length > 1000) delete db[keys[0]]
  writeDB(FILES.messages, db)
}

async function loadMessage(id) {
  const db = readDB(FILES.messages)
  return db[id] || null
}

// ── CONTACTS ─────────────────────────────────────────────────────────────────
async function saveContact(jid, name) {
  if (!jid) return
  const db = readDB(FILES.contacts)
  db[jid] = { name: name || '', ts: Date.now() }
  writeDB(FILES.contacts, db)
}

async function getName(jid) {
  const db = readDB(FILES.contacts)
  return db[jid]?.name || jid.split('@')[0]
}

// ── GROUPS ───────────────────────────────────────────────────────────────────
async function saveGroupMetadata(jid, meta) {
  if (!jid) return
  const db = readDB(FILES.groups)
  db[jid] = { ...meta, ts: Date.now() }
  writeDB(FILES.groups, db)
}

async function getGroupMetadata(jid) {
  const db = readDB(FILES.groups)
  return db[jid] || null
}

async function getChatSummary(jid) {
  const db = readDB(FILES.messages)
  const msgs = Object.values(db).filter(m => m.from === jid)
  return { total: msgs.length, jid }
}

// ── MESSAGE COUNTS ───────────────────────────────────────────────────────────
async function saveMessageCount(jid, sender) {
  if (!jid || !sender) return
  const db = readDB(FILES.msgcounts)
  if (!db[jid]) db[jid] = {}
  db[jid][sender] = (db[jid][sender] || 0) + 1
  writeDB(FILES.msgcounts, db)
}

async function getGroupMembersMessageCount(jid) {
  const db = readDB(FILES.msgcounts)
  return db[jid] || {}
}

async function getInactiveGroupMembers(jid, participants) {
  const counts = await getGroupMembersMessageCount(jid)
  return participants.filter(p => !counts[p.id] || counts[p.id] < 5)
}

// ── ANTIDELETE SETTINGS ──────────────────────────────────────────────────────
async function initializeAntiDeleteSettings(jid) {
  const db = readDB(FILES.antidel)
  if (!db[jid]) { db[jid] = { enabled: true }; writeDB(FILES.antidel, db) }
}

async function setAnti(jid, value) {
  const db = readDB(FILES.antidel)
  db[jid] = { enabled: value, ts: Date.now() }
  writeDB(FILES.antidel, db)
}

async function getAnti(jid) {
  const db = readDB(FILES.antidel)
  return db[jid]?.enabled ?? true
}

async function getAllAntiDeleteSettings() {
  return readDB(FILES.antidel)
}

// Stub (was in original)
const AntiDelDB = {}

module.exports = {
  AntiDelDB,
  initializeAntiDeleteSettings,
  setAnti,
  getAnti,
  getAllAntiDeleteSettings,
  saveContact,
  loadMessage,
  getName,
  getChatSummary,
  saveGroupMetadata,
  getGroupMetadata,
  saveMessageCount,
  getInactiveGroupMembers,
  getGroupMembersMessageCount,
  saveMessage
}
