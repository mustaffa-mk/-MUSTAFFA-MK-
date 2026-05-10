const { cmd } = require('../command');

cmd(
  {
    pattern: "add",
    alias: ["invite", "addmember", "a", "summon"],
    desc: "Adds a person to group",
    category: "group",
    react: "👤",
    filename: __filename,
  },
  async (conn, mek, m, { from, quoted, args, reply, isGroup, isBotAdmins, isCreator }) => {
    try {
      // 1. Access & Group Validation
      if (!isCreator) return reply("📛 *Access Denied:* Owner command only.");
      if (!isGroup) return reply("❌ This command is for groups only.");
      if (!isBotAdmins) return reply("❌ I need admin rights to add members.");
      
      // 2. Identify Target JID
      let jid = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);
            
      if (!jid) return reply("📍 *Please mention, reply, or provide a number.*");

      // 3. Action
      await conn.groupParticipantsUpdate(from, [jid], "add");

      // 4. Stylish Modern Response
      return reply(`✅ *Success:* @${jid.split("@")[0]} has been added.`, { 
        mentions: [jid] 
      });

    } catch (e) {
      console.log(e);
      // Modern error handling
      return reply(`❌ *Operation Failed*\n\n_User might have privacy settings enabled or left recently._`);
    }
  }
);
