const i18n = require('../../utils/i18n');
const { Markup } = require('telegraf');

module.exports = bot => {
    bot.command('warn', async ctx => {
        const lang = await ctx.lang();
        const mentioned = await ctx.getMentioned();
        console.log(ctx.settings());
        if (mentioned.user_id) {
            ctx.reply(
                `${ctx.from.first_name} warned ${mentioned.first_name}`,
                Markup.inlineKeyboard([
                    Markup.callbackButton(`Remove warn (1/3)`, 'warn')
                ]).extra()
            );
        } else return ctx.reply(i18n(lang, 'no_mentioned_user'));
    });
};
