exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('groups', table => {
            table.increments();
            table
                .integer('chat_id')
                .unique()
                .notNull();
            table.string('title');
            table.string('lang');
            table.integer('filter');
            table.string('welcome_message');
            table.boolean('welcome_enabled');
            table.boolean('welcome_lp');
            table.datetime('created_at');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.dropTableIfExists('groups')]);
};
