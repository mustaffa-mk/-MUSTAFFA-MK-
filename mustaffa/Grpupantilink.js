const config = require('../config');
const { cmd } = require('../command');
const { handleAntilink } = require('../lib/antilink');

cmd({
    pattern: "antilink",
    desc: "Setup antilink actions",
    category: "group",
    filename: __filename
}, async (conn, m, mek, { from, reply, isGroup, args }) => {
    // We only check if it's a group, anyone can now trigger this
    if (!isGroup) return reply("Groups only.");

    const type = args[0] ? args[0].toLowerCase() : '';
    const action = args[1] ? args[1].toLowerCase() : '';

    // .antilink on / off
    if (type === "on") {
        config.ANTILINK = "true";
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return reply("🛡️ Antilink is now *ON* for this session.");
    }
    if (type === "off") {
        config.ANTILINK = "false";
        await conn.sendMessage(from, { react: { text: "🔓", key: mek.key } });
        return reply("🔓 Antilink is now *OFF*.");
    }

    // .antilink action delete/warn/kick
    if (type === "action") {
        if (['delete', 'warn', 'kick'].includes(action)) {
            config.ANTILINK_ACTION = action;
            return reply(`✅ Antilink action set to: *${action}*`);
        } else {
            return reply("📍 Usage: \n.antilink action delete\n.antilink action warn\n.antilink action kick");
        }
    }
    
    return reply("📍 *Commands:*\n.antilink on\n.antilink off\n.antilink action <delete/warn/kick>");
});

// Auto-detector (remains active for all messages)
cmd({ on: "body" }, async (conn, m, mek, { isGroup, isAdmins, isOwner }) => {
    await handleAntilink(conn, m, { isAdmins, isOwner });
});
