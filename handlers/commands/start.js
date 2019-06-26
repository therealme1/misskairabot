const escapeHtml = require('@youtwitface/escape-html');
const i18n = require('../../utils/i18n');

module.exports = bot => {
    bot.start(async ctx => {
        ctx.reply(
            i18n(
                await ctx.lang(),
                `start.${ctx.chat.type === 'private' ? 'private' : 'group'}`,
                { name: escapeHtml(ctx.from.first_name) }
            ),
            { parse_mode: 'html' }
        );
    });
};
