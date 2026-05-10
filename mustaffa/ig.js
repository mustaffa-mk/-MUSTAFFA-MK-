const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ig",
    desc: "Download Instagram reels/posts",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply("❌ Please provide an Instagram link!\n\nExample:\n.instagram https://www.instagram.com/reel/xxxx/");
        }

        const igUrl = args[0];

        await conn.sendMessage(from, { react: { text: "📸", key: mek.key } });

        const apiUrl = `https://jawad-tech.vercel.app/igdl?url=${encodeURIComponent(igUrl)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result || !data.result.length) {
            return reply("❌ Failed to download this Instagram media.");
        }

        // Send first media (usually video)
        const media = data.result[0];

        if (media.contentType.startsWith("video")) {
            await conn.sendMessage(from, {
                video: { url: media.url },
                mimetype: "video/mp4",
                caption: "📸 *Instagram Downloader*"
            }, { quoted: mek });
        } else if (media.contentType.startsWith("image")) {
            await conn.sendMessage(from, {
                image: { url: media.url },
                caption: "📸 *Instagram Downloader*"
            }, { quoted: mek });
        } else {
            reply("❌ Unsupported media type.");
        }

    } catch (err) {
        console.error(err);
        reply("❌ Error while downloading Instagram media.");
    }
});