# 🌠MUSTAFFA-XMD-V2🌠 WhatsApp Bot

A fully-featured WhatsApp bot powered by **gifted-baileys**.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Session
Edit `config.js` and set your `SESSION_ID`:
```js
SESSION_ID: 'MUSTAFFA;;;your_mega_file_id_here'
```
Or copy `.env.example` to `.env` and fill it in.

### 3. Set Your Owner Number
In `config.js`:
```js
OWNER_NUMBER: '254xxxxxxxxx'  // your WhatsApp number (no + or spaces)
```

### 4. Start the Bot
```bash
npm start
```

---

## 📁 File Structure

```
mustaffa-xmd-v2/
├── index.js           ← Main bot file
├── config.js          ← All settings here
├── command.js         ← Command registry
├── package.json
├── .env.example       ← Copy to .env
│
├── lib/
│   ├── index.js       ← sms() helper
│   ├── functions.js   ← Utility functions
│   ├── antidelete.js  ← AntiDelete handler
│   └── groupevents.js ← Welcome/goodbye/promote
│
├── data/
│   └── index.js       ← JSON database layer
│
├── plugins/           ← All commands live here
│   ├── menu.js        ← .menu / .help
│   ├── general.js     ← .alive .ping .info
│   ├── group.js       ← .kick .promote .tagall
│   ├── media.js       ← .sticker .play .video
│   ├── tools.js       ← .weather .calc .translate
│   ├── autofeatures.js← .antidelete .anticall etc
│   └── owner.js       ← .broadcast .restart etc
│
└── sessions/          ← Session files (auto-created)
```

---

## 🔑 Commands

| Command | Description |
|---|---|
| `.menu` | Show full command menu |
| `.alive` | Check bot status |
| `.ping` | Response speed |
| `.sticker` | Image/video → sticker |
| `.play <song>` | Download audio |
| `.video <name>` | Download video |
| `.tiktok <url>` | Download TikTok |
| `.weather <city>` | Weather info |
| `.calc <expr>` | Calculator |
| `.translate <text>` | Translate to English |
| `.define <word>` | Dictionary |
| `.qr <text>` | QR code generator |
| `.github <user>` | GitHub profile |
| `.lyrics <song>` | Song lyrics |
| `.kick @user` | Kick from group |
| `.promote @user` | Promote to admin |
| `.demote @user` | Demote admin |
| `.tagall` | Tag all members |
| `.groupinfo` | Group details |
| `.mute` / `.unmute` | Lock/unlock chat |
| `.invitelink` | Get invite link |
| `.features` | Show all toggles |
| `.antidelete on/off` | Toggle antidelete |
| `.anticall on/off` | Toggle anticall |
| `.autoreact on/off` | Toggle auto react |
| `.broadcast <msg>` | Broadcast (owner) |
| `.restart` | Restart bot (owner) |

### Owner-only eval:
- `%expression` — sync eval
- `$code` — async eval

---

## 🛠️ Adding Plugins

Create a new file in `plugins/`:

```js
const { addCommand } = require('../command')
const config = require('../config')

addCommand({
  pattern  : 'hello',
  alias    : ['hi', 'hey'],
  desc     : 'Say hello',
  category : 'general',
  react    : '👋',

  async function(conn, mek, m, { reply, pushname }) {
    reply(`Hello ${pushname}! 👋`)
  }
})
```

---

## 🌐 Deployment

### PM2 (recommended)
```bash
npm install -g pm2
pm2 start index.js --name mustaffa-md
pm2 save
pm2 startup
```

### Heroku
Set environment variables in the Heroku dashboard or via CLI:
```bash
heroku config:set SESSION_ID=MUSTAFFA;;;yourID
```

### Termux (Android)
```bash
pkg install nodejs git
git clone <your-repo>
cd mustaffa-md
npm install
npm start
```

---

## 📝 Notes

- Session files are stored in `sessions/` — keep them safe
- Data (messages, contacts) stored in `data/*.json`
- Prefix defaults to `.` — change in config.js
- The bot uses gifted-baileys v2.0.6

---

Made with 🕷AURA🕷 by **🌠MUSTAFFA MK🌠**
