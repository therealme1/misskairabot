module.exports = bot => {
    bot.command('purge', async ctx => {
        if (ctx.message.reply_to_message) {
            const args = ctx.args();
            const { reply_to_message: reply } = ctx.message;

            const startMessage = reply.message_id,
                endMessage =
                    args[0] && !isNaN(args[0])
                        ? startMessage + Number(args[0]) - 1
                        : ctx.message.message_id;

            ctx.deleteMessage().catch(() => {});

            for (let id = endMessage; id >= startMessage; id--) {
                ctx.deleteMessage(id).catch(() => {});
            }
        } else {
            return ctx.reply('no_replied_to_message');
        }
    });
};
