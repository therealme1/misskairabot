const { Pool } = require('multiprocessing');

module.exports = bot => {
    bot.hears(
        // https://github.com/SijmenSchoon/regexbot/blob/master/regexbot.py#L81
        /^s\/((?:\\\/|[^/])+)\/((?:\\\/|[^/])*)(\/(.*))?/i,
        async (ctx, next) => {
            if (ctx.message.reply_to_message) {
                const { reply_to_message: reply } = ctx.message;

                const flags = ctx.match[4] || '';
                const search = ctx.match[1];
                const replace =
                    ctx.match[2]
                        .replace(/(?<!\\)\\(?=[0-9]+)/g, '$')
                        .replace(/\\(?=\/)/g, '') || '';

                const { text, message_id } = reply;
                const pool = new Pool();

                try {
                    const [result] = await pool.map(
                        [[text, search, flags, replace]],
                        ([text, search, flags, replace]) => {
                            const regex = new RegExp(search, flags);
                            return text.replace(regex, replace);
                        },
                        { timeout: 1000 }
                    );

                    await ctx.reply(result, {
                        reply_to_message_id: message_id,
                        parse_mode: null
                    });
                } catch (e) {
                    if (e.toString() === 'Error: Task timed out') {
                        ctx.reply('Timed out');
                    }
                } finally {
                    pool.close();
                }

                return next();
            }
        }
    );
};
