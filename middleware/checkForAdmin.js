const admin_commands = ['ban', 'kick', 'warn', 'unban', 'purge'];
const i18n = require('../utils/i18n');

module.exports = async (ctx, next) => {
    if (ctx.chat.type === 'private') return next();
    const lang = await ctx.lang();

    if (!ctx.message) return next();
    if (ctx.message.text) {
        const member = await ctx.telegram.getChatMember(
            ctx.chat.id,
            ctx.from.id
        );
        const is_user_admon = ['creator', 'administrator'].includes(
            member.status
        );

        const command = ctx.message.text.match(/^\/(\w+)\s?.*/);
        if (!command) return next();
        if (admin_commands.includes(command[1])) {
            if (is_user_admon) return next();
            else return ctx.reply(i18n(lang, 'only_for_admin'));
        } else return next();
    } else next();
};
