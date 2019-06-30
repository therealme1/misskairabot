module.exports = bot =>
    bot.command('ping', async ctx => {
        const start = new Date(),
            pong = await ctx.reply('Pong!'),
            end = new Date(),
            ms = (end - start) / 2;

        bot.telegram.editMessageText(
            ctx.chat.id,
            pong.message_id,
            null,
            `Pong!\n${ms}ms`
        );
    });
