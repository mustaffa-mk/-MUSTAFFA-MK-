const { cmd } = require('../command');
const config = require('../config');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "save",
    desc: "Saves the quoted status to the current chat",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, reply }) => {
    try {
        // 1. Properly catch the quoted message
        const quoted = m.quoted ? m.quoted : m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
        if (!quoted) return reply("❌ *Please reply to a status image or video with .save*");

        const mime = quoted.mtype || quoted.type;
        const isImage = mime === 'imageMessage';
        const isVideo = mime === 'videoMessage';

        if (!isImage && !isVideo) return reply("❌ *Please reply to an Image or Video status.*");

        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

        // 2. Download the actual media stream
        const messageType = isImage ? 'image' : 'video';
        const stream = await downloadContentFromMessage(quoted[mime] || quoted, messageType);
        let mediaBuffer = Buffer.from([]);
        for await (const chunk of stream) {
            mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
        }

        // 3. Define the fake vCard (Popkid Ke)
        const fakevCard = {
            key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
            message: {
                contactMessage: {
                    displayName: "Popkid Ke",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:popkid\nORG:popkid;\nTEL;type=CELL;type=VOICE;waid=254111385747:+254111385747\nEND:VCARD`
                }
            }
        };

        // 4. CLEAN CONTEXT: Removed externalAdReply to get rid of the big black image
        const cleanContextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363423997837331@newsletter',
                newsletterName: config.OWNER_NAME || 'POPKID',
                serverMessageId: 1
            }
        };

        // 5. Send the media with the clean style
        if (isImage) {
            await conn.sendMessage(from, { 
                image: mediaBuffer, 
                caption: quoted.caption || "", 
                contextInfo: cleanContextInfo 
            }, { quoted: fakevCard });
        } else {
            await conn.sendMessage(from, { 
                video: mediaBuffer, 
                caption: quoted.caption || "", 
                contextInfo: cleanContextInfo 
            }, { quoted: fakevCard });
        }

    } catch (err) {
        console.error("SAVE ERROR:", err);
        reply("❌ *Failed to download status.*");
    }
});
