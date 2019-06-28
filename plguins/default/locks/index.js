const db = require('../../../db');
const { Markup, Extra } = require('telegraf');
const types = require('./types');
const i18n = require('../../../utils/i18n');

const LOCKS = [];

module.exports = bot => {
    bot.use(async (ctx, next) => {
        if (await ctx.isUserAdmin()) return next();
        const { message, chat } = ctx;
        if (LOCKS[chat.id]) {
            const locks = LOCKS[chat.id];
            const disabled = Object.keys(locks).filter(f => !locks[f]);
            for (var i = 0; i < disabled.length; i++) {
                if (message[disabled[i]]) {
                    ctx.deleteMessage();
                    break;
                }
            }
        } else {
        }
        next();
    });
    bot.command(['lock', 'locks'], async ctx => {
        const lang = await ctx.lang();
        let [locks] = await db('groups')
            .where({ chat_id: ctx.chat.id })
            .select('locks');
        if (locks.locks === 0) {
            locks = {};
            Object.keys(types).forEach(type => {
                locks[type] = true;
            });
        } else {
            locks = JSON.parse(locks.locks);
        }
        LOCKS[ctx.chat.id] = locks;
        ctx.reply(
            i18n(lang, 'lock.locks'),
            Markup.inlineKeyboard(
                Object.keys(types).map(type => [
                    Markup.callbackButton(
                        `${locks[type] ? '✅' : '❌'} ${types[type]}`,
                        `toggle_filter_${type}`
                    )
                ])
            ).extra()
        );
    });

    bot.action(/toggle_filter_(\w+)/, async ctx => {
        const lang = await ctx.lang();
        if (!(await ctx.isUserAdmin())) {
            return ctx.answerCbQuery(i18n(lang, 'only_for_admin'));
        }
        const [, to_toggle] = ctx.match;
        let [locks] = await db('groups')
            .where({ chat_id: ctx.chat.id })
            .select('locks');
        locks = locks.locks;
        let final = {};
        if (locks == 0) {
            Object.keys(types).forEach(type => {
                final[type] = true;
            });
        } else final = JSON.parse(locks);
        final[to_toggle] = !final[to_toggle];
        LOCKS[ctx.chat.id] = final;
        db('groups')
            .where({ chat_id: ctx.chat.id })
            .update({
                locks: JSON.stringify(final)
            })
            .then(async () => {
                await ctx.editMessageText(
                    i18n(lang, 'lock.locks'),
                    Markup.inlineKeyboard(
                        Object.keys(types).map(type => [
                            Markup.callbackButton(
                                `${final[type] ? '✅' : '❌'} ${types[type]}`,
                                `toggle_filter_${type}`
                            )
                        ])
                    ).extra()
                );
                ctx.answerCbQuery(i18n(lang, 'lock.updated'));
            });
    });
};
