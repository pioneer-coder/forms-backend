import pgDataSource from '@/dbs/typeorm/index.js';

type PGTable = {
  tableName: string;
  numRows: number;
};

const clearPostgresDB = async (): Promise<void> => {
  const queryRunner = await pgDataSource.createQueryRunner();
  await queryRunner.connect();
  const getTablesResponse: PGTable[] = await queryRunner.manager.query(`
WITH tbl AS (
  SELECT
      table_schema,
      TABLE_NAME
    FROM information_schema.tables
    WHERE TABLE_NAME not like 'pg_%'
    AND table_schema in ('public')
  )
  SELECT
    table_schema,
    TABLE_NAME "tableName",
    (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, TABLE_NAME), FALSE, TRUE, '')))[1]::text::int AS "numRows"
  FROM tbl
  ORDER BY "numRows" DESC`);

  const tablesToClear = getTablesResponse
    .filter((table) => table.tableName !== 'migrations' && table.numRows > 0)
    .map((table) => table.tableName);

  if (tablesToClear.length > 0) {
    await queryRunner.manager.query(`TRUNCATE ${tablesToClear.join(',')} CASCADE`);
  }
  await queryRunner.release();
};

export default clearPostgresDB;
