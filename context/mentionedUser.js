const db = require('../db');

module.exports = bot => {
    bot.context.getMentioned = async function() {
        const { message } = this;
        const { reply_to_message: reply } = this.message;
        const [entity] = (this.message.entities || []).filter(
            entity => entity.type === 'mention'
        );
        if (reply !== undefined) {
            return {
                user_id: reply.from.id,
                first_name: reply.from.first_name
            };
        } else if (entity !== undefined) {
            const _user = message.text.substring(
                entity.offset + 1,
                entity.offset + entity.length
            );
            const user = await db('users').where({ username: _user });
            return user[0];
        } else {
            return { user_id: null };
        }
    };
};
