ALTER TABLE "conversations" DROP COLUMN "title";
ALTER TABLE "conversations" DROP COLUMN "phase";
ALTER TABLE "conversations" ADD COLUMN "belief_id" text NOT NULL;
ALTER TABLE "conversations" ADD COLUMN "instance" text NOT NULL;
ALTER TABLE "conversations" ADD COLUMN "day" integer NOT NULL;
