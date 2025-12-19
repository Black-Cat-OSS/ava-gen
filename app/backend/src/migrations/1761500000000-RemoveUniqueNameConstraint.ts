import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class RemoveUniqueNameConstraint1761500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('palettes', 'IDX_palette_name');
    
    await queryRunner.query(`
      ALTER TABLE "palettes" DROP CONSTRAINT IF EXISTS "UQ_palettes_name"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "palettes" ADD CONSTRAINT "UQ_palettes_name" UNIQUE ("name")
    `);
    
    await queryRunner.createIndex(
      'palettes',
      new TableIndex({
        name: 'IDX_palette_name',
        columnNames: ['name'],
      }),
    );
  }
}
