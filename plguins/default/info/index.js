module.exports = bot => {
    bot.command('id', async ctx => {
        const mentioned = await ctx.getMentioned();
        ctx.reply(mentioned.user_id || ctx.from.id);
    });
};
