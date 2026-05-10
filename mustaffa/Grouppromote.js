const { cmd } = require('../command')

cmd({
    pattern: "promote",
    alias: ["addadmin"],
    react: "⬆️",
    desc: "Promote a member to admin",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, quoted }) => {
    try {
        if (!isGroup) return reply("❌ Group only command")

        let user

        if (m.mentionedJid && m.mentionedJid[0]) {
            user = m.mentionedJid[0]
        } else if (quoted) {
            user = quoted.sender
        } else {
            return reply("❌ Reply or mention a user to promote")
        }

        await conn.groupParticipantsUpdate(from, [user], "promote")

        return reply("✅ User promoted to admin successfully")

    } catch (e) {
        console.log("Promote Error:", e)
        return reply("❌ Failed to promote user (make sure bot is admin)")
    }
})
