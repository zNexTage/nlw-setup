-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "daysHabits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "habitWeekdays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daysHabits_dayId_habitId_key" ON "daysHabits"("dayId", "habitId");

-- CreateIndex
CREATE UNIQUE INDEX "habitWeekdays_habitId_weekday_key" ON "habitWeekdays"("habitId", "weekday");
