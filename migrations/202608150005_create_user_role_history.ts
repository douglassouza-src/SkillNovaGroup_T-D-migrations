import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_role_history', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('user_id')
      .notNullable();

    /**
     * NULL is allowed because the first record
     * for a user may represent their initial assignment.
     */
    table
      .specificType('old_role', 'user_role')
      .nullable();

    table
      .specificType('new_role', 'user_role')
      .notNullable();

    /**
     * NULL means that the user did not previously
     * belong to a team.
     */
    table
      .uuid('old_team_id')
      .nullable();

    table
      .uuid('new_team_id')
      .nullable();

    table
      .timestamp('changed_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .uuid('changed_by')
      .notNullable();

    table
      .text('reason')
      .nullable();

    /**
     * User whose role/team changed.
     */
    table
      .foreign(
        'user_id',
        'fk_user_role_history_user',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    /**
     * User who performed the change.
     */
    table
      .foreign(
        'changed_by',
        'fk_user_role_history_changed_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    /**
     * Previous team.
     */
    table
      .foreign(
        'old_team_id',
        'fk_user_role_history_old_team',
      )
      .references('id')
      .inTable('teams')
      .onDelete('RESTRICT');

    /**
     * New team.
     */
    table
      .foreign(
        'new_team_id',
        'fk_user_role_history_new_team',
      )
      .references('id')
      .inTable('teams')
      .onDelete('RESTRICT');
  });

  /**
   * Indexes for historical queries.
   */
  await knex.schema.alterTable('user_role_history', (table) => {
    table.index(
      ['user_id', 'changed_at'],
      'idx_user_role_history_user_changed_at',
    );

    table.index(
      ['changed_by'],
      'idx_user_role_history_changed_by',
    );

    table.index(
      ['old_team_id'],
      'idx_user_role_history_old_team',
    );

    table.index(
      ['new_team_id'],
      'idx_user_role_history_new_team',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_role_history');
}