module.exports = bot => {
    bot.context.sendChatAction = function(action) {
        bot.telegram.sendChatAction(this.chat.id, action);
    };

    bot.context.typing = function() {
        const interval = setInterval(
            () => this.sendChatAction('file_sending'),
            4000
        );
        this.sendChatAction('typing');

        const stop = () => clearInterval(interval);
        return { stop };
    };
};
