import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.staffAssignment.deleteMany();
  await prisma.content.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.user.deleteMany();
  await prisma.classSection.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.activationCode.deleteMany();
  await prisma.school.deleteMany();

  // Create School
  const school = await prisma.school.create({
    data: {
      name: "ABC School",
      isActive: false,
    },
  });

  // Create Activation Code
  await prisma.activationCode.create({
    data: {
      code: "SCHOOL-2026-ABC123",
      expiresAt: new Date("2027-12-31"),
      schoolId: school.id,
    },
  });

  // Create Grade
  const grade = await prisma.grade.create({
    data: {
      name: "Grade 6",
      schoolId: school.id,
    },
  });

  // Create Class
  const classSection = await prisma.classSection.create({
    data: {
      name: "Section A",
      gradeId: grade.id,
    },
  });

  // Create Demo Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "School Admin",
      email: "admin@school.com",
      password: hashedPassword,
      role: Role.ADMIN,
      schoolId: school.id,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });