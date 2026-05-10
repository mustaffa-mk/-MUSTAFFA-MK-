const { cmd } = require('../command');
const fs = require('fs');

const dataPath = './data/antitag.json';

if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));

// ==================== 1. THE COMMAND ====================
cmd({
    pattern: "antitag",
    desc: "Protect group from mass mentions",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, args, reply }) => {
    try {
        if (!isGroup) return reply("❌ *Popkid, this is for groups only!*");
        if (!isAdmins && !isOwner) return reply("❌ *Admin or Owner access required.*");

        let settings = JSON.parse(fs.readFileSync(dataPath));
        const status = args[0]?.toLowerCase();
        const action = args[1]?.toLowerCase() || 'delete';

        if (status === 'on') {
            settings[from] = { enabled: true, action: action };
            fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2));
            return reply(`✅ *Antitag Enabled*\n🛡️ *Action:* ${action.toUpperCase()}`);
        } 
        
        if (status === 'off') {
            settings[from] = { enabled: false };
            fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2));
            return reply("❌ *Antitag Disabled.*");
        }

        reply(`🛡️ *Popkid-MD Antitag Settings*\n\nUsage: .antitag [on/off] [delete/warn/kick]`);
    } catch (err) {
        reply("❌ Error updating settings.");
    }
});

// ==================== 2. THE WATCHER (Enhanced Detection) ====================
cmd({
    on: "main" // Changed from "body" to "main" to catch all message types
}, async (conn, mek, m, { from, isGroup, isAdmins, isOwner, body }) => {
    try {
        if (!isGroup || isAdmins || isOwner) return; 

        const settings = JSON.parse(fs.readFileSync(dataPath));
        if (!settings[from] || !settings[from].enabled) return;

        // --- ENHANCED DETECTION ---
        // Checks mentions in ANY message type (text, image caption, etc.)
        const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || 
                         m.message?.imageMessage?.contextInfo?.mentionedJid || 
                         m.message?.videoMessage?.contextInfo?.mentionedJid || [];
        
        const isTextTag = body?.includes('@everyone') || body?.includes('@here');
        const isMassTag = mentions.length > 5 || isTextTag;

        if (isMassTag) {
            const action = settings[from].action;

            // --- AGGRESSIVE DELETE ---
            await conn.sendMessage(from, { 
                delete: mek.key 
            });

            if (action === 'warn') {
                await conn.sendMessage(from, { 
                    text: `⚠️ @${m.sender.split('@')[0]}, mass tagging is not allowed!`,
                    mentions: [m.sender]
                });
            } else if (action === 'kick') {
                await conn.groupParticipantsUpdate(from, [m.sender], "remove");
            }
        }
    } catch (err) {
        console.log("Antitag Error: ", err);
    }
});
