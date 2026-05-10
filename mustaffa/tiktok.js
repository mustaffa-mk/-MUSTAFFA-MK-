const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    desc: "Download TikTok video without watermark",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply("❌ Please provide a TikTok link!\n\nExample:\n.tiktok https://vt.tiktok.com/ZSag54Wbe/");
        }

        const tiktokUrl = args[0];
        const start = Date.now();

        await conn.sendMessage(from, { react: { text: "🎵", key: mek.key } });

        const apiUrl = `https://jawad-tech.vercel.app/download/tiktok?url=${encodeURIComponent(tiktokUrl)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result) {
            return reply("❌ Failed to download this TikTok video. Try another link.");
        }

        const videoUrl = data.result;
        const meta = data.metadata || {};

        const end = Date.now();
        const speed = end - start;

        let caption =
            `🎵 *TikTok Downloader*\n\n` +
            `📌 *Title:* ${meta.title || "Unknown"}\n` +
            `👤 *Author:* ${meta.author || "Unknown"}\n` +
            `⚡ *Speed:* ${speed} ms`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: caption
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ Error while downloading TikTok video.");
    }
});