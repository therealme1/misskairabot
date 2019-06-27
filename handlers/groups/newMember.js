const db = require('../../db');

module.exports = bot => {
    bot.on('new_chat_members', ctx => {
        const { chat, new_chat_members } = ctx.message;

        new_chat_members.forEach(async member => {
            if (member.is_bot) {
                // check if group allows bots
            }
            if (member.id === ctx.botInfo.id) {
                ctx.reply('Thanks for adding me here!');
                try {
                    await db('groups').insert({
                        chat_id: ctx.chat.id,
                        title: ctx.chat.title,
                        lang: 'en',
                        created_at: new Date().toString(),
                        welcome_message: '',
                        welcome_enabeld: false,
                        welcome_lp: true
                    });
                    return;
                } catch (e) {
                    return;
                }
            }
            const user = await db('users')
                .select()
                .where('user_id', member.id);
            if (user.length > 0) {
                const { status } = user[0];
                switch (status) {
                    case 'gbanned':
                        try {
                        } catch (e) {}
                        break;
                    case 'gmuted':
                        try {
                        } catch (e) {}
                        break;
                }
            }
        });
    });
};
