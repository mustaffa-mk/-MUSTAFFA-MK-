const { cmd, commands } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions2');

//---------------------------------------------------------------------------
// POPKID AI: PROFESSIONAL LOGO SYSTEM (POPKID-MD)
//---------------------------------------------------------------------------

// 1. SINGLE-TEXT EFFECTS (Mapped to Logical Command Names)
const singleEffects = [
    { pattern: "nigeria", api: "nigerianflag", react: "🇳🇬" },
    { pattern: "america", api: "americanflag", react: "🇺🇸" },
    { pattern: "glitch", api: "glitchtext", react: "👾" },
    { pattern: "glow", api: "advancedglow", react: "🌟" },
    { pattern: "silver", api: "glossysilver", react: "🥈" },
    { pattern: "write", api: "writetext", react: "✍️" },
    { pattern: "blackpink", api: "blackpinklogo", react: "💗" },
    { pattern: "hacker", api: "hackerAvatar", react: "💻" },
    { pattern: "neon", api: "colorfulneon", react: "🌈" },
    { pattern: "dragonball", api: "dragonball", react: "🐉" },
    { pattern: "comic", api: "comic3d", react: "💥" },
    { pattern: "naruto", api: "narutoShippuden", react: "🦊" },
    { pattern: "tattoo", api: "arrowTattoo", react: "🏹" },
    { pattern: "luxury", api: "luxurygold", react: "🏆" },
    { pattern: "galaxy", api: "galaxystyle", react: "🌌" },
    { pattern: "neonglitch", api: "neonglitch", react: "⚡" },
    { pattern: "pixel", api: "pixelglitch", react: "👾" },
    { pattern: "typo", api: "typographytext", react: "🔠" },
    { pattern: "delete", api: "deletingtext", react: "📝" },
    { pattern: "cartoon", api: "cartoonstyle", react: "🎨" },
    { pattern: "maker", api: "logomaker", react: "🛠️" },
    { pattern: "underwater", api: "underwater", react: "🌊" },
    { pattern: "multicolor", api: "multicolored", react: "🌈" },
    { pattern: "beach", api: "summerbeach", react: "🏖️" },
    { pattern: "clouds", api: "effectclouds", react: "☁️" },
    { pattern: "vintage", api: "1917", react: "🎞️" },
    { pattern: "watercolor", api: "watercolor", react: "🖌️" },
    { pattern: "shield", api: "mascotShield", react: "🛡️" },
    { pattern: "balloon", api: "foilBalloon", react: "🎈" },
    { pattern: "broken", api: "brokenGlass", react: "🔨" },
    { pattern: "football", api: "footballLogo", react: "⚽" },
    { pattern: "devil", api: "neonDevilWings", react: "😈" },
    { pattern: "snow", api: "christmasSnow", react: "🎄" },
    { pattern: "firework", api: "fireworks", react: "🎆" },
    { pattern: "sand", api: "sandWriting", react: "🏖️" },
    { pattern: "angel", api: "angelWing", react: "😇" },
    { pattern: "fog", api: "foggyGlass", react: "🌫️" },
    { pattern: "metal", api: "shinyMetallic3d", react: "✨" },
    { pattern: "future", api: "futuristicLight", react: "🚀" }
];

// 2. DUAL-TEXT EFFECTS (Mapped to Logical Command Names)
const dualEffects = [
    { pattern: "space", api: "space3d", react: "🚀" },
    { pattern: "pornhub", api: "pornhubLogo", react: "🟠" },
    { pattern: "sketch", api: "pencilSketch", react: "✏️" },
    { pattern: "thor", api: "thorLogo", react: "🔨" },
    { pattern: "deadpool", api: "deadpool", react: "💀" },
    { pattern: "shirt", api: "footballShirt", react: "👕" },
    { pattern: "wolf", api: "wolfGalaxy", react: "🐺" },
    { pattern: "marvel", api: "marvelLogo", react: "🦸" },
    { pattern: "avengers", api: "avengersLogo", react: "🅰️" },
    { pattern: "tiktok", api: "tiktok", react: "📱" }
];

// --- Registration Logic ---

singleEffects.forEach((effect) => {
    cmd({
        pattern: effect.pattern,
        desc: `Generate a ${effect.pattern} logo`,
        category: "logo",
        react: effect.react,
        filename: __filename
    }, async (conn, mek, m, { from, args, reply }) => {
        try {
            const name = args.join(" ").trim();
            if (!name) return reply(`❌ Please provide a name.\nExample: .${effect.pattern} Popkid`);

            const apiUrl = `https://api.giftedtech.co.ke/api/ephoto360/${effect.api}?apikey=gifted&text=${encodeURIComponent(name)}`;
            const data = await fetchJson(apiUrl);

            if (!data || !data.success || !data.result?.image_url) {
                return reply("❌ Generation failed. The API might be offline.");
            }

            await conn.sendMessage(from, {
                image: { url: data.result.image_url },
                caption: `*${effect.react} POPKID AI: ${effect.pattern.toUpperCase()} ${effect.react}*\n\n*👤 Name:* ${name}\n\n*Created by Popkid Kenya*`
            }, { quoted: m });
        } catch (e) { reply(`*Error:* ${e.message}`); }
    });
});

dualEffects.forEach((effect) => {
    cmd({
        pattern: effect.pattern,
        desc: `Generate a ${effect.pattern} logo`,
        category: "logo",
        react: effect.react,
        filename: __filename
    }, async (conn, mek, m, { from, args, reply }) => {
        try {
            const input = args.join(" ").trim();
            if (!input) return reply(`❌ Please provide text.\nExample: .${effect.pattern} Popkid, AI`);

            let t1, t2;
            if (input.includes(",")) {
                [t1, t2] = input.split(",").map(i => i.trim());
            } else {
                let split = input.split(" ");
                t1 = split[0];
                t2 = split.slice(1).join(" ") || "AI";
            }

            const apiUrl = `https://api.giftedtech.co.ke/api/ephoto360/${effect.api}?apikey=gifted&text1=${encodeURIComponent(t1)}&text2=${encodeURIComponent(t2)}`;
            const data = await fetchJson(apiUrl);

            if (!data || !data.success || !data.result?.image_url) {
                return reply("❌ Generation failed. Try with shorter names.");
            }

            await conn.sendMessage(from, {
                image: { url: data.result.image_url },
                caption: `*${effect.react} POPKID AI: ${effect.pattern.toUpperCase()} ${effect.react}*\n\n*👤 Text 1:* ${t1}\n*👤 Text 2:* ${t2}\n\n*Created by Popkid Kenya*`
            }, { quoted: m });
        } catch (e) { reply(`*Error:* ${e.message}`); }
    });
});
