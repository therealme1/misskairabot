const db = require('../../db');

module.exports = bot => {
    bot.on('new_chat_members', ctx => {
        const { chat, new_chat_members } = ctx.message;

        new_chat_members.forEach(async member => {
            if (member.is_bot) {
                // check if group allows bots
            }

            const user = await db('users')
                .select()
                .where('user_id', member.id);
        });
    });
};

const x = {
    message_id: 30,
    from: {
        id: 834573775,
        is_bot: false,
        first_name: 'Sub Meme',
        username: 'submeme'
    },
    chat: {
        id: -1001429451209,
        title: 'Group Driver',
        username: 'GroupDriverChat',
        type: 'supergroup'
    },
    date: 1561525777,
    new_chat_participant: {
        id: 834573775,
        is_bot: false,
        first_name: 'Sub Meme',
        username: 'submeme'
    },
    new_chat_member: {
        id: 834573775,
        is_bot: false,
        first_name: 'Sub Meme',
        username: 'submeme'
    },
    new_chat_members: [
        {
            id: 834573775,
            is_bot: false,
            first_name: 'Sub Meme',
            username: 'submeme'
        }
    ]
};
