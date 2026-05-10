const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    alias: ["pp", "profile", "dp"],
    desc: "Fetch user profile picture natively",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, botFooter }) => {
    try {
        // 1. Identify Target (Reply > Mention > Typed Number > Self)
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else if (q) {
            // Clean the input and format it for WhatsApp JID
            let num = q.replace(/[^0-9]/g, '');
            target = num + '@s.whatsapp.net';
        } else {
            target = m.sender; // Default to the person who sent the command
        }

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // 2. Fetch the Profile Picture Link Natively
        // 'image' parameter fetches the high-res version
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            // If high-res fails, try low-res or return error
            ppUrl = 'https://telegra.ph/file/0285437887752697a29f8.jpg'; // Default Placeholder
        }

        const userNumber = target.split('@')[0];

        // 3. Craft the Stylish Message
        const stylishMsg = `
✨ *𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲         ~⍟ᬼ⃟MD💀⃝⃪V2🕷️™ 𝐏𝐑𝐎𝐅𝐈𝐋𝐄* ✨

👤 *𝐔𝐬𝐞𝐫:* @${userNumber}
📂 *𝐒𝐭𝐚𝐭𝐮𝐬:* Successfully Retrieved
🛡️ *𝐒𝐨𝐮𝐫𝐜𝐞:* Native WhatsApp Server

> *MUSTAFFA 𝐀𝐈: 𝐒𝐢𝐦𝐩𝐥𝐞. 𝐅𝐚𝐬𝐭. 𝐑𝐞𝐥𝐢𝐚𝐛𝐥𝐞.*
`.trim();

        // 4. Send the result
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: stylishMsg,
            mentions: [target],
            footer: botFooter || 'MUSTAFFA ᴀɪ ᴋᴇɴʏᴀ 🇰🇪'
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("GETPP ERROR:", err);
        reply("❌ *Popkid, I couldn't fetch that!* \n\nThis happens if the user has hidden their profile picture or if the number is not on WhatsApp.");
    }
});
