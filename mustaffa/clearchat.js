const { cmd } = require("../command");

// ── isAdmin helper (ported from lib/isAdmin.js) ──────────────
async function isAdmin(conn, chatId, senderId) {
  try {
    const metadata = await conn.groupMetadata(chatId);
    const participants = metadata.participants || [];

    const botId = conn.user?.id || '';
    const botLid = conn.user?.lid || '';
    const botNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
    const botIdWithoutSuffix = botId.includes('@') ? botId.split('@')[0] : botId;
    const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
    const botLidWithoutSuffix = botLid.includes('@') ? botLid.split('@')[0] : botLid;

    const senderNumber = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
    const senderIdWithoutSuffix = senderId.includes('@') ? senderId.split('@')[0] : senderId;

    const isBotAdmin = participants.some((p) => {
      const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
      const pId = p.id ? p.id.split('@')[0] : '';
      const pLid = p.lid ? p.lid.split('@')[0] : '';
      const pFullId = p.id || '';
      const pFullLid = p.lid || '';
      const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : pLid;

      const botMatches = (
        botId === pFullId || botId === pFullLid ||
        botLid === pFullLid || botLidNumeric === pLidNumeric ||
        botLidWithoutSuffix === pLid || botNumber === pPhoneNumber ||
        botNumber === pId || botIdWithoutSuffix === pPhoneNumber ||
        botIdWithoutSuffix === pId ||
        (botLid && botLid.split('@')[0].split(':')[0] === pLid)
      );
      return botMatches && (p.admin === 'admin' || p.admin === 'superadmin');
    });

    const isSenderAdmin = participants.some((p) => {
      const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
      const pId = p.id ? p.id.split('@')[0] : '';
      const pLid = p.lid ? p.lid.split('@')[0] : '';
      const pFullId = p.id || '';
      const pFullLid = p.lid || '';

      const senderMatches = (
        senderId === pFullId || senderId === pFullLid ||
        senderNumber === pPhoneNumber || senderNumber === pId ||
        senderIdWithoutSuffix === pPhoneNumber ||
        senderIdWithoutSuffix === pId ||
        (pLid && senderIdWithoutSuffix === pLid)
      );
      return senderMatches && (p.admin === 'admin' || p.admin === 'superadmin');
    });

    return { isSenderAdmin, isBotAdmin };
  } catch (err) {
    console.error('❌ Error in isAdmin:', err);
    return { isSenderAdmin: false, isBotAdmin: false };
  }
}

// ── Command ───────────────────────────────────────────────────
cmd({
  pattern: "clearchat",
  alias: ["deletechat"],
  react: '🗑️',
  desc: "Clear/delete the current chat",
  category: "owner",
  use: ".clearchat",
  filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isOwner, sender }) => {
  try {

    // Group check
    if (isGroup && !isOwner) {
      const { isSenderAdmin } = await isAdmin(conn, from, sender);
      if (!isSenderAdmin) {
        return reply("❌ Only group admins or bot owner can clear this chat.");
      }
    }

    // DM check
    if (!isGroup && !isOwner && !mek.key.fromMe) {
      return reply("❌ Only the bot owner can clear DM chats.");
    }

    // Resync app state to fix missing keys error
    try {
      await conn.resyncAppState(['critical_block', 'critical_unblock_to_primary'], true);
    } catch (e) {
      console.log('[CLEARCHAT] resync skipped:', e.message);
    }

    await conn.chatModify({
      delete: true,
      lastMessages: [{
        key: mek.key,
        messageTimestamp: mek.messageTimestamp
      }]
    }, from);

    await reply("🗑️ *Chat cleared successfully!*");

  } catch (e) {
    console.error('[CLEARCHAT] Error:', e.message);
    await reply(`❌ Failed to clear chat: ${e.message}`);
  }
});
