import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('training_participant_history', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('training_participant_id')
      .notNullable();

    table
      .string('action', 50)
      .notNullable();

    table
      .specificType('old_participation_status', 'participation_status')
      .nullable();

    table
      .specificType('new_participation_status', 'participation_status')
      .nullable();

    table
      .specificType('old_evaluation', 'training_evaluation')
      .nullable();

    table
      .specificType('new_evaluation', 'training_evaluation')
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
        'training_participant_id',
        'fk_training_participant_history_participant',
      )
      .references('id')
      .inTable('training_participants')
      .onDelete('RESTRICT');

    table
      .foreign(
        'changed_by',
        'fk_training_participant_history_changed_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  await knex.schema.alterTable('training_participant_history', (table) => {
    table.index(
      ['training_participant_id', 'changed_at'],
      'idx_training_participant_history_participant_changed_at',
    );

    table.index(
      ['changed_by'],
      'idx_training_participant_history_changed_by',
    );

    table.index(
      ['action'],
      'idx_training_participant_history_action',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('training_participant_history');
}