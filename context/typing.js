global.typing = [];

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
        global.typing.push(interval);

        const stop = () => clearInterval(interval);
        return { stop };
    };

    bot.context.stopTyping = () => {
        global.typing.forEach(i => clearInterval(i));
    };
};
