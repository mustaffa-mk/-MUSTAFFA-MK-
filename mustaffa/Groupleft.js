const { cmd } = require('../command')
const { sleep } = require('../lib/functions')

cmd({
    pattern: "left",
    react: "🚪",
    desc: "Make the bot leave the group",
    category: "group",
    use: '.left',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, pushname, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("⚠️ Access Denied. Only my Creator can use this command.");
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        await conn.sendMessage(from, { text: `✔️ Leaving group as requested by ${pushname}` }, { quoted: mek });
        await sleep(1000);
        await conn.groupLeave(from);

    } catch (e) {
        console.log(e);
        reply(`❌ Error occurred: ${e.message || e}`);
    }
});
