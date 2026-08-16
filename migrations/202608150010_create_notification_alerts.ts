import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notification_alerts', (table) => {
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
      .specificType('channel', 'notification_channel')
      .notNullable()
      .defaultTo('DISCORD');

    /**
     * How long before the training session
     * the user wants to be notified.
     *
     * Stored in minutes:
     *
     * 1 minute  = 1
     * 1 hour    = 60
     * 1 day     = 1440
     */
    table
      .integer('minutes_before')
      .notNullable();

    /**
     * The actual Discord webhook destination.
     *
     * We keep this configurable so the notification
     * infrastructure is not hard-coded into the database.
     */
    table
      .text('destination')
      .notNullable();

    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    /**
     * Notification delivery result.
     */
    table
      .specificType('status', 'notification_status')
      .notNullable()
      .defaultTo('SENT');

    table
      .timestamp('sent_at', { useTz: true })
      .nullable();

    table
      .text('error_message')
      .nullable();

    table
      .foreign(
        'training_session_id',
        'fk_notification_alerts_session',
      )
      .references('id')
      .inTable('training_sessions')
      .onDelete('RESTRICT');

    table
      .foreign(
        'user_id',
        'fk_notification_alerts_user',
      )
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    /**
     * One user can configure only one alert
     * for a given training session.
     */
    table.unique(
      ['training_session_id', 'user_id'],
      'uq_notification_alerts_session_user',
    );
  });

  await knex.raw(`
    ALTER TABLE notification_alerts
    ADD CONSTRAINT chk_notification_alerts_minutes_before
    CHECK (
      minutes_before IN (1, 60, 1440)
    );
  `);

  await knex.schema.alterTable('notification_alerts', (table) => {
    table.index(
      ['user_id'],
      'idx_notification_alerts_user',
    );

    table.index(
      ['training_session_id'],
      'idx_notification_alerts_session',
    );

    table.index(
      ['status'],
      'idx_notification_alerts_status',
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notification_alerts');
}