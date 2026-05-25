/**
 * MUSTAFFA-MD Configuration
 * Edit all settings here before starting the bot
 */

module.exports = {
  // ── SESSION ──────────────────────────────────────────────────
  // Paste your session ID here (from the pairing tool)
  // Format: MUSTAFFA;;;xxxxxxxxxxxxxxxxxxxxxxx
  SESSION_ID: process.env.SESSION_ID || '',

  // ── BOT IDENTITY ─────────────────────────────────────────────
  BOT_NAME   : process.env.BOT_NAME    || '𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™',
  PREFIX     : process.env.PREFIX      || ',',
  OWNER_NAME : process.env.OWNER_NAME  || '𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '254708637572',

  // ── AUTO FEATURES ────────────────────────────────────────────
  AUTO_REACT        : process.env.AUTO_REACT         || 'true',   // React to every message
  AUTO_TYPING       : process.env.AUTO_TYPING        || 'true',   // Show typing indicator on commands
  AUTO_RECORDING    : process.env.AUTO_RECORDING     || 'false',  // Show recording on audio commands
  READ_MESSAGE      : process.env.READ_MESSAGE       || 'true',   // Read all messages (blue ticks)

  // ── STATUS SETTINGS ──────────────────────────────────────────
  AUTO_STATUS_SEEN  : process.env.AUTO_STATUS_SEEN   || 'true',   // Auto view statuses
  AUTO_READ_STATUS  : process.env.AUTO_READ_STATUS   || 'true',   // Alias for AUTO_STATUS_SEEN
  AUTO_STATUS_REACT : process.env.AUTO_STATUS_REACT  || 'true',   // React to statuses
  AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS  || 'true',   // Alias for AUTO_STATUS_REACT
  AUTO_STATUS_REPLY : process.env.AUTO_STATUS_REPLY  || 'false',  // Auto reply to statuses
  AUTO_STATUS_MSG   : process.env.AUTO_STATUS_MSG    || '👀 Seen by 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲⍟ᬼ⃟MD💀⃝⃪V2🕷️™',

  // ── AUTO BIO ─────────────────────────────────────────────────
  AUTO_BIO          : process.env.AUTO_BIO           || 'true',   // Update bio with time

  // ── ANTI FEATURES ────────────────────────────────────────────
  ANTICALL          : process.env.ANTICALL           || 'true',   // Reject incoming calls
  ANTIDELETE        : process.env.ANTIDELETE         || 'true',   // Re-send deleted messages
  ANTILINK          : process.env.ANTILINK           || 'false',  // Delete group links
  ANTISPAM          : process.env.ANTISPAM           || 'true',  // Anti-spam in groups

  // ── GROUP SETTINGS ───────────────────────────────────────────
  WELCOME_MSG       : process.env.WELCOME_MSG        || 'true',   // Welcome new members
  GOODBYE_MSG       : process.env.GOODBYE_MSG        || 'true',   // Farewell leaving members
  AUTO_PROMOTE_MSG  : process.env.AUTO_PROMOTE_MSG   || 'true',   // Announce promotions

  // ── MEDIA APIS ───────────────────────────────────────────────
  // eliteprotech API for video/audio downloads
  ELITE_API         : process.env.ELITE_API          || 'https://eliteprotech.com/api',
  // Tenor API key for GIFs (optional)
  TENOR_API_KEY     : process.env.TENOR_API_KEY      || '',

  // ── MISC ─────────────────────────────────────────────────────
  ALIVE_IMG         : process.env.ALIVE_IMG          || 'https://files.catbox.moe/ux2l8q.jpg',
  BOT_VERSION       : '1.0.0',
  HEROKU_APP_NAME   : process.env.HEROKU_APP_NAME    || '',
}
