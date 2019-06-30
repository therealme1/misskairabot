const axios = require('axios');

module.exports = bot => {
    bot.hears(/^grouper, (.*)/, async ctx => {
        const [, query] = ctx.match;
        const typing = ctx.typing();
        const { data: response } = await axios.get(
            `https://api.duckduckgo.com/?q=${query}&format=json`
        );

        try {
            const text = response.AbstractText;

            if (text) {
                ctx.reply(text);
            } else {
                ctx.reply('No results found.');
            }
        } catch (e) {
            ctx.reply('There was an error.');
        } finally {
            typing.stop();
        }
    });
};
