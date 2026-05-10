/**
 * Plugin: AntiDelete
 * Commands: .antidelete on | off | indm
 * Creator: 𒋲⍟ᬼ⃟M💀⃝⃪U⛓ST۞༒A༒ FF⛓⍟ᬼ⃟A𒋲         ~⍟ᬼ⃟MD💀⃝⃪V2🕷️™
 * 
 * Modes:
 *   inchat  — resend deleted message in the same chat
 *   indm    — resend deleted message to bot's own DM (private)
 *   false   — disabled
 */

const { commands } = require('../command')
const config = require('../config')

commands.push({
    pattern: 'antidelete',
    alias: ['antidel', 'ad'],
    react: '🛡️',
    desc: 'Enable or disable antidelete feature',
    type: 'owner',
    function: async (conn, mek, m, { args, reply, isOwner }) => {
        if (!isOwner) return reply('❌ Only the owner can use this command.')

        const sub = (args[0] || '').toLowerCase()

        if (!sub) {
            const current = config.ANTIDELETE || 'false'
            return reply(
                `🛡️ *MUSTAFFA-MD AntiDelete*\n\n` +
                `• Current Mode: *${current.toUpperCase()}*\n\n` +
                `📖 *Modes:*\n` +
                `*.antidelete on* — Recover in same chat\n` +
                `*.antidelete indm* — Recover in bot DM (private)\n` +
                `*.antidelete off* — Disable antidelete`
            )
        }

        if (sub === 'on') {
            config.ANTIDELETE = 'inchat'
            return reply('✅ *AntiDelete ON*\nDeleted messages will be recovered *in the same chat*.')
        }

        if (sub === 'indm') {
            config.ANTIDELETE = 'indm'
            return reply('✅ *AntiDelete ON (DM Mode)*\nDeleted messages will be sent to *bot\'s own DM* privately.')
        }

        if (sub === 'off' || sub === 'false') {
            config.ANTIDELETE = 'false'
            return reply('🔴 *AntiDelete DISABLED*\nDeleted messages will no longer be recovered.')
        }

        return reply(
            `⚠️ Unknown option: *${sub}*\n\n` +
            `Use:\n*.antidelete on* — same chat\n*.antidelete indm* — bot DM\n*.antidelete off* — disable`
        )
    }
})
