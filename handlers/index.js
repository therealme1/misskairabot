const handlers = ['commands/start', 'commands/tags', 'groups/newMember'];

module.exports = bot =>
    handlers.forEach(handler => require(`./${handler}`)(bot));
