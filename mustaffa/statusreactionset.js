const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "setstatusreact",
    alias: ["statusemoji", "reactset"],
    desc: "Set custom emojis for status reactions.",
    category: "owner",
    use: ".setstatusreact ❤️,🔥,👑",
    filename: __filename
},
async (conn, mek, m, { from, args, q, isOwner, reply }) => {
    if (!isOwner) return reply("❌ This command is only for my Owner.");
    if (!q) return reply("Please provide emojis separated by commas. \n*Example:* .setstatusreact ❤️,🔥,✨");

    // Clean up the input
    const emojiList = q.split(',').map(e => e.trim()).join(',');
    
    // Update the config in memory
    config.STATUS_REACTIONS = emojiList;

    return reply(`✅ *Status Reactions Updated!*\n\nNew Emojis: ${emojiList}\n\n_Note: If you restart the bot, it will revert to the ENV value unless you update your config file/dashboard as well._`);
})

cmd({
    pattern: "getstatusreact",
    desc: "Check current status reaction emojis.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ This command is only for my Owner.");
    const current = config.STATUS_REACTIONS || '❤️,🔥,✨,⚡,💎,👑';
    return reply(`📊 *Current Status Emojis:* \n\n${current}`);
})
