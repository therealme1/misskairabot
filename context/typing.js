module.exports = bot => {
    bot.context.sendChatAction = function(action) {
        bot.telegram.sendChatAction(this.chat.id, action);
    };

    bot.context.typing = function(action = 'typing') {
        const interval = setInterval(() => this.sendChatAction(action), 4000);
        this.sendChatAction(action);

        const stop = () => clearInterval(interval);
        return { stop };
    };
};
