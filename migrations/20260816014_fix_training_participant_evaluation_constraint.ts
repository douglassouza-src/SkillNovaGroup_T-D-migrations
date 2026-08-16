import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE training_participants
    DROP CONSTRAINT IF EXISTS chk_training_participants_evaluation;
  `);

  await knex.raw(`
    ALTER TABLE training_participants
    ADD CONSTRAINT chk_training_participants_evaluation
    CHECK (
      (
        participation_status = 'ABSENT'
        AND evaluation IS NULL
      )
      OR
      (
        participation_status = 'PARTICIPATED'
        AND (
          evaluation IS NULL
          OR evaluation IN ('POOR', 'GOOD', 'VERY_GOOD')
        )
      )
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE training_participants
    DROP CONSTRAINT IF EXISTS chk_training_participants_evaluation;
  `);

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
}