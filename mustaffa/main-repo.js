const axios = require('axios');
const config = require('../config');

module.exports = {
    cmd: "repo",
    alias: ["git", "sc", "script"],
    desc: "Fetch the bot repository details",
    category: "MAIN",
    async execute(conn, m, { from, reply, sender }) {
        try {
            const repoUrl = "https://github.com/mustaffa-mk/-MUSTAFFA-MK-";
            const apiUrl = "https://api.github.com/repos/mustaffa-mk/-MUSTAFFA-MK-";

            const response = await axios.get(apiUrl, {
                headers: { 'User-Agent': 'POPKID-MD' }
            });
            const data = response.data;

            let repoMsg = `❤️ *MUSTAFFA REPO DETAILS* ♥️\n\n` +
                `✨ *Repository Name:* ${data.name}\n` +
                `👤 *Owner:* ${data.owner.login}\n` +
                `⭐ *Stars:* ${data.stargazers_count}\n` +
                `🍴 *Forks:* ${data.forks_count}\n` +
                `📅 *Last Updated:* ${new Date(data.updated_at).toLocaleDateString()}\n\n` +
                `🔗 *Repo Link:* ${repoUrl}\n\n` +
                `> *Created by Mustaffa* 🔪☔`;

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

            await conn.sendMessage(from, {
                image: { url: 'https://d.uguu.se/CHfVCoZs.jpg' },
                caption: repoMsg,
                contextInfo: newsletterContextInfo
            }, { quoted: fakevCard });

        } catch (e) {
            console.log(e);
            reply("❌ Error fetching repository details. Please try again later.");
        }
    }
};
