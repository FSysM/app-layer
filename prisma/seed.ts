import "dotenv/config";
import { Pool } from "pg";
import bcrypt from 'bcrypt'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from './generated/client'

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const hashedPassword = await bcrypt.hash('password', 10)

  console.log('Seeding...')

  await prisma.user.createMany({
    data: [
      {
        username: 'student1',
        email: 'student1@email.com',
        password: hashedPassword,
        role: 'STUDENT',
        name: 'Student One',
        phone: '123456789',
        address: 'Prague'
      },
      {
        username: 'teacher1',
        email: 'teacher1@email.com',
        password: hashedPassword,
        role: 'TEACHER',
        name: 'Teacher One',
        phone: '123456789',
        address: 'Prague'
      }
    ]
  })

  console.log('Done')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
