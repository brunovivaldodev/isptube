-- CreateTable
CREATE TABLE "users" (
    "id" CHAR(250) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mideas" (
    "id" CHAR(250) NOT NULL,
    "name" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "album" TEXT,
    "music_groups" TEXT,
    "description" TEXT,
    "genre" TEXT,
    "release_date" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "mideas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "mideas" ADD CONSTRAINT "mideas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
