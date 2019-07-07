exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('settings', table => {
            table.integer('chat_id').unique();

            table.integer('max_warn_count');
            table.integer('max_warn_action');

            table.boolean('human_verification');
            table.boolean('allow_bots');
            table.boolean('allow_rtl');
            table.boolean('allow_non_username_users');

            table.boolean('flood_level');
            table.boolean('flood_level_action');

            table.boolean('spam_detection');
        })
    ]);
};

exports.down = function(knex, Promise) {};
