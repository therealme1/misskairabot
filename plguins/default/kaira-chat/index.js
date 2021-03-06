const RiveScript = require('rivescript');
const rive_bot = new RiveScript();

rive_bot
    .loadDirectory(__dirname + '/brain')
    .then(() => {
        rive_bot.sortReplies();
    })
    .catch(e => {
        console.log(e);
    });

module.exports = bot => {
    bot.on('text', async (ctx, next) => {
        const { message } = ctx;
        const { reply_to_message } = message;
        if (reply_to_message && reply_to_message.from.id == ctx.botInfo.id) {
            const typing = ctx.typing();
            rive_bot.reply('', message.text).then(reply => {
                setTimeout(() => {
                    ctx.reply(reply);
                    typing.stop();
                }, reply.length * 100);
            });
        }
        next();
    });
};
