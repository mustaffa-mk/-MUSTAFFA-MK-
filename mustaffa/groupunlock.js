const { cmd } = require('../command')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Unlock group (everyone can send messages)",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ Group only command");

        await conn.groupSettingUpdate(from, "not_announcement")

        reply("🔓 Group unlocked (everyone can send messages)")
    } catch (e) {
        console.log(e)
        reply("❌ Failed to unlock group (make sure bot is admin)")
    }
})
