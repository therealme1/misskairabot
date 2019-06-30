const db = require('../db');

module.exports = bot => {
    bot.context.getMentioned = async function() {
        const { text, entities, reply_to_message: reply } = this.message;

        const [entity] = (entities || []).filter(
            entity => entity.type === 'mention'
        );

        if (entity) {
            const _user = text.substring(
                entity.offset + 1,
                entity.offset + entity.length
            );

            return await db('users')
                .where({ username: _user })
                .first();
        } else if (reply) {
            return {
                user_id: reply.from.id,
                first_name: reply.from.first_name
            };
        } else {
            return { user_id: null };
        }
    };
};
