import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  console.log('Seeding database...');

  // =========================
  // STUDENTS
  // =========================

  const student1 = await prisma.user.upsert({
    where: { username: 'student1' },
    update: {},
    create: {
      username: 'student1',
      email: 'student1@email.com',
      password: hashedPassword,
      role: 'STUDENT',
      name: 'Student One',
      phone: '111111111',
      address: 'Prague',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { username: 'student2' },
    update: {},
    create: {
      username: 'student2',
      email: 'student2@email.com',
      password: hashedPassword,
      role: 'STUDENT',
      name: 'Student Two',
      phone: '222222222',
      address: 'Brno',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { username: 'student3' },
    update: {},
    create: {
      username: 'student3',
      email: 'student3@email.com',
      password: hashedPassword,
      role: 'STUDENT',
      name: 'Student Three',
      phone: '333333333',
      address: 'Ostrava',
    },
  });

  // =========================
  // TEACHERS
  // =========================

  const teacher1 = await prisma.user.upsert({
    where: { username: 'teacher1' },
    update: {},
    create: {
      username: 'teacher1',
      email: 'teacher1@email.com',
      password: hashedPassword,
      role: 'TEACHER',
      name: 'Teacher One',
      phone: '444444444',
      address: 'Prague',
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { username: 'teacher2' },
    update: {},
    create: {
      username: 'teacher2',
      email: 'teacher2@email.com',
      password: hashedPassword,
      role: 'TEACHER',
      name: 'Teacher Two',
      phone: '555555555',
      address: 'Brno',
    },
  });

  const teacher3 = await prisma.user.upsert({
    where: { username: 'teacher3' },
    update: {},
    create: {
      username: 'teacher3',
      email: 'teacher3@email.com',
      password: hashedPassword,
      role: 'TEACHER',
      name: 'Teacher Three',
      phone: '666666666',
      address: 'Ostrava',
    },
  });

  // =========================
  // ASSIGNMENTS
  // =========================

  const assignment1 = await prisma.assignment.create({
    data: {
      topic: 'AI Thesis',
      type: 'bachelor',

      annotation: 'Artificial intelligence research',

      faculty: 'PRF',
      department: 'Informatics',

      studentId: student1.id,
      supervisorId: teacher1.id,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      topic: 'Quantum Computing',
      type: 'master',

      annotation: 'Quantum algorithms',

      faculty: 'PRF',
      department: 'Physics',

      studentId: student2.id,
      supervisorId: teacher1.id,
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      topic: 'Organic Chemistry',
      type: 'master',

      annotation: 'Organic chemistry analysis',

      faculty: 'CHEM',
      department: 'Chemistry',

      studentId: student3.id,
      supervisorId: teacher2.id,
    },
  });

  const assignment4 = await prisma.assignment.create({
    data: {
      topic: 'Distributed Systems',
      type: 'bachelor',

      annotation: 'Cloud systems',

      faculty: 'PRF',
      department: 'Informatics',

      studentId: student1.id,
      supervisorId: teacher2.id,
    },
  });

  const assignment5 = await prisma.assignment.create({
    data: {
      topic: 'Mathematical Models',
      type: 'phd',

      annotation: 'Advanced mathematics',

      faculty: 'PRF',
      department: 'Mathematics',

      studentId: student2.id,
      supervisorId: teacher3.id,
    },
  });

  const assignment6 = await prisma.assignment.create({
    data: {
      topic: 'Particle Physics',
      type: 'phd',

      annotation: 'Physics research',

      faculty: 'PRF',
      department: 'Physics',

      studentId: student3.id,
      supervisorId: teacher3.id,
    },
  });

  // =========================
  // SUBMISSIONS
  // =========================

  await prisma.submission.createMany({
    data: [
      {
        topic: 'AI Thesis Submission',
        status: 'PENDING',
        type: 'bachelor',

        annotation: 'First submission',
        literature: 'AI papers',

        faculty: 'PRF',
        department: 'Informatics',

        assignmentId: assignment1.id,

        studentId: student1.id,
        supervisorId: teacher1.id,
        opponentId: teacher2.id,

        submissionDate: new Date(),
      },

      {
        topic: 'Quantum Computing Submission',
        status: 'IN_PROGRESS',
        type: 'master',

        annotation: 'Quantum draft',
        literature: 'Quantum books',

        faculty: 'PRF',
        department: 'Physics',

        assignmentId: assignment2.id,

        studentId: student2.id,
        supervisorId: teacher1.id,
        opponentId: teacher3.id,

        submissionDate: new Date(),
      },

      {
        topic: 'Organic Chemistry Submission',
        status: 'COMPLETED',
        type: 'master',

        annotation: 'Completed chemistry work',
        literature: 'Chemistry journals',

        faculty: 'CHEM',
        department: 'Chemistry',

        assignmentId: assignment3.id,

        studentId: student3.id,
        supervisorId: teacher2.id,
        opponentId: teacher1.id,

        submissionDate: new Date(),
      },

      {
        topic: 'Distributed Systems Submission',
        status: 'PENDING',
        type: 'bachelor',

        annotation: 'Cloud infrastructure draft',
        literature: 'Distributed systems literature',

        faculty: 'PRF',
        department: 'Informatics',

        assignmentId: assignment4.id,

        studentId: student1.id,
        supervisorId: teacher2.id,
        opponentId: teacher3.id,

        submissionDate: new Date(),
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
