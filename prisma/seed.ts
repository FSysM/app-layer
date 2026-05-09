import "dotenv/config"
import { Pool } from "pg"
import bcrypt from "bcrypt"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/client"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {

  const hashedPassword = await bcrypt.hash("password", 10)

  console.log("Seeding...")

  const student = await prisma.user.upsert({
    where: { username: "student1" },
    update: {},
    create: {
      username: "student1",
      email: "student1@email.com",
      password: hashedPassword,
      role: "STUDENT",
      name: "Student One",
      phone: "123456789",
      address: "Prague"
    }
  })

  const teacher1 = await prisma.user.upsert({
    where: { username: "teacher1" },
    update: {},
    create: {
      username: "teacher1",
      email: "teacher1@email.com",
      password: hashedPassword,
      role: "TEACHER",
      name: "Teacher One",
      phone: "123456789",
      address: "Prague"
    }
  })

  const teacher2 = await prisma.user.upsert({
    where: { username: "teacher2" },
    update: {},
    create: {
      username: "teacher2",
      email: "teacher2@email.com",
      password: hashedPassword,
      role: "TEACHER",
      name: "Teacher Two",
      phone: "123456789",
      address: "Prague"
    }
  })

  await prisma.task.create({
    data: {
      topic: "AI Thesis",
      status: "PENDING",
      type: "bachelor",

      faculty: "PRF",
      department: "Informatics",

      annotation: "AI research",
      literature: "papers",

      assignmentDate: new Date(),

      studentId: student.id,
      supervisorId: teacher1.id,
      opponentId: teacher2.id,
    }
  })

  console.log("Done")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })