const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    alias: ["developer", "MUSTAFFA"],
    desc: "Get information about the bot owner",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = "254111385747"; // Your WhatsApp number
        const ownerName = "MUSTAFFA Kenya";
        const ownerOrg = "MUSTAFFA AI Labs";
        const githubProfile = "https://github.com/popkidc";
        const profilePic = "https://files.catbox.moe/j9ia5c.png"; // Your preferred image

        // Define the vCard format
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${ownerName}\n`
            + `ORG:${ownerOrg};\n`
            + `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n`
            + `URL;type=github:${githubProfile}\n`
            + 'END:VCARD';

        // Message body
        let ownerMsg = `👑 *MUSTAFFA-MD OWNER INFO* 👑

👤 *Name:* ${ownerName}
🌍 *Location:* Kenya 🇰🇪
💻 *Role:* Full-Stack Developer
🔗 *GitHub:* ${githubProfile}

> *Feel free to contact me for script updates or bot deployment!* ⚡`;

        // 1. Send the Contact Card first
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        // 2. Send the Image with the details
        await conn.sendMessage(from, {
            image: { url: profilePic },
            caption: ownerMsg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363423997837331@newsletter',
                    newsletterName: 'MUSTAFFA UPDATES',
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Could not fetch owner information.");
    }
});
