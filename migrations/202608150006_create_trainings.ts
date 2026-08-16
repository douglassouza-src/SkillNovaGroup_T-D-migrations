import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('trainings', (table) => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .string('name', 200)
      .notNullable();

    table
      .text('description')
      .nullable();

    table
      .specificType('type', 'training_type')
      .notNullable();

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
      .notNullable();

    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .uuid('updated_by')
      .notNullable();

    table
      .timestamp('deactivated_at', { useTz: true })
      .nullable();

    table
      .uuid('deactivated_by')
      .nullable();

    table
      .foreign('created_by', 'fk_trainings_created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('updated_by', 'fk_trainings_updated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('deactivated_by', 'fk_trainings_deactivated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  await knex.schema.alterTable('trainings', (table) => {
    table.index(
      ['type'],
      'idx_trainings_type',
    );

    table.index(
      ['is_active'],
      'idx_trainings_is_active',
    );

    table.index(
      ['name'],
      'idx_trainings_name',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('trainings');
}