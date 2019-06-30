module.exports = bot => {
    bot.context.reply = function(...args) {
        this.assert(this.chat, 'reply');
        const { message_id } = this.message;

        args[1] = {
            reply_to_message_id: message_id,
            parse_mode: 'markdown',
            ...args[1]
        };

        return bot.telegram.sendMessage(this.chat.id, ...args).catch(err => {
            if (err.description == 'Bad Request: reply message not found') {
                args[1] = {
                    ...args[1],
                    reply_to_message_id: null
                };

                return bot.telegram.sendMessage(this.chat.id, ...args);
            } else {
                throw err;
            }
        });
    };
};
