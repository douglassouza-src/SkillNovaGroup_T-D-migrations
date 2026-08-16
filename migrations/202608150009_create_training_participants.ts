import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('training_participants', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('training_session_id')
      .notNullable();

    table
      .uuid('user_id')
      .notNullable();

    table
      .specificType('participation_status', 'participation_status')
      .notNullable()
      .defaultTo('ABSENT');

    table
      .specificType('evaluation', 'training_evaluation')
      .nullable();

    table
      .timestamp('attendance_recorded_at', { useTz: true })
      .nullable();

    table
      .uuid('attendance_recorded_by')
      .nullable();

    table
      .timestamp('evaluated_at', { useTz: true })
      .nullable();

    table
      .uuid('evaluated_by')
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

    /**
     * A user cannot be registered more than once
     * in the same training session.
     */
    table.unique(
      ['training_session_id', 'user_id'],
      'uq_training_participants_session_user',
    );

    /**
     * Relationships.
     */
    table
      .foreign(
        'training_session_id',
        'fk_training_participants_session',
      )
      .references('id')
      .inTable('training_sessions')
      .onDelete('RESTRICT');

    table
      .foreign(
        'user_id',
        'fk_training_participants_user',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign(
        'attendance_recorded_by',
        'fk_training_participants_attendance_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign(
        'evaluated_by',
        'fk_training_participants_evaluated_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign(
        'created_by',
        'fk_training_participants_created_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign(
        'updated_by',
        'fk_training_participants_updated_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  /**
   * A participant can only receive an evaluation
   * if they actually participated.
   */
  await knex.raw(`
    ALTER TABLE training_participants
    ADD CONSTRAINT chk_training_participants_evaluation
    CHECK (
      (
        participation_status = 'PARTICIPATED'
        AND evaluation IS NOT NULL
      )
      OR
      (
        participation_status = 'ABSENT'
        AND evaluation IS NULL
      )
    );
  `);

  await knex.schema.alterTable('training_participants', (table) => {
    table.index(
      ['training_session_id'],
      'idx_training_participants_session',
    );

    table.index(
      ['user_id'],
      'idx_training_participants_user',
    );

    table.index(
      ['participation_status'],
      'idx_training_participants_status',
    );

    table.index(
      ['evaluation'],
      'idx_training_participants_evaluation',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('training_participants');
}