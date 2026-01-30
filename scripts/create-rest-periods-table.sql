-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "RestPeriodStatus" AS ENUM ('SOLICITADO', 'PENDENTE', 'APROVADO', 'EM_DESCANSO', 'VENCIDO', 'REJEITADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "RestPeriod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "restDays" INTEGER NOT NULL,
    "soldDays" INTEGER NOT NULL DEFAULT 0,
    "acquisitivePeriodStart" TIMESTAMP(3) NOT NULL,
    "acquisitivePeriodEnd" TIMESTAMP(3) NOT NULL,
    "remainingDays" INTEGER NOT NULL DEFAULT 30,
    "contractType" TEXT,
    "status" "RestPeriodStatus" NOT NULL DEFAULT 'SOLICITADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestPeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "RestPeriod" ADD CONSTRAINT "RestPeriod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "RestPeriod_userId_idx" ON "RestPeriod"("userId");
CREATE INDEX IF NOT EXISTS "RestPeriod_status_idx" ON "RestPeriod"("status");
CREATE INDEX IF NOT EXISTS "RestPeriod_startDate_idx" ON "RestPeriod"("startDate");
