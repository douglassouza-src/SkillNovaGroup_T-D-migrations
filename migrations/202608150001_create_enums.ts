import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);

  await knex.raw(`
    CREATE TYPE user_role AS ENUM (
      'MASTER',
      'MANAGER',
      'COORDINATOR',
      'TECHNICIAN'
    );
  `);

  await knex.raw(`
    CREATE TYPE training_type AS ENUM (
      'MANDATORY',
      'OPTIONAL'
    );
  `);

  await knex.raw(`
    CREATE TYPE participation_status AS ENUM (
      'PARTICIPATED',
      'ABSENT'
    );
  `);

  await knex.raw(`
    CREATE TYPE training_evaluation AS ENUM (
      'POOR',
      'GOOD',
      'VERY_GOOD'
    );
  `);

  await knex.raw(`
    CREATE TYPE notification_channel AS ENUM (
      'DISCORD'
    );
  `);

  await knex.raw(`
    CREATE TYPE notification_type AS ENUM (
      'MANUAL'
    );
  `);

  await knex.raw(`
    CREATE TYPE notification_status AS ENUM (
      'SENT',
      'FAILED'
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TYPE IF EXISTS notification_status;
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS notification_type;
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS notification_channel;
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS training_evaluation;
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS participation_status;
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS training_type;
  `);

  await knex.raw(`
    DROP TYPE IF EXISTS user_role;
  `);
}