const handlers = [
    'commands/start',
    'commands/tags',
    'commands/ban',
    'commands/kick',
    'commands/purge',
    'commands/welcome',
    'groups/newMember'
];

module.exports = bot =>
    handlers.forEach(handler => require(`./${handler}`)(bot));
