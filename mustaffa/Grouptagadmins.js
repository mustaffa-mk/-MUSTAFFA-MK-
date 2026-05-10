const { cmd } = require('../command');

cmd({
    pattern: "tagadmins",
    react: "👮",
    aliases: ["taggcadmins", "taggroupadmins"],
    category: "group",
    desc: "Tag all group admins with optional message", // changed 'description' to 'desc' to match your bot's style
    filename: __filename
},
async (from, Gifted, conText) => {
    // Added 'groupMetadata' to the destructured conText as most Gifted-MD versions provide it there
    const { reply, react, isAdmin, isGroup, isSuperUser, mek, sender, q, botName, groupMetadata } = conText;

    if (!isGroup) {
        return reply("❌ This command only works in groups!");
    }

    // Checking if the user has permission
    if (!isAdmin && !isSuperUser) {
        return reply("❌ Admin/Owner Only Command!");
    }

    try {
        // Use the metadata from conText, or fetch it if not present
        const meta = groupMetadata || await Gifted.groupMetadata(from);
        const participants = meta.participants;

        const superAdmins = [];
        const admins = [];

        // Correctly identifying admin levels
        for (let p of participants) {
            if (p.admin === "superadmin") {
                superAdmins.push(p.id);
            } else if (p.admin === "admin") {
                admins.push(p.id);
            }
        }

        const allAdmins = [...superAdmins, ...admins];
        
        if (allAdmins.length === 0) {
            return reply("❌ No admins found in this group!");
        }

        // We use mentions so the admins actually get a notification
        let mentions = [...allAdmins, sender];

        let text = `*${botName || 'POPKID AI'} TAG ADMINS*\n\n`;
        
        if (q && q.trim()) {
            text += `*Message:* ${q.trim()}\n\n`;
        }
        
        text += `*Tagged By:* @${sender.split('@')[0]}\n\n`;
        text += `*Tagged Admins:*\n`;

        // Building the list with emojis
        for (let id of superAdmins) {
            text += `👑 @${id.split('@')[0]}\n`;
        }
        for (let id of admins) {
            text += `👮 @${id.split('@')[0]}\n`;
        }

        // Sending the final message with mentions
        await Gifted.sendMessage(from, {
            text: text.trim(),
            mentions: mentions
        }, { quoted: mek });

        await react("✅");

    } catch (error) {
        console.error("Tagadmins error:", error);
        await react("❌");
        return reply(`❌ Failed to tag admins: ${error.message}`);
    }
});
