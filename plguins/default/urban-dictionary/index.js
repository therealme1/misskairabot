const ud = require('urban-dictionary');
const Filter = require('bad-words');
const filter = new Filter();

module.exports = bot => {
    bot.hears(/^\? (.*)/, async ctx => {
        const [, query] = ctx.match;
        ud.term(query, (error, entries, tags, sounds) => {
            if (error) {
                return ctx.reply('No defination found!');
            } else {
                const random = Math.floor(Math.random() * entries.length);
                const entry = entries[random];
                ctx.reply(filter.clean(entry.definition));
            }
        });
    });
};
