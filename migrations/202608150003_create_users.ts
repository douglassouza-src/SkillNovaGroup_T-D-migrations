import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .string('name', 150)
      .notNullable();

    table
      .string('email', 255)
      .notNullable()
      .unique();

    table
      .text('password_hash')
      .notNullable();

    table
      .specificType('role', 'user_role')
      .notNullable();

    /**
     * A user may belong to a team.
     *
     * The foreign key is created here because
     * teams already exists.
     */
    table
      .uuid('team_id')
      .nullable();

    table
      .boolean('is_active')
      .notNullable()
      .defaultTo(true);

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    /**
     * Audit fields.
     *
     * The foreign keys to users.id are intentionally
     * added in a later migration because they create
     * a self-referencing relationship.
     */
    table
      .uuid('created_by')
      .nullable();

    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .uuid('updated_by')
      .nullable();

    table
      .timestamp('deactivated_at', { useTz: true })
      .nullable();

    table
      .uuid('deactivated_by')
      .nullable();
  });

  /**
   * User -> Team relationship.
   */
  await knex.schema.alterTable('users', (table) => {
    table
      .foreign('team_id', 'fk_users_team')
      .references('id')
      .inTable('teams')
      .onDelete('RESTRICT');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}