const isSuperUser = require('../../utils/super-user');
const { Markup } = require('telegraf');
const db = require('../../db');

module.exports = bot => {
    bot.command('gmute', async ctx => {
        const { from } = ctx;
        if (isSuperUser(from.id)) {
            const mentioned = await ctx.getMentioned();
            if (!mentioned.user_id)
                return ctx.reply('Please tell me whom to gmute 😈');
            let reason;
            if (ctx.message.reply_to_message) {
                reason = ctx.args().join(' ');
            } else {
                const message = ctx.args();
                message.shift();
                reason = message.join(' ');
            }
            if (reason === '')
                return ctx.reply('😐 Please provide a proper reason.');
            let count = 0,
                failed = 0,
                success = 0;
            db('groups')
                .select('*')
                .then(async groups => {
                    await groups.forEach(async group => {
                        try {
                            group.chat_id !== ctx.chat.id
                                ? bot.telegram.sendMessage(
                                    group.chat_id,
                                    `Incoming global mute for <a href="tg://user?id=${
                                        mentioned.user_id
                                    }">${
                                        mentioned.first_name
                                    }</a>.\nReason: <b>${reason}</b>`,
                                    {
                                        parse_mode: 'Html'
                                    }
                                )
                                : null;
                            await bot.telegram.restrictChatMember(
                                group.chat_id,
                                mentioned.user_id,
                                {
                                    can_send_messages: false
                                }
                            );

                            await db('users')
                                .where({ user_id: mentioned.user_id })
                                .update({
                                    status: 'gmuted',
                                    status_reason: reason
                                });
                            success++;
                        } catch (e) {
                            failed++;
                        }
                        if (count === groups.length - 1) {
                            ctx.reply(
                                `Globally muted <a href="tg://user?id=${
                                    mentioned.user_id
                                }">${
                                    mentioned.first_name
                                }</a> in ${success} chats, failed in ${failed} chats.`,
                                {
                                    parse_mode: 'html'
                                }
                            );
                        }

                        count++;
                    });
                });
        } else {
            ctx.reply(
                'Sorry, this command is limited to bot\'s super users.',
                Markup.inlineKeyboard([
                    Markup.urlButton(
                        'How to become super user?',
                        `https://t.me/${
                            process.env.BOT_USERNAME
                        }?start=help_superuser`
                    )
                ]).extra()
            );
        }
    });
    bot.command('ungmute', async ctx => {
        const { from } = ctx;
        if (isSuperUser(from.id)) {
            const mentioned = await ctx.getMentioned();
            if (!mentioned.user_id)
                return ctx.reply('Please tell me whom to ungmute');
            let reason;
            if (ctx.message.reply_to_message) {
                reason = ctx.args().join(' ');
            } else {
                const message = ctx.args();
                message.shift();
                reason = message.join(' ');
            }
            if (reason === '')
                return ctx.reply('😐 Please provide a proper reason.');
            let count = 0,
                failed = 0,
                success = 0;
            db('groups')
                .select('*')
                .then(async groups => {
                    await groups.forEach(async group => {
                        try {
                            group.chat_id !== ctx.chat.id
                                ? bot.telegram.sendMessage(
                                    group.chat_id,
                                    `Incoming global unmute for <a href="tg://user?id=${
                                        mentioned.user_id
                                    }">${
                                        mentioned.first_name
                                    }</a>.\nReason: <b>${reason}</b>`,
                                    {
                                        parse_mode: 'Html'
                                    }
                                )
                                : null;
                            await bot.telegram.restrictChatMember(
                                group.chat_id,
                                mentioned.user_id,
                                {
                                    can_send_messages: true
                                }
                            );

                            await db('users')
                                .where({ user_id: mentioned.user_id })
                                .update({
                                    status: '',
                                    status_reason: reason
                                });
                            success++;
                        } catch (e) {
                            failed++;
                        }
                        if (count === groups.length - 1) {
                            ctx.reply(
                                `Globally unmuted <a href="tg://user?id=${
                                    mentioned.user_id
                                }">${
                                    mentioned.first_name
                                }</a> in ${success} chats, failed in ${failed} chats.`,
                                {
                                    parse_mode: 'html'
                                }
                            );
                        }

                        count++;
                    });
                });
        } else {
            ctx.reply(
                'Sorry, this command is limited to bot\'s super users.',
                Markup.inlineKeyboard([
                    Markup.urlButton(
                        'How to become super user?',
                        `https://t.me/${
                            process.env.BOT_USERNAME
                        }?start=help_superuser`
                    )
                ]).extra()
            );
        }
    });
};
