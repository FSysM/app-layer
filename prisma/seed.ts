import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Must match the IDs hardcoded in keycloak/entrypoint.sh
const IDS = {
  student1: '2fb9d22a-32d7-48d9-90f4-d9f91c4c8885',
  student2: '46227c5d-24b4-40e9-877f-a98ed9dcbda9',
  student3: 'd5412b95-eeff-478a-9ce3-e8323fa95b40',
  teacher1: '2cb385e4-f0ec-45bb-afa1-6f4c7f88c8f2',
  teacher2: '1ca85ea9-133f-4908-8330-610535113232',
  teacher3: '5778d982-6325-4f6b-9305-68a82cb49165',
};

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.review.deleteMany();
  await prisma.submissionFile.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  // =========================================
  // USERS  (id = Keycloak sub from entrypoint.sh)
  // =========================================

  const [student1, student2, student3, teacher1, teacher2, teacher3] =
    await Promise.all([
      prisma.user.create({
        data: {
          id: IDS.student1,
          username: 'student1',
          email: 'student1@email.com',
          role: 'STUDENT',
          name: 'Student One',
        },
      }),
      prisma.user.create({
        data: {
          id: IDS.student2,
          username: 'student2',
          email: 'student2@email.com',
          role: 'STUDENT',
          name: 'Student Two',
        },
      }),
      prisma.user.create({
        data: {
          id: IDS.student3,
          username: 'student3',
          email: 'student3@email.com',
          role: 'STUDENT',
          name: 'Student Three',
        },
      }),
      prisma.user.create({
        data: {
          id: IDS.teacher1,
          username: 'teacher1',
          email: 'teacher1@email.com',
          role: 'TEACHER',
          name: 'Teacher One',
        },
      }),
      prisma.user.create({
        data: {
          id: IDS.teacher2,
          username: 'teacher2',
          email: 'teacher2@email.com',
          role: 'TEACHER',
          name: 'Teacher Two',
        },
      }),
      prisma.user.create({
        data: {
          id: IDS.teacher3,
          username: 'teacher3',
          email: 'teacher3@email.com',
          role: 'TEACHER',
          name: 'Teacher Three',
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
  await prisma.assignment.create({
    data: {
      topic: 'Blockchain in Supply Chain',
      type: 'bc',
      annotation: 'Decentralized logistics tracking',
      faculty: 'PRF',
      department: 'Informatics',
      taken: false,
      supervisorId: teacher1.id,
    },
  });

  // =========================================
  // SUBMISSIONS
  // =========================================

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
      opponentId: teacher1.id,
    },
  });
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
      opponentId: teacher1.id,
    },
  });

  await prisma.submission.createMany({
    data: [
      {
        assignmentId: assignment1.id,
        status: 'PENDING',
        topic: assignment1.topic,
        type: assignment1.type,
        faculty: assignment1.faculty,
        department: assignment1.department,
        annotation: assignment1.annotation,
        literature: 'Deep Learning papers',
      },
      {
        assignmentId: assignment2.id,
        status: 'PENDING',
        topic: assignment2.topic,
        type: assignment2.type,
        faculty: assignment2.faculty,
        department: assignment2.department,
        annotation: assignment2.annotation,
        literature: 'IBM Quantum documentation',
      },
      {
        assignmentId: assignment4.id,
        status: 'PENDING',
        topic: assignment4.topic,
        type: assignment4.type,
        faculty: assignment4.faculty,
        department: assignment4.department,
        annotation: assignment4.annotation,
        literature: 'Cloud computing books',
      },
      {
        assignmentId: assignment5.id,
        status: 'PENDING',
        topic: assignment5.topic,
        type: assignment5.type,
        faculty: assignment5.faculty,
        department: assignment5.department,
        annotation: assignment5.annotation,
        literature: 'Mathematical publications',
      },
    ],
  });

  // =========================================
  // REVIEWS (COMPLETED submissions only)
  // =========================================

  await prisma.review.createMany({
    data: [
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

  console.log('✅ Seeded: 6 users | 7 assignments | 6 submissions | 4 reviews');
  console.log(
    '   Login via Keycloak — student1/2/3 | teacher1/2/3 | password: password',
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
