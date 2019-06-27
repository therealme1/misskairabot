const i18n = require('../../utils/i18n');

module.exports = bot => {
    bot.command('kick', async ctx => {
        const mentioned = await ctx.getMentioned();
        const lang = await ctx.lang();
        return;
        if (mentioned.user_id) {
            try {
                await bot.telegram.unbanChatMember(
                    ctx.chat.id,
                    mentioned.user_id
                );
            } catch (e) {
                console.log(e);
                ctx.reply(i18n(lang, 'bot.no_admin_access'));
            }
        } else return ctx.reply(i18n(lang, 'no_mentioned_user'));
    });
};
