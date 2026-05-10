//---------------------------------------------------------------------------
//           MUSTAFFA-MD (MODIFIED: OPEN SETTINGS & ENHANCED FEATURES)
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const path = require('path');

//--------------------------------------------
//  PREFIX SETTINGS
//--------------------------------------------
cmd({
    pattern: "setprefix1",
    alias: ["prefix1"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    const newPrefix = args[0];
    if (!newPrefix) return reply("❌ Please provide a new prefix. Example: `.setprefix +`");
    config.PREFIX = newPrefix;
    process.env.PREFIX = newPrefix; 
    return reply(`✅ Prefix successfully changed to *${newPrefix}*\n\nTry typing *${newPrefix}ping* to test it.`);
});

//--------------------------------------------
//  BOT MODE (PUBLIC/PRIVATE)
//--------------------------------------------
cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    const modeArg = args[0]?.toLowerCase();
    if (modeArg === "private") {
        config.MODE = "private";
        return reply("✅ Bot mode is now set to *PRIVATE*.");
    } else if (modeArg === "public") {
        config.MODE = "public";
        return reply("✅ Bot mode is now set to *PUBLIC*.");
    } else {
        return reply(`📌 Current mode: *${config.MODE}*\n\nUsage: .mode private OR .mode public`);
    }
});

//--------------------------------------------
//  AUTOMATION SETTINGS
//--------------------------------------------
cmd({
    pattern: "auto-typing",
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) return reply("*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ ᴏɴ*");
    config.AUTO_TYPING = status === "on" ? "true" : "false";
    return reply(`Auto typing has been turned ${status}.`);
});

cmd({
    pattern: "auto-recording",
    alias: ["autorecoding"],
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) return reply("*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-ʀᴇᴄᴏʀᴅɪɴɢ ᴏɴ*");
    config.AUTO_RECORDING = status === "on" ? "true" : "false";
    if (status === "on") {
        await conn.sendPresenceUpdate("recording", from);
        return reply("Auto recording is now enabled.");
    } else {
        await conn.sendPresenceUpdate("available", from);
        return reply("Auto recording has been disabled.");
    }
});

//--------------------------------------------
//  STATUS & REPLIES
//--------------------------------------------
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview", "readstatus"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        config.AUTO_READ_STATUS = "true";
        return reply("Auto-viewing of statuses is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        config.AUTO_READ_STATUS = "false";
        return reply("Auto-viewing of statuses is now disabled.");
    } else {
        return reply(`*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-sᴇᴇɴ ᴏɴ*`);
    }
});

cmd({
    pattern: "status-react",
    alias: ["statusreaction"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return reply("Auto-liking of statuses is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return reply("Auto-liking of statuses is now disabled.");
    } else {
        return reply(`Example: .status-react on`);
    }
});

//--------------------------------------------
//  SECURITY & GROUP MODES
//--------------------------------------------
cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "group",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { isGroup, isBotAdmins, args, reply }) => {
    if (!isGroup) return reply('This command can only be used in a group.');
    if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      return reply("✅ ANTI_LINK has been enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      return reply("❌ ANTI_LINK has been disabled.");
    } else {
      return reply("Usage: .antilink on/off");
    }
});

cmd({
    pattern: "antibad",
    alias: ["anti-bad"],
    desc: "Enable or disable the bad words filter",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.ANTI_BAD = "true";
        return reply("✅ Anti-bad word filter is now ACTIVE.");
    } else if (args[0] === "off") {
        config.ANTI_BAD = "false";
        return reply("❌ Anti-bad word filter is now DISABLED.");
    } else {
        return reply(`*Usage: .antibad on/off*`);
    }
});

//--------------------------------------------
//  ADVANCED FEATURES
//--------------------------------------------
cmd({
    pattern: "auto-sticker",
    alias: ["autosticker"],
    desc: "Enable or disable auto-sticker conversion",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.AUTO_STICKER = "true";
        return reply("✅ Auto-sticker is now enabled.");
    } else if (args[0] === "off") {
        config.AUTO_STICKER = "false";
        return reply("❌ Auto-sticker is now disabled.");
    } else {
        return reply(`*🫟 Example: .auto-sticker on*`);
    }
});

cmd({
    pattern: "readreceipt",
    alias: ["bluetick", "readmessage"],
    desc: "Toggle blue ticks for the bot",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        return reply("✅ Blue ticks (Read Receipts) enabled.");
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        return reply("❌ Blue ticks (Read Receipts) disabled.");
    } else {
        return reply(`*Example: .bluetick on*`);
    }
});

cmd({
    pattern: "anticall",
    alias: ["anti-call"],
    desc: "Automatically decline incoming calls",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.ANTI_CALL = "true";
        return reply("✅ Anti-call mode is now ON.");
    } else if (args[0] === "off") {
        config.ANTI_CALL = "false";
        return reply("❌ Anti-call mode is now OFF.");
    } else {
        return reply(`*Usage: .anticall on/off*`);
    }
});

cmd({
    pattern: "antidelete",
    alias: ["anti-delete"],
    desc: "Toggle anti-delete to see revoked messages",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.ANTI_DELETE = "true";
        return reply("✅ Anti-delete is now ON.");
    } else if (args[0] === "off") {
        config.ANTI_DELETE = "false";
        return reply("❌ Anti-delete is now OFF.");
    } else {
        return reply(`*Usage: .antidelete on/off*`);
    }
});

//--------------------------------------------
//  UTILITY & VISIBILITY
//--------------------------------------------
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === "on") {
        config.ALWAYS_ONLINE = "true";
        return reply("*✅ always online mode is now enabled.*");
    } else if (args[0] === "off") {
        config.ALWAYS_ONLINE = "false";
        return reply("*❌ always online mode is now disabled.*");
    } else {
        return reply(`*🛠️ ᴇxᴀᴍᴘʟᴇ: .ᴀʟᴡᴀʏs-ᴏɴʟɪɴᴇ ᴏɴ*`);
    }
});

//--------------------------------------------
//  SETTINGS DASHBOARD
//--------------------------------------------
cmd({
    pattern: "dashboard",
    alias: ["main", "config"],
    desc: "Show current bot settings",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const status = `
*⚙️ ${config.BOT_NAME} SETTINGS*

*General:*
🔹 Prefix: [ ${config.PREFIX} ]
🔹 Mode: ${config.MODE}
🔹 Always Online: ${config.ALWAYS_ONLINE === "true" ? "✅" : "❌"}

*Automation:*
🔹 Auto Typing: ${config.AUTO_TYPING === "true" ? "✅" : "❌"}
🔹 Auto Recording: ${config.AUTO_RECORDING === "true" ? "✅" : "❌"}
🔹 Auto Status View: ${config.AUTO_STATUS_SEEN === "true" ? "✅" : "❌"}
🔹 Auto Sticker: ${config.AUTO_STICKER === "true" ? "✅" : "❌"}

*Security:*
🔹 Anti-Link: ${config.ANTI_LINK === "true" ? "✅" : "❌"}
🔹 Anti-Badword: ${config.ANTI_BAD === "true" ? "✅" : "❌"}
🔹 Anti-Delete: ${config.ANTI_DELETE === "true" ? "✅" : "❌"}
🔹 Anti-Call: ${config.ANTI_CALL === "true" ? "✅" : "❌"}

*Privacy:*
🔹 Read Receipt: ${config.READ_MESSAGE === "true" ? "✅" : "❌"}

> © ᴘᴏᴘᴋɪᴅ xᴍᴅ 2026
    `;
    return reply(status);
});
