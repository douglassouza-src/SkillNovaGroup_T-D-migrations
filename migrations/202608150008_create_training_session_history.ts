import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('training_session_history', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('training_session_id')
      .notNullable();

    table
      .string('action', 50)
      .notNullable();

    table
      .timestamp('old_start_at', { useTz: true })
      .nullable();

    table
      .timestamp('old_end_at', { useTz: true })
      .nullable();

    table
      .timestamp('new_start_at', { useTz: true })
      .nullable();

    table
      .timestamp('new_end_at', { useTz: true })
      .nullable();

    table
      .text('reason')
      .nullable();

    table
      .timestamp('changed_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .uuid('changed_by')
      .notNullable();

    table
      .foreign(
        'training_session_id',
        'fk_training_session_history_session',
      )
      .references('id')
      .inTable('training_sessions')
      .onDelete('RESTRICT');

    table
      .foreign(
        'changed_by',
        'fk_training_session_history_changed_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  await knex.schema.alterTable('training_session_history', (table) => {
    table.index(
      ['training_session_id', 'changed_at'],
      'idx_training_session_history_session_changed_at',
    );

    table.index(
      ['changed_by'],
      'idx_training_session_history_changed_by',
    );

    table.index(
      ['action'],
      'idx_training_session_history_action',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('training_session_history');
}