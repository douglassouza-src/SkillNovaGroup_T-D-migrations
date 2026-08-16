import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notification_alerts', (table) => {
    table
      .uuid('created_by')
      .nullable();
  });

  await knex.schema.alterTable('notification_alerts', (table) => {
    table
      .foreign(
        'created_by',
        'fk_notification_alerts_created_by',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table.index(
      ['created_by'],
      'idx_notification_alerts_created_by',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notification_alerts', (table) => {
    table.dropForeign(
      ['created_by'],
      'fk_notification_alerts_created_by',
    );

    table.dropIndex(
      ['created_by'],
      'idx_notification_alerts_created_by',
    );

    table.dropColumn('created_by');
  });
}