const { cmd, commands } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions2');

//---------------------------------------------
//           KHAN-MD: HACKER LOGO
//---------------------------------------------
cmd({
    pattern: "hacker",
    desc: "Create a Hacker Avatar text effect",
    category: "logo",
    react: "💻",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args.length) {
            return reply("❌ Please provide a name. Example: .hacker Popkid");
        }
        
        const name = args.join(" ");
        
        // Build the API URL using the Gifted Tech endpoint
        const apiUrl = `https://api.giftedtech.co.ke/api/ephoto360/hackerAvatar?apikey=gifted&text=${encodeURIComponent(name)}&style=1`;

        // Fetch JSON response from the API
        const data = await fetchJson(apiUrl);

        // Validation based on the JSON structure you provided
        if (!data || !data.success || !data.result?.image_url) {
            return reply("❌ Failed to generate logo. The API might be offline or hitting a limit.");
        }

        // Send the image directly using the result.image_url
        await conn.sendMessage(from, {
            image: { url: data.result.image_url },
            caption: `*💻 POPKID-MD HACKER AVATAR 💻*\n\n*👤 Name:* ${name}\n*🛠️ Style:* 1\n\n*Created by Popkid*`
        }, { quoted: m });

    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});
