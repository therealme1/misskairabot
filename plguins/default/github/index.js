const axios = require('axios');

module.exports = bot => {
    bot.command('github', async ctx => {
        const username = ctx.args().join(' ');
        if (username) {
            console.log(username);
            const { data: response } = await axios.get(
                `https://api.github.com/users/${username}`
            );
            let message = '';
            message += `Username: ${response.login}\n`;
            message += `Name: ${response.name}\n`;
            message += `Public repos: ${response.public_repos}\n`;
            message += `Followers: ${response.followers}\n`;
            message += `Following: ${response.following}\n`;
            message += `Joined at: ${response.created_at}\n`;

            message += `\nℹ️ <b>${response.bio}</b>`;

            return ctx.reply(message, {
                parse_mode: 'Html'
            });
        } else {
            return ctx.reply('Please provide a valid username.');
        }
    });
};
