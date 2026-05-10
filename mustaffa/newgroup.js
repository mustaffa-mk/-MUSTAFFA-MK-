const config = require('../config');
const { cmd } = require('../command');

// Newsletter settings
const NEWSLETTER_JID = "120363423997837331@newsletter";
const NEWSLETTER_NAME = "popkid xd";
const BOT = "Popkid XD";

// Stylish context
const getContextInfo = (title = "", body = "", sourceUrl = "") => ({
    forwardingScore: 999,
    isForwarded: true,

    forwardedNewsletterMessageInfo: {
        newsletterJid: NEWSLETTER_JID,
        newsletterName: NEWSLETTER_NAME,
        serverMessageId: 143
    },

    externalAdReply: {
        title: title || BOT,
        body: body || NEWSLETTER_NAME,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false,
        sourceUrl: sourceUrl || "https://whatsapp.com"
    },

    body: body || BOT,
    title: NEWSLETTER_NAME
});

cmd({
    pattern: "newgroup",
    alias: ["newgc", "creategroup"],
    react: "🆕",
    desc: "Create a new WhatsApp group",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, react, q, isOwner }) => {

    try {

        // Owner only check
        if (!isOwner) {
            await react("❌");
            return reply("❌ Owner Only Command!");
        }

        // Check group name
        if (!q || !q.trim()) {
            await react("❌");
            return reply("❌ Please provide a group name.\n\nExample:\n.newgc ATASSA MD");
        }

        const groupName = q.trim();

        // Create group with sender
        const group = await conn.groupCreate(groupName, [sender]);

        // Get invite code
        const inviteCode = await conn.groupInviteCode(group.id);

        // Create invite link
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // Success message
        const successText =
`🆕 Popkid XD Group Created

📛 Name : ${groupName}
🆔 ID   : ${group.id}
🔗 Link : ${inviteLink}

✅ Ready to manage the group.`;

        // Send success message with stylish newsletter forward
        await conn.sendMessage(from, {
            text: successText,
            contextInfo: getContextInfo(
                "🆕 New Group Created",
                groupName,
                inviteLink
            )
        }, { quoted: mek });

        await react("✅");

    } catch (error) {

        console.log(error);

        await react("❌");

        reply(`❌ Failed to create group.\n\nError: ${error.message}`);

    }

});
