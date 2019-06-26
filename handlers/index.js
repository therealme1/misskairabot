const handlers = ['commands/start', 'groups/newMember'];

module.exports = bot =>
    handlers.forEach(handler => require(`./${handler}`)(bot));
