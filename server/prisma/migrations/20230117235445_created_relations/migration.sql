-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_daysHabits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    CONSTRAINT "daysHabits_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "daysHabits_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_daysHabits" ("dayId", "habitId", "id") SELECT "dayId", "habitId", "id" FROM "daysHabits";
DROP TABLE "daysHabits";
ALTER TABLE "new_daysHabits" RENAME TO "daysHabits";
CREATE UNIQUE INDEX "daysHabits_dayId_habitId_key" ON "daysHabits"("dayId", "habitId");
CREATE TABLE "new_habitWeekdays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    CONSTRAINT "habitWeekdays_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habitWeekdays" ("habitId", "id", "weekday") SELECT "habitId", "id", "weekday" FROM "habitWeekdays";
DROP TABLE "habitWeekdays";
ALTER TABLE "new_habitWeekdays" RENAME TO "habitWeekdays";
CREATE UNIQUE INDEX "habitWeekdays_habitId_weekday_key" ON "habitWeekdays"("habitId", "weekday");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
