import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseColorFieldLengths1760910691899 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Increase primaryColor field length from 7 to 20 characters
        await queryRunner.query(`ALTER TABLE "avatars" ALTER COLUMN "primaryColor" TYPE varchar(20)`);
        
        // Increase foreignColor field length from 7 to 20 characters
        await queryRunner.query(`ALTER TABLE "avatars" ALTER COLUMN "foreignColor" TYPE varchar(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert primaryColor field length back to 7 characters
        await queryRunner.query(`ALTER TABLE "avatars" ALTER COLUMN "primaryColor" TYPE varchar(7)`);
        
        // Revert foreignColor field length back to 7 characters
        await queryRunner.query(`ALTER TABLE "avatars" ALTER COLUMN "foreignColor" TYPE varchar(7)`);
    }

}
