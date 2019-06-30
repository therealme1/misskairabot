const isSuperUser = require('../../utils/super-user');
const db = require('../../db');

// Todo: Merge gmute and gban in one file
module.exports = bot => {
    bot.command('gban', isSuperUser.middleware, async ctx => {
        const mentioned = await ctx.getMentioned();

        if (!mentioned.user_id) {
            return ctx.reply('Please tell me whom to gban 😈');
        }

        let reason = ctx.args();

        if (!ctx.message.reply_to_message) {
            reason.shift();
        }

        reason = reason.join(' ');

        if (reason.trim() === '') {
            return ctx.reply('😐 Please provide a proper reason.');
        }

        let failed = 0,
            success = 0;

        await db('users')
            .where({ user_id: mentioned.user_id })
            .update({
                status: 'gbanned',
                status_reason: reason
            });

        const groups = await db('groups').select();
        groups.forEach(async group => {
            try {
                await bot.telegram.kickChatMember(
                    group.chat_id,
                    mentioned.user_id
                );

                success++;
            } catch (e) {
                failed++;
            }
        });

        ctx.reply(
            `Globally banned <a href="tg://user?id=${mentioned.user_id}">${
                mentioned.first_name
            }</a> in ${success} chats, failed in ${failed} chats.`,
            { parse_mode: 'html' }
        );
    });

    bot.command('ungban', isSuperUser.middleware, async ctx => {
        const mentioned = await ctx.getMentioned();

        if (!mentioned.user_id) {
            return ctx.reply('Please tell me whom to gban 😈');
        }

        let failed = 0,
            success = 0;

        await db('users')
            .where({ user_id: mentioned.user_id })
            .update({
                status: null,
                status_reason: null
            });

        const groups = await db('groups').select();
        groups.forEach(async group => {
            try {
                await bot.telegram.unbanChatMember(
                    group.chat_id,
                    mentioned.user_id
                );

                success++;
            } catch (e) {
                failed++;
            }
        });

        ctx.reply(
            `Globally unbanned <a href="tg://user?id=${mentioned.user_id}">${
                mentioned.first_name
            }</a> in ${success} chats, failed in ${failed} chats.`,
            {
                parse_mode: 'html'
            }
        );
    });
};
