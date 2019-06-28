let admin_commands = ['ban', 'kick', 'unban', 'purge'];
module.exports = async (ctx, next) => {
    if (ctx.chat.type === 'private') return next();

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
            else return ctx.reply('only_for_admin');
        } else return next();
    }
};
