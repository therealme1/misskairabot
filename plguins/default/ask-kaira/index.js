const request = require('request');

module.exports = bot => {
    bot.hears(/^kaira (.*)/, async ctx => {
        const [, query] = ctx.match;
        const typing = ctx.typing();
        request(
            `https://api.duckduckgo.com/?q=${query}&format=json`,
            (err, res, body) => {
                try {
                    const response = JSON.parse(body);
                    const text = response.AbstractText;
                    if (text) {
                        ctx.reply(text);
                    } else {
                        ctx.reply('No result found.');
                    }
                } catch (e) {
                    ctx.reply('There was an error.');
                } finally {
                    typing.stop();
                }
            }
        );
    });
};
