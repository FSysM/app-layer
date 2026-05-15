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

  console.log('🌱 Seeding database...');

  // =========================================
  // CLEAN DATABASE
  // =========================================

  await prisma.review.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  // =========================================
  // USERS
  // =========================================

  const [student1, student2, student3, teacher1, teacher2, teacher3] =
    await Promise.all([
      prisma.user.create({
        data: {
          username: 'student1',
          email: 'student1@email.com',
          password: hashedPassword,
          role: 'STUDENT',
          name: 'Student One',
          phone: '111111111',
          address: 'Prague',
        },
      }),

      prisma.user.create({
        data: {
          username: 'student2',
          email: 'student2@email.com',
          password: hashedPassword,
          role: 'STUDENT',
          name: 'Student Two',
          phone: '222222222',
          address: 'Brno',
        },
      }),

      prisma.user.create({
        data: {
          username: 'student3',
          email: 'student3@email.com',
          password: hashedPassword,
          role: 'STUDENT',
          name: 'Student Three',
          phone: '333333333',
          address: 'Ostrava',
        },
      }),

      prisma.user.create({
        data: {
          username: 'teacher1',
          email: 'teacher1@email.com',
          password: hashedPassword,
          role: 'TEACHER',
          name: 'Teacher One',
          phone: '444444444',
          address: 'Prague',
        },
      }),

      prisma.user.create({
        data: {
          username: 'teacher2',
          email: 'teacher2@email.com',
          password: hashedPassword,
          role: 'TEACHER',
          name: 'Teacher Two',
          phone: '555555555',
          address: 'Brno',
        },
      }),

      prisma.user.create({
        data: {
          username: 'teacher3',
          email: 'teacher3@email.com',
          password: hashedPassword,
          role: 'TEACHER',
          name: 'Teacher Three',
          phone: '666666666',
          address: 'Ostrava',
        },
      }),
    ]);

  // =========================================
  // ASSIGNMENTS
  // =========================================

  const assignment1 = await prisma.assignment.create({
    data: {
      topic: 'Artificial Intelligence in Healthcare',
      type: 'bc',
      annotation: 'AI diagnostics and prediction systems',
      faculty: 'PRF',
      department: 'Informatics',
      taken: true,

      studentId: student1.id,
      supervisorId: teacher1.id,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      topic: 'Quantum Computing Algorithms',
      type: 'mgr',
      annotation: 'Quantum optimization methods',
      faculty: 'PRF',
      department: 'Physics',
      taken: true,

      studentId: student2.id,
      supervisorId: teacher1.id,
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      topic: 'Organic Chemistry Structures',
      type: 'mgr',
      annotation: 'Analysis of organic compounds',
      faculty: 'CHEM',
      department: 'Chemistry',
      taken: true,

      studentId: student3.id,
      supervisorId: teacher2.id,
    },
  });

  const assignment4 = await prisma.assignment.create({
    data: {
      topic: 'Distributed Cloud Systems',
      type: 'bc',
      annotation: 'Cloud scalability research',
      faculty: 'PRF',
      department: 'Informatics',
      taken: true,

      studentId: student1.id,
      supervisorId: teacher2.id,
    },
  });

  const assignment5 = await prisma.assignment.create({
    data: {
      topic: 'Mathematical Prediction Models',
      type: 'phd',
      annotation: 'Statistical and predictive systems',
      faculty: 'PRF',
      department: 'Mathematics',
      taken: true,

      studentId: student2.id,
      supervisorId: teacher3.id,
    },
  });

  const assignment6 = await prisma.assignment.create({
    data: {
      topic: 'Particle Physics Research',
      type: 'phd',
      annotation: 'Particle collision analysis',
      faculty: 'PRF',
      department: 'Physics',
      taken: true,

      studentId: student3.id,
      supervisorId: teacher3.id,
    },
  });

  // =========================================
  // SUBMISSIONS
  // =========================================

  const submission1 = await prisma.submission.create({
    data: {
      status: 'PENDING',
      literature: 'Deep Learning papers',
      fileUrl: null,
      assignmentId: assignment1.id,
      opponentId: teacher2.id,
      submissionDate: new Date(),
    },
  });

  const submission2 = await prisma.submission.create({
    data: {
      status: 'IN_PROGRESS',
      literature: 'IBM Quantum documentation',
      fileUrl: null,
      assignmentId: assignment2.id,
      opponentId: teacher3.id,
      submissionDate: new Date(),
    },
  });

  const submission3 = await prisma.submission.create({
    data: {
      status: 'COMPLETED',
      literature: 'Organic chemistry journals',
      fileUrl: null,
      assignmentId: assignment3.id,
      opponentId: teacher1.id,
      submissionDate: new Date(),
    },
  });

  const submission4 = await prisma.submission.create({
    data: {
      status: 'PENDING',
      literature: 'Cloud computing books',
      fileUrl: null,
      assignmentId: assignment4.id,
      opponentId: teacher3.id,
      submissionDate: new Date(),
    },
  });

  const submission5 = await prisma.submission.create({
    data: {
      status: 'IN_PROGRESS',
      literature: 'Mathematical publications',
      fileUrl: null,
      assignmentId: assignment5.id,
      opponentId: teacher1.id,
      submissionDate: new Date(),
    },
  });

  const submission6 = await prisma.submission.create({
    data: {
      status: 'COMPLETED',
      literature: 'Physics reviews',
      fileUrl: null,
      assignmentId: assignment6.id,
      opponentId: teacher2.id,
      submissionDate: new Date(),
    },
  });

  // =========================================
  // REVIEWS
  // =========================================

  await prisma.review.createMany({
    data: [
      {
        grade: 'B',
        type: 'OPPONENT',
        comment: 'Good work overall',
        submissionId: submission1.id,
        reviewerId: teacher1.id,
      },
      {
        grade: 'A',
        type: 'OPPONENT',
        comment: 'Excellent research',
        submissionId: submission2.id,
        reviewerId: teacher1.id,
      },
      {
        grade: 'C',
        type: 'OPPONENT',
        comment: 'Needs improvement',
        submissionId: submission3.id,
        reviewerId: teacher2.id,
      },
      {
        grade: 'B',
        type: 'SUPERVISOR',
        comment: 'Solid submission',
        submissionId: submission4.id,
        reviewerId: teacher2.id,
      },
      {
        grade: 'A',
        type: 'SUPERVISOR',
        comment: 'Very strong work',
        submissionId: submission5.id,
        reviewerId: teacher3.id,
      },
      {
        grade: 'A',
        type: 'SUPERVISOR',
        comment: 'Excellent final result',
        submissionId: submission6.id,
        reviewerId: teacher3.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });
