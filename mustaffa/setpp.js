const { cmd } = require('../command');

cmd({
    pattern: "setpp",
    alias: ["setdp", "updatepp"],
    desc: "Update the bot or group profile picture",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, reply, botFooter }) => {
    try {
        // 1. Security Check: Only Owner or Group Admin should change the PP
        if (!isOwner && (!isGroup || !isAdmins)) {
            return reply("❌ *Popkid, this command is restricted to Owner or Group Admins!*");
        }

        // 2. Check if an image is quoted or sent
        const quotedMsg = m.quoted ? m.quoted : m;
        const mime = (quotedMsg.msg || quotedMsg).mimetype || '';

        if (!/image/.test(mime)) {
            return reply("📸 *Popkid, please reply to an image to set it as the profile picture!*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // 3. Download the image buffer
        const media = await quotedMsg.download();
        
        // 4. Update Logic (Group vs. Bot)
        if (isGroup && m.message.conversation.includes("-group")) {
            // Option to update group PP if command is '.setpp -group'
            await conn.updateProfilePicture(from, media);
            reply("✅ *Group Profile Picture updated successfully!*");
        } else {
            // Default: Updates the Bot's own Profile Picture
            await conn.updateProfilePicture(conn.user.id, media);
            
            const successMsg = `
✨ *𝐏𝐎𝐏𝐊𝐈𝐃-𝐌𝐃 𝐔𝐏𝐃𝐀𝐓𝐄* ✨

🖼️ *𝐒𝐭𝐚𝐭𝐮𝐬:* Profile Picture Changed
👤 *𝐀𝐜𝐭𝐢𝐨𝐧 𝐛𝐲:* Popkid
🛡️ *𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲:* Native Encryption

> *Your bot identity has been refreshed.*
`.trim();

            await conn.sendMessage(from, { 
                text: successMsg,
                footer: botFooter || 'ᴘᴏᴘᴋɪᴅ ᴀɪ ᴋᴇɴʏ𝐚 🇰🇪'
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("SETPP ERROR:", err);
        reply("❌ *Failed to update Profile Picture.* \n\nEnsure the image is not too large and the bot has full permissions.");
    }
});
