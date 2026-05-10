const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
//        iOS STYLE HELPERS (UI)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

const isEnabled = (val) => 
    val && val.toString().toLowerCase() === "true";

// iOS-style Toggle Switches
const toggle = (val) => 
    isEnabled(val) ? " ON  [🟢]" : " OFF [⚪]";

const row = (label, value) => 
    `│  📂 *${label.padEnd(14)}* : ${value}\n`;

const sectionHeader = (title) => 
    `╭───────────────╮\n│  📱 *${title}*\n├───────────────╯\n`;

const sectionFooter = 
    `╰━━━━━━━━━━━━━━━╼\n`;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
//          SYSTEM COMMAND
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

cmd({
    pattern: "config",
    alias: ["settings", "setup", "ios", "panel"],
    desc: "iOS-themed Bot Configuration Menu",
    category: "system",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {

    try {
        // --- Define the Fake vCard ---
        const fakevCard = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "MUSTAFFA Ke",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:MUSTAFFA\nORG:MUSTAFFA;\nTEL;type=CELL;type=VOICE;waid=254111385747:+254111385747\nEND:VCARD`
                }
            }
        };

        // --- Build iOS Menu Body ---
        let iosMenu = ` *${config.BOT_NAME}* Settings\n`;
        iosMenu += `_Software Version: 17.4.1 (Stable)_\n\n`;

        iosMenu += sectionHeader("SYSTEM PROFILE");
        iosMenu += row("Owner", "MUSTAFFA Ke");
        iosMenu += row("Uptime", runtime(process.uptime()));
        iosMenu += row("Mode", config.MODE.toUpperCase());
        iosMenu += sectionFooter;

        iosMenu += sectionHeader("CONNECTIVITY");
        iosMenu += row("Public Mode", toggle(config.PUBLIC_MODE));
        iosMenu += row("Always On", toggle(config.ALWAYS_ONLINE));
        iosMenu += row("Read Chat", toggle(config.READ_MESSAGE));
        iosMenu += sectionFooter;

        iosMenu += sectionHeader("AUTOMATION");
        iosMenu += row("Auto Reply", toggle(config.AUTO_REPLY));
        iosMenu += row("Auto React", toggle(config.AUTO_REACT));
        iosMenu += row("Auto Stick", toggle(config.AUTO_STICKER));
        iosMenu += sectionFooter;

        iosMenu += sectionHeader("PRIVACY & SECURITY");
        iosMenu += row("Anti-Link", toggle(config.ANTI_LINK));
        iosMenu += row("Anti-Bad", toggle(config.ANTI_BAD));
        iosMenu += row("Anti-ViewOnce", toggle(config.ANTI_VV));
        iosMenu += sectionFooter;

        iosMenu += sectionHeader("STATUS UPDATES");
        iosMenu += row("Auto View", toggle(config.AUTO_STATUS_SEEN));
        iosMenu += row("Auto Like", toggle(config.AUTO_STATUS_REACT));
        iosMenu += sectionFooter;

        iosMenu += `\n📌 _System status verified by MUSTAFFA XD_`;

        // --- Send Message with iOS Adjustments ---
        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: iosMenu,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    // Professional Ad-Reply (iOS Style)
                    externalAdReply: {
                        title: " System Settings Panel",
                        body: "Configuration Management Unit",
                        mediaType: 1,
                        thumbnailUrl: config.MENU_IMAGE_URL,
                        sourceUrl: "https://wa.me/254111385747",
                        showAdAttribution: true
                    }
                }
            },
            { quoted: fakevCard } // This attaches the fake vCard to the message
        );

    } catch (error) {
        console.error("iOS Config Error:", error);
        reply(`⚠️ *System Error:* ${error.message}`);
    }
});
