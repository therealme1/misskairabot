const i18n = require('../../utils/i18n');

module.exports = bot => {
    bot.command('ban', async ctx => {
        const mentioned = await ctx.getMentioned();
        const lang = await ctx.lang();

        if (mentioned.user_id) {
            try {
                await ctx.kickChatMember(mentioned.user_id);
                ctx.reply('user.banned');
            } catch (e) {
                ctx.reply(i18n(lang, 'bot.no_admin_access'));
            }
        } else {
            return ctx.reply(i18n(lang, 'no_mentioned_user'));
        }
    });

    bot.command('unban', async ctx => {
        const mentioned = await ctx.getMentioned();
        const lang = await ctx.lang();

        if (mentioned.user_id) {
            const user = await bot.telegram.getChatMember(
                ctx.chat.id,
                mentioned.user_id
            );

            if (user.status !== 'kicked') {
                return ctx.reply('user.not_banned');
            }

            try {
                await bot.telegram.unbanChatMember(
                    ctx.chat.id,
                    mentioned.user_id
                );

                ctx.reply('user.unbanned');
            } catch (e) {
                ctx.reply(i18n(lang, 'bot.no_admin_access'));
            }
        } else {
            ctx.reply(i18n(lang, 'no_mentioned_user'));
        }
    });
};
