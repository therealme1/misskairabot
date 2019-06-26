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
            table.datetime('created_at');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([knex.schema.dropTableIfExists('groups')]);
};
