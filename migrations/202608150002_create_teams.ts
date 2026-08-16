import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teams', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .string('name', 150)
      .notNullable()
      .unique();

    table
      .text('description')
      .nullable();

    /**
     * These relationships will be added in migration 004,
     * after the users table exists.
     */
    table
      .uuid('manager_id')
      .nullable();

    table
      .uuid('coordinator_id')
      .nullable();

    table
      .boolean('is_active')
      .notNullable()
      .defaultTo(true);

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('teams');
}