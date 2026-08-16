import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  /**
   * ============================================================
   * USERS -> USERS
   * Audit relationships
   * ============================================================
   */

  await knex.schema.alterTable('users', (table) => {
    table
      .foreign('created_by', 'fk_users_created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('updated_by', 'fk_users_updated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('deactivated_by', 'fk_users_deactivated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  /**
   * ============================================================
   * TEAMS -> USERS
   * Manager and Coordinator relationships
   * ============================================================
   */

  await knex.schema.alterTable('teams', (table) => {
    table
      .foreign('manager_id', 'fk_teams_manager')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('coordinator_id', 'fk_teams_coordinator')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });

  /**
   * ============================================================
   * TEAMS -> USERS
   * Audit relationships
   * ============================================================
   */

  await knex.schema.alterTable('teams', (table) => {
    table
      .foreign('created_by', 'fk_teams_created_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('updated_by', 'fk_teams_updated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');

    table
      .foreign('deactivated_by', 'fk_teams_deactivated_by')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
  });
}

export async function down(knex: Knex): Promise<void> {
  /**
   * ============================================================
   * Remove TEAM -> USER relationships
   * ============================================================
   */

  await knex.schema.alterTable('teams', (table) => {
    table.dropForeign(
      ['manager_id'],
      'fk_teams_manager',
    );

    table.dropForeign(
      ['coordinator_id'],
      'fk_teams_coordinator',
    );

    table.dropForeign(
      ['created_by'],
      'fk_teams_created_by',
    );

    table.dropForeign(
      ['updated_by'],
      'fk_teams_updated_by',
    );

    table.dropForeign(
      ['deactivated_by'],
      'fk_teams_deactivated_by',
    );
  });

  /**
   * ============================================================
   * Remove USER -> USER relationships
   * ============================================================
   */

  await knex.schema.alterTable('users', (table) => {
    table.dropForeign(
      ['created_by'],
      'fk_users_created_by',
    );

    table.dropForeign(
      ['updated_by'],
      'fk_users_updated_by',
    );

    table.dropForeign(
      ['deactivated_by'],
      'fk_users_deactivated_by',
    );
  });
}