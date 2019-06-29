process.exit = () => 'No!';
process.kill = () => 'No!';
process.abort = () => 'No!';

module.exports = bot => {
    bot.command('eval', async ctx => {
        const command = ctx.args().join(' ');
        const bot_admin = process.env.BOT_ADMIN.split(',');
        if (bot_admin.includes(String(ctx.from.id))) {
            const res = eval(command);
            console.log(res);
            ctx.reply(String(res));
        }
    });
};
