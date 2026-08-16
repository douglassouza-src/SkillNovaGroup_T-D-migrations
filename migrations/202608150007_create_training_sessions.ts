import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('training_sessions', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('training_id')
      .notNullable();

    table
      .timestamp('start_at', { useTz: true })
      .notNullable();

    table
      .timestamp('end_at', { useTz: true })
      .notNullable();

    table
      .text('location')
      .nullable();

    table
      .text('notes')
      .nullable();

    table
      .boolean('is_cancelled')
      .notNullable()
      .defaultTo(false);

    table
      .timestamp('cancelled_at', { useTz: true })
      .nullable();

    table
      .uuid('cancelled_by')
      .nullable();

    table
      .text('cancellation_reason')
      .nullable();

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .uuid('created_by')
      .notNullable();

    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .uuid('updated_by')
      .notNullable();

    table
      .foreign('training_id', 'fk_training_sessions_training')
      .references('id')
      .inTable('trainings')
      .onDelete('RESTRICT');

    table
      .foreign('cancelled_by', 'fk_training_sessions_cancelled_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('created_by', 'fk_training_sessions_created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('updated_by', 'fk_training_sessions_updated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table.check(
      'end_at > start_at',
      [],
      'chk_training_sessions_end_after_start',
    );
  });

  await knex.schema.alterTable('training_sessions', (table) => {
    table.index(
      ['training_id'],
      'idx_training_sessions_training',
    );

    table.index(
      ['start_at'],
      'idx_training_sessions_start_at',
    );

    table.index(
      ['end_at'],
      'idx_training_sessions_end_at',
    );

    table.index(
      ['is_cancelled'],
      'idx_training_sessions_is_cancelled',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('training_sessions');
}