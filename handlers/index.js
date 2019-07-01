const handlers = [
    'commands/start',
    'commands/tags',
    'commands/ban',
    'commands/kick',
    'commands/purge',
    'commands/welcome',
    'commands/warns',
    'groups/newMember',
    'groups/gban',
    'groups/gkick',
    'groups/gmute'
];

module.exports = bot =>
    handlers.forEach(handler => require(`./${handler}`)(bot));
