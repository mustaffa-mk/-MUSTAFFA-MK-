const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply }) => {
    try {
        const msr = {
            own_cmd: "⚠️ *Access Denied*\n\nYou don't have permission to use this command. Only my *Creator* can perform this action."
        };

        // Only allow the creator to use the command (Functionality Kept)
        if (!isCreator) return reply(msr.own_cmd);

        // Input check (Functionality Kept)
        if (!q && !quoted) return reply("📍 *Please provide a Group Link*️ 🖇️\n\n*Usage:* `.join <link>` or reply to a link.");

        let groupLink;

        // Link Extraction (Functionality Kept)
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("❌ *Invalid Group Link* 🖇️\n\nMake sure it is a valid WhatsApp invite URL.");

        // Accept the group invite
        await conn.groupAcceptInvite(groupLink);

        // Stylish Success Message
        const successText = `✨ *POPKID-XD JOINER* ✨\n\n✔️ *Successfully Joined*\n👤 *Requested By:* ${pushname}\n\n> *I am now a member of the group. Ready to manage!*`;

        await conn.sendMessage(from, { 
            text: successText,
            contextInfo: {
                externalAdReply: {
                    title: "POPKID-XD NETWORK",
                    body: "Group Entry Success",
                    mediaType: 1,
                    sourceUrl: "https://github.com/popkidmd",
                    thumbnailUrl: "https://files.catbox.moe/aapw1p.png", // Your provided image
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Error Occurred!!*\n\n*Details:* ${e.message || e}`);
    }
});
