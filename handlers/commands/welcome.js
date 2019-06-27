const db = require('../../db');
const i18n = require('../../utils/i18n');

module.exports = bot => {
    bot.hears(/\/setwelcome (.*)/, async ctx => {
        let [, message] = ctx.match;
        const lang = await ctx.lang();

        if (ctx.message.reply_to_message) {
        } else {
            await db('groups')
                .where({ chat_id: ctx.chat.id })
                .update({
                    welcome_message: message,
                    welcome_enabled: true
                });
            return ctx.reply(i18n(lang, 'welcome.updated'));
        }
    });
};
