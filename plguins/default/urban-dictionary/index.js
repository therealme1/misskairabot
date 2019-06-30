const ud = require('urban-dictionary');
const Filter = require('bad-words');
const filter = new Filter();
const { Markup } = require('telegraf');

module.exports = bot => {
    bot.hears(/^\? (.*)/, async ctx => {
        const [, query] = ctx.match;
        ud.term(query, (error, entries) => {
            if (error) {
                return ctx.reply('❌ No definition found. ');
            } else {
                try {
                    const total = entries.length;
                    const entry = entries[0];
                    ctx.reply(
                        filter.clean(entry.definition),
                        Markup.inlineKeyboard([
                            Markup.callbackButton(
                                ' ⬅️',
                                `urban_${Buffer.from(query).toString(
                                    'base64'
                                )}_0`
                            ),
                            Markup.callbackButton(
                                `1/${total - 1}`,
                                `urban_${Buffer.from(query).toString(
                                    'base64'
                                )}_${total - 1}`
                            ),
                            Markup.callbackButton(
                                ' ➡️',
                                `urban_${Buffer.from(query).toString(
                                    'base64'
                                )}_1`
                            )
                        ]).extra()
                    );
                } catch (e) {
                    ctx.reply('Something went wrong!!');
                }
            }
        });
    });

    bot.action(/urban_(.*)_(\d+)/, async ctx => {
        let [, query_, to_page] = ctx.match;
        const query = Buffer.from(query_, 'base64').toString();
        ud.term(query, async (error, entries) => {
            if (error) {
                return ctx.reply('No definition found!');
            } else {
                const total = entries.length;
                if (total - 1 < to_page) {
                    to_page = total - 1;
                }
                const entry = entries[to_page];
                await ctx.editMessageText(
                    filter.clean(entry.definition),
                    Markup.inlineKeyboard([
                        Markup.callbackButton(
                            ' ⬅️',
                            `urban_${Buffer.from(query).toString(
                                'base64'
                            )}_${to_page - 1}`
                        ),
                        Markup.callbackButton(
                            `${parseInt(to_page) + 1}/${total - 1}`,
                            `urban_${Buffer.from(query).toString(
                                'base64'
                            )}_${total - 1}`
                        ),
                        Markup.callbackButton(
                            ' ➡️',
                            `urban_${Buffer.from(query).toString(
                                'base64'
                            )}_${parseInt(to_page) + 1}`
                        )
                    ]).extra()
                );
                ctx.answerCbQuery();
            }
        });
    });
};
