const Ping = async ctx => {
    ctx.reply('✅ Pong');
};

module.exports = bot => bot.command('ping', Ping);
