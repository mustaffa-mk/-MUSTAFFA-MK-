const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "repo",
    alias: ["git", "sc", "script"],
    desc: "Fetch the bot repository details",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const repoUrl = "https://github.com/mustaffa-mk/-MUSTAFFA-MK-";
        const apiUrl = "https://api.github.com/mustaffa-mk/-MUSTAFFA-MK-";
        
        // Fetching real-time data from GitHub
        const response = await axios.get(apiUrl);
        const data = response.data;

        let repoMsg = `❤️ *MUSTAFFA REPO DETAILS* ♥️

✨ *Repository Name:* ${data.name}
👤 *Owner:* ${data.owner.login}
⭐ *Stars:* ${data.stargazers_count}
🍴 *Forks:* ${data.forks_count}
📅 *Last Updated:* ${new Date(data.updated_at).toLocaleDateString()}

🔗 *Repo Link:* ${repoUrl}

> *Created by Mustaffa* 🔪☔`;

        // Define the fakevCard (Popkid Ke)
        const fakevCard = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "Mustaffa",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Mustaffa\nORG:mustaffa;\nTEL;type=CELL;type=VOICE;waid=254111385747:+254111385747\nEND:VCARD`
                }
            }
        };

        // Clean context info (Removed externalAdReply)
        const newsletterContextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363426802375516@newsletter',
                newsletterName: config.OWNER_NAME || 'Mustaffa',
                serverMessageId: 1
            }
        };

        // Sending image with caption and context, but no ad reply
        await conn.sendMessage(from, {
            image: { url: `https://d.uguu.se/CHfVCoZs.jpg` },
            caption: repoMsg,
            contextInfo: newsletterContextInfo
        }, { quoted: fakevCard });

    } catch (e) {
        console.log(e);
        reply("❌ Error fetching repository details. Please try again later.");
    }
});
