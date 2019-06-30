const db = require('../../../db');
const { Markup } = require('telegraf');
const types = require('./types');
const i18n = require('../../../utils/i18n');

const LOCKS = [];

module.exports = bot => {
    bot.use(async (ctx, next) => {
        const { message, chat } = ctx;
        if (!message || (await ctx.isUserAdmin())) return next();

        let locks = LOCKS[chat.id];

        if (!LOCKS[chat.id]) {
            locks = await db('groups')
                .where({ chat_id: ctx.chat.id })
                .first('locks');

            locks = JSON.parse(locks.locks);
            // eslint-disable-next-line require-atomic-updates
            LOCKS[chat.id] = locks;
        }

        const disabled = Object.keys(locks).filter(f => !locks[f]);
        for (var i = 0; i < disabled.length; i++) {
            if (message[disabled[i]]) {
                ctx.deleteMessage();
                // Return istead of break so it doesn't trigger any commands
                return;
            }
        }

        next();
    });

    bot.command('locks', async ctx => {
        const lang = await ctx.lang();

        let { locks } = await db('groups')
            .where({ chat_id: ctx.chat.id })
            .first('locks');

        locks = JSON.parse(locks);
        LOCKS[ctx.chat.id] = locks;

        ctx.reply(
            i18n(lang, 'lock.locks'),
            Markup.inlineKeyboard(
                Object.keys(types).map(type => [
                    Markup.callbackButton(
                        `${locks[type] !== false ? '✅' : '❌'} ${types[type]}`,
                        `lock:${type}`
                    )
                ])
            ).extra()
        );
    });

    bot.action(/^lock:(\w+)$/, async ctx => {
        const lang = await ctx.lang();
        if (!(await ctx.isUserAdmin())) {
            return ctx.answerCbQuery(i18n(lang, 'only_for_admin'));
        }
        const [, to_toggle] = ctx.match;

        let { locks } = await db('groups')
            .where({ chat_id: ctx.chat.id })
            .first('locks');

        locks = JSON.parse(locks);
        locks[to_toggle] = !locks[to_toggle];
        LOCKS[ctx.chat.id] = locks;

        await db('groups')
            .where({ chat_id: ctx.chat.id })
            .update({
                locks: JSON.stringify(locks)
            });

        await ctx.editMessageText(
            i18n(lang, 'lock.locks'),
            Markup.inlineKeyboard(
                Object.keys(types).map(type => [
                    Markup.callbackButton(
                        `${locks[type] !== false ? '✅' : '❌'} ${types[type]}`,
                        `lock:${type}`
                    )
                ])
            ).extra()
        );

        ctx.answerCbQuery(i18n(lang, 'lock.updated'));
    });
};
