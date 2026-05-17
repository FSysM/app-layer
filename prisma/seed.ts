import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  console.log('🌱 Seeding database...');

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
        data: { username: 'student1', email: 'student1@email.com', password: hashedPassword, role: 'STUDENT', name: 'Student One' },
      }),
      prisma.user.create({
        data: { username: 'student2', email: 'student2@email.com', password: hashedPassword, role: 'STUDENT', name: 'Student Two' },
      }),
      prisma.user.create({
        data: { username: 'student3', email: 'student3@email.com', password: hashedPassword, role: 'STUDENT', name: 'Student Three' },
      }),
      prisma.user.create({
        data: { username: 'teacher1', email: 'teacher1@email.com', password: hashedPassword, role: 'TEACHER', name: 'Teacher One' },
      }),
      prisma.user.create({
        data: { username: 'teacher2', email: 'teacher2@email.com', password: hashedPassword, role: 'TEACHER', name: 'Teacher Two' },
      }),
      prisma.user.create({
        data: { username: 'teacher3', email: 'teacher3@email.com', password: hashedPassword, role: 'TEACHER', name: 'Teacher Three' },
      }),
    ]);

  // =========================================
  // ASSIGNMENTS
  // =========================================

  const assignment1 = await prisma.assignment.create({
    data: { topic: 'Artificial Intelligence in Healthcare', type: 'bc', annotation: 'AI diagnostics and prediction systems', faculty: 'PRF', department: 'Informatics', taken: true, studentId: student1.id, supervisorId: teacher1.id },
  });

  const assignment2 = await prisma.assignment.create({
    data: { topic: 'Quantum Computing Algorithms', type: 'mgr', annotation: 'Quantum optimization methods', faculty: 'PRF', department: 'Physics', taken: true, studentId: student2.id, supervisorId: teacher1.id },
  });

  const assignment3 = await prisma.assignment.create({
    data: { topic: 'Organic Chemistry Structures', type: 'mgr', annotation: 'Analysis of organic compounds', faculty: 'CHEM', department: 'Chemistry', taken: true, studentId: student3.id, supervisorId: teacher2.id },
  });

  const assignment4 = await prisma.assignment.create({
    data: { topic: 'Distributed Cloud Systems', type: 'bc', annotation: 'Cloud scalability research', faculty: 'PRF', department: 'Informatics', taken: true, studentId: student1.id, supervisorId: teacher2.id },
  });

  const assignment5 = await prisma.assignment.create({
    data: { topic: 'Mathematical Prediction Models', type: 'phd', annotation: 'Statistical and predictive systems', faculty: 'PRF', department: 'Mathematics', taken: true, studentId: student2.id, supervisorId: teacher3.id },
  });

  const assignment6 = await prisma.assignment.create({
    data: { topic: 'Particle Physics Research', type: 'phd', annotation: 'Particle collision analysis', faculty: 'PRF', department: 'Physics', taken: true, studentId: student3.id, supervisorId: teacher3.id },
  });

  // Free assignment (not taken)
  await prisma.assignment.create({
    data: { topic: 'Blockchain in Supply Chain', type: 'bc', annotation: 'Decentralized logistics tracking', faculty: 'PRF', department: 'Informatics', taken: false, supervisorId: teacher1.id },
  });

  // =========================================
  // SUBMISSIONS
  // New required fields: topic, type, faculty, department, annotation
  // opponentId only set for COMPLETED submissions
  // =========================================

  const submission1 = await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      status: 'PENDING',
      topic: assignment1.topic,
      type: assignment1.type,
      faculty: assignment1.faculty,
      department: assignment1.department,
      annotation: assignment1.annotation,
      literature: 'Deep Learning papers',
      fileUrl: null,
    },
  });

  const submission2 = await prisma.submission.create({
    data: {
      assignmentId: assignment2.id,
      status: 'PENDING',
      topic: assignment2.topic,
      type: assignment2.type,
      faculty: assignment2.faculty,
      department: assignment2.department,
      annotation: assignment2.annotation,
      literature: 'IBM Quantum documentation',
      fileUrl: null,
    },
  });

  // COMPLETED — teacher2 approved, opponent is teacher3
  const submission3 = await prisma.submission.create({
    data: {
      assignmentId: assignment3.id,
      status: 'COMPLETED',
      topic: assignment3.topic,
      type: assignment3.type,
      faculty: assignment3.faculty,
      department: assignment3.department,
      annotation: assignment3.annotation,
      literature: 'Organic chemistry journals',
      fileUrl: null,
      opponentId: teacher1.id,
    },
  });

  const submission4 = await prisma.submission.create({
    data: {
      assignmentId: assignment4.id,
      status: 'PENDING',
      topic: assignment4.topic,
      type: assignment4.type,
      faculty: assignment4.faculty,
      department: assignment4.department,
      annotation: assignment4.annotation,
      literature: 'Cloud computing books',
      fileUrl: null,
    },
  });

  const submission5 = await prisma.submission.create({
    data: {
      assignmentId: assignment5.id,
      status: 'PENDING',
      topic: assignment5.topic,
      type: assignment5.type,
      faculty: assignment5.faculty,
      department: assignment5.department,
      annotation: assignment5.annotation,
      literature: 'Mathematical publications',
      fileUrl: null,
    },
  });

  // COMPLETED — teacher3 approved, opponent is teacher1
  const submission6 = await prisma.submission.create({
    data: {
      assignmentId: assignment6.id,
      status: 'COMPLETED',
      topic: assignment6.topic,
      type: assignment6.type,
      faculty: assignment6.faculty,
      department: assignment6.department,
      annotation: assignment6.annotation,
      literature: 'Physics reviews',
      fileUrl: null,
      opponentId: teacher1.id,
    },
  });

  // =========================================
  // REVIEWS (only for COMPLETED submissions)
  // @@unique([submissionId, type]) — one SUPERVISOR + one OPPONENT per submission
  // =========================================

  await prisma.review.createMany({
    data: [
      // submission3: supervised by teacher2, opponent is teacher1
      {
        grade: 'B',
        type: 'SUPERVISOR',
        comment: 'Good analytical work',
        submissionId: submission3.id,
        reviewerId: teacher2.id,
      },
      {
        grade: 'C',
        type: 'OPPONENT',
        comment: 'Needs stronger conclusion',
        submissionId: submission3.id,
        reviewerId: teacher1.id,
      },
      // submission6: supervised by teacher3, opponent is teacher1
      {
        grade: 'A',
        type: 'SUPERVISOR',
        comment: 'Excellent final result',
        submissionId: submission6.id,
        reviewerId: teacher3.id,
      },
      {
        grade: 'A',
        type: 'OPPONENT',
        comment: 'Very thorough research',
        submissionId: submission6.id,
        reviewerId: teacher1.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
  console.log('   Logins: student1/2/3 | teacher1/2/3 — password: password');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
