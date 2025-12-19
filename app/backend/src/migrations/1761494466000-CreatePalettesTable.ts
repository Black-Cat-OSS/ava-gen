import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePalettesTable1761494466000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'palettes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'key',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'primaryColor',
            type: 'varchar',
            length: '7',
          },
          {
            name: 'foreignColor',
            type: 'varchar',
            length: '7',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'palettes',
      new TableIndex({
        name: 'IDX_palette_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'palettes',
      new TableIndex({
        name: 'IDX_palette_key',
        columnNames: ['key'],
      }),
    );

    const palettes = [
      ["Green", "green", "#22C55E", "#86EFAC"],
      ["Blue", "blue", "#3B82F6", "#60A5FA"],
      ["Red", "red", "#EF4444", "#F472B6"],
      ["Orange", "orange", "#F97316", "#FDE047"],
      ["Purple", "purple", "#A855F7", "#C084FC"],
      ["Teal", "teal", "#14B8A6", "#06B6D4"],
      ["Indigo", "indigo", "#6366F1", "#3B82F6"],
      ["Pink", "pink", "#F472B6", "#F43F5E"],
      ["Emerald", "emerald", "#10B981", "#22C55E"],
      ["Default", "default", "#3b82f6", "#ef4444"],
      ["Monochrome", "monochrome", "#333333", "#666666"],
      ["Vibrant", "vibrant", "#FF6B35", "#F7931E"],
      ["Pastel", "pastel", "#FFB3BA", "#FFDFBA"],
      ["Ocean", "ocean", "#0077BE", "#00A8CC"],
      ["Sunset", "sunset", "#FF8C42", "#FF6B35"],
      ["Forest", "forest", "#2E8B57", "#32CD32"],
      ["Royal", "royal", "#6A0DAD", "#8A2BE2"],
    ];

    for (const [name, key, primaryColor, foreignColor] of palettes) {
      await queryRunner.query(
        `INSERT INTO "palettes" (name, key, "primaryColor", "foreignColor") VALUES ($1, $2, $3, $4)`,
        [name, key, primaryColor, foreignColor],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('palettes', 'IDX_palette_key');
    await queryRunner.dropIndex('palettes', 'IDX_palette_name');
    await queryRunner.dropTable('palettes');
  }
}
