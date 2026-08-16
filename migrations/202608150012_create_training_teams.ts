import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('training_teams', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('training_id')
      .notNullable();

    table
      .uuid('team_id')
      .notNullable();

    table
      .uuid('created_by')
      .notNullable();

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    /**
     * A training can be associated with
     * multiple teams, but the same team
     * cannot be associated twice.
     */
    table.unique(
      ['training_id', 'team_id'],
      'uq_training_teams_training_team',
    );

    /**
     * Relationships.
     */
    table
      .foreign(
        'training_id',
        'fk_training_teams_training',
      )
      .references('id')
      .inTable('trainings')
      .onDelete('RESTRICT');

    table
      .foreign(
        'team_id',
        'fk_training_teams_team',
      )
      .references('id')
      .inTable('teams')
      .onDelete('RESTRICT');

    table
      .foreign(
        'created_by',
        'fk_training_teams_created_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  await knex.schema.alterTable('training_teams', (table) => {
    table.index(
      ['training_id'],
      'idx_training_teams_training',
    );

    table.index(
      ['team_id'],
      'idx_training_teams_team',
    );

    table.index(
      ['created_by'],
      'idx_training_teams_created_by',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('training_teams');
}