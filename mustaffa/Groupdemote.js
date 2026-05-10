const { cmd } = require('../command')

cmd({
    pattern: "demote",
    alias: ["removeadmin"],
    react: "⬇️",
    desc: "Demote an admin to member",
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
            return reply("❌ Reply or mention a user to demote")
        }

        // perform demote
        await conn.groupParticipantsUpdate(from, [user], "demote")

        // stop execution after success
        return reply("✅ User demoted successfully")

    } catch (e) {
        console.log("Demote Error:", e)

        // only send fail if actual error
        return reply("❌ Failed to demote user (make sure bot is admin)")
    }
})
