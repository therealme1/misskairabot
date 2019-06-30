module.exports = bot =>
    bot.command('ping', async ctx => {
        const start = new Date(),
            pong = await bot.telegram.sendMessage(-1001427316909, 'Pong!'),
            end = new Date(),
            mseconds = (end - start) / 2;

        ctx.reply(`Pong!\n${mseconds}ms`);
        bot.telegram.deleteMessage(pong.chat.id, pong.message_id);
    });
