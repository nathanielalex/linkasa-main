import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAlphabets() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const alphabetData = letters.map((letter) => ({
    letter,
    imageUrl: `/letters/${letter}.jpg`,
  }));

  for (const data of alphabetData) {
    await prisma.alphabet.upsert({
      where: { letter: data.letter },
      update: {},
      create: data,
    });
  }

  console.log("Seeded alphabets");
}

async function seedLessons() {
  const lessonData = [
    { title: "A-E", lessonOrder: 1 },
    { title: "F-J", lessonOrder: 2 },
    { title: "K-O", lessonOrder: 3 },
    { title: "P-T", lessonOrder: 4 },
    { title: "U-Z", lessonOrder: 5 },
  ];

  for (const data of lessonData) {
    await prisma.lesson.upsert({
      where: { lessonOrder: data.lessonOrder },
      update: {},
      create: data,
    });
  }

  console.log("Seeded lessons");
}

async function seedLessonAlphabets() {
  const mappings = [
    { lessonId: 1, alphabetIds: [1, 2, 3, 4, 5] },
    { lessonId: 2, alphabetIds: [6, 7, 8, 9, 10] },
    { lessonId: 3, alphabetIds: [11, 12, 13, 14, 15] },
    { lessonId: 4, alphabetIds: [16, 17, 18, 19, 20] },
    { lessonId: 5, alphabetIds: [21, 22, 23, 24, 25, 26] },
  ];

  for (const { lessonId, alphabetIds } of mappings) {
    for (const alphabetId of alphabetIds) {
      const existing = await prisma.lessonAlphabet.findFirst({
        where: { lessonId, alphabetId },
      });

      if (!existing) {
        await prisma.lessonAlphabet.create({
          data: { lessonId, alphabetId },
        });
      }
    }
  }

  console.log("Seeded lesson-alphabet relationships");
}

async function seedExercises() {
  const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  let alphabetId = 1;

  for (let lessonId = 1; lessonId <= 5; lessonId++) {
    for (let i = 0; i <= 5; i++) {
      if (lessonId != 5 && i == 5) {
        continue;
      }
      const letter = alphabetLetters[alphabetId - 1];
      const imageUrl = `/letters/${letter}.jpg`;

      await prisma.exercise.create({
        data: {
          lessonId,
          imageUrl,
          correctAlphabetId: alphabetId,
        },
      });

      alphabetId++;
    }
  }

  console.log("Seeded exercises");
}

async function seedExerciseOptions() {
  const exerciseOptions = [
    { exerciseId: 1, alphabetId: 1, isCorrect: true },
    { exerciseId: 1, alphabetId: 2, isCorrect: false },
    { exerciseId: 1, alphabetId: 3, isCorrect: false },
    { exerciseId: 1, alphabetId: 4, isCorrect: false },

    { exerciseId: 2, alphabetId: 2, isCorrect: true },
    { exerciseId: 2, alphabetId: 1, isCorrect: false },
    { exerciseId: 2, alphabetId: 3, isCorrect: false },
    { exerciseId: 2, alphabetId: 4, isCorrect: false },

    { exerciseId: 3, alphabetId: 3, isCorrect: true },
    { exerciseId: 3, alphabetId: 1, isCorrect: false },
    { exerciseId: 3, alphabetId: 2, isCorrect: false },
    { exerciseId: 3, alphabetId: 4, isCorrect: false },

    { exerciseId: 4, alphabetId: 4, isCorrect: true },
    { exerciseId: 4, alphabetId: 1, isCorrect: false },
    { exerciseId: 4, alphabetId: 2, isCorrect: false },
    { exerciseId: 4, alphabetId: 3, isCorrect: false },

    { exerciseId: 5, alphabetId: 5, isCorrect: true },
    { exerciseId: 5, alphabetId: 1, isCorrect: false },
    { exerciseId: 5, alphabetId: 2, isCorrect: false },
    { exerciseId: 5, alphabetId: 3, isCorrect: false },

    { exerciseId: 6, alphabetId: 6, isCorrect: true },
    { exerciseId: 6, alphabetId: 7, isCorrect: false },
    { exerciseId: 6, alphabetId: 8, isCorrect: false },
    { exerciseId: 6, alphabetId: 9, isCorrect: false },

    { exerciseId: 7, alphabetId: 7, isCorrect: true },
    { exerciseId: 7, alphabetId: 6, isCorrect: false },
    { exerciseId: 7, alphabetId: 8, isCorrect: false },
    { exerciseId: 7, alphabetId: 9, isCorrect: false },

    { exerciseId: 8, alphabetId: 8, isCorrect: true },
    { exerciseId: 8, alphabetId: 6, isCorrect: false },
    { exerciseId: 8, alphabetId: 7, isCorrect: false },
    { exerciseId: 8, alphabetId: 9, isCorrect: false },

    { exerciseId: 9, alphabetId: 9, isCorrect: true },
    { exerciseId: 9, alphabetId: 6, isCorrect: false },
    { exerciseId: 9, alphabetId: 7, isCorrect: false },
    { exerciseId: 9, alphabetId: 8, isCorrect: false },

    { exerciseId: 10, alphabetId: 10, isCorrect: true },
    { exerciseId: 10, alphabetId: 6, isCorrect: false },
    { exerciseId: 10, alphabetId: 7, isCorrect: false },
    { exerciseId: 10, alphabetId: 8, isCorrect: false },

    { exerciseId: 11, alphabetId: 11, isCorrect: true },
    { exerciseId: 11, alphabetId: 12, isCorrect: false },
    { exerciseId: 11, alphabetId: 13, isCorrect: false },
    { exerciseId: 11, alphabetId: 14, isCorrect: false },

    { exerciseId: 12, alphabetId: 12, isCorrect: true },
    { exerciseId: 12, alphabetId: 11, isCorrect: false },
    { exerciseId: 12, alphabetId: 13, isCorrect: false },
    { exerciseId: 12, alphabetId: 14, isCorrect: false },

    { exerciseId: 13, alphabetId: 13, isCorrect: true },
    { exerciseId: 13, alphabetId: 11, isCorrect: false },
    { exerciseId: 13, alphabetId: 12, isCorrect: false },
    { exerciseId: 13, alphabetId: 14, isCorrect: false },

    { exerciseId: 14, alphabetId: 14, isCorrect: true },
    { exerciseId: 14, alphabetId: 11, isCorrect: false },
    { exerciseId: 14, alphabetId: 12, isCorrect: false },
    { exerciseId: 14, alphabetId: 13, isCorrect: false },

    { exerciseId: 15, alphabetId: 15, isCorrect: true },
    { exerciseId: 15, alphabetId: 11, isCorrect: false },
    { exerciseId: 15, alphabetId: 12, isCorrect: false },
    { exerciseId: 15, alphabetId: 13, isCorrect: false },

    { exerciseId: 16, alphabetId: 16, isCorrect: true },
    { exerciseId: 16, alphabetId: 17, isCorrect: false },
    { exerciseId: 16, alphabetId: 18, isCorrect: false },
    { exerciseId: 16, alphabetId: 19, isCorrect: false },

    { exerciseId: 17, alphabetId: 17, isCorrect: true },
    { exerciseId: 17, alphabetId: 16, isCorrect: false },
    { exerciseId: 17, alphabetId: 18, isCorrect: false },
    { exerciseId: 17, alphabetId: 19, isCorrect: false },

    { exerciseId: 18, alphabetId: 18, isCorrect: true },
    { exerciseId: 18, alphabetId: 16, isCorrect: false },
    { exerciseId: 18, alphabetId: 17, isCorrect: false },
    { exerciseId: 18, alphabetId: 19, isCorrect: false },

    { exerciseId: 19, alphabetId: 19, isCorrect: true },
    { exerciseId: 19, alphabetId: 16, isCorrect: false },
    { exerciseId: 19, alphabetId: 17, isCorrect: false },
    { exerciseId: 19, alphabetId: 18, isCorrect: false },

    { exerciseId: 20, alphabetId: 20, isCorrect: true },
    { exerciseId: 20, alphabetId: 16, isCorrect: false },
    { exerciseId: 20, alphabetId: 17, isCorrect: false },
    { exerciseId: 20, alphabetId: 18, isCorrect: false },

    { exerciseId: 21, alphabetId: 21, isCorrect: true },
    { exerciseId: 21, alphabetId: 22, isCorrect: false },
    { exerciseId: 21, alphabetId: 23, isCorrect: false },
    { exerciseId: 21, alphabetId: 24, isCorrect: false },

    { exerciseId: 22, alphabetId: 22, isCorrect: true },
    { exerciseId: 22, alphabetId: 21, isCorrect: false },
    { exerciseId: 22, alphabetId: 23, isCorrect: false },
    { exerciseId: 22, alphabetId: 24, isCorrect: false },

    { exerciseId: 23, alphabetId: 23, isCorrect: true },
    { exerciseId: 23, alphabetId: 21, isCorrect: false },
    { exerciseId: 23, alphabetId: 22, isCorrect: false },
    { exerciseId: 23, alphabetId: 24, isCorrect: false },

    { exerciseId: 24, alphabetId: 24, isCorrect: true },
    { exerciseId: 24, alphabetId: 21, isCorrect: false },
    { exerciseId: 24, alphabetId: 22, isCorrect: false },
    { exerciseId: 24, alphabetId: 23, isCorrect: false },

    { exerciseId: 25, alphabetId: 25, isCorrect: true },
    { exerciseId: 25, alphabetId: 21, isCorrect: false },
    { exerciseId: 25, alphabetId: 22, isCorrect: false },
    { exerciseId: 25, alphabetId: 23, isCorrect: false },

    { exerciseId: 26, alphabetId: 26, isCorrect: true },
    { exerciseId: 26, alphabetId: 21, isCorrect: false },
    { exerciseId: 26, alphabetId: 22, isCorrect: false },
    { exerciseId: 26, alphabetId: 23, isCorrect: false },
  ];

  await prisma.exerciseOption.deleteMany();

  await prisma.exerciseOption.createMany({
    data: exerciseOptions,
    skipDuplicates: true,
  });

  console.log("Seeded exercise options");
}

async function seedFlashcards() {
  const insertedAlphabets = await prisma.alphabet.findMany();

  const flashcardsData = insertedAlphabets.map(
    (alphabet: (typeof insertedAlphabets)[number]) => ({
      alphabetId: alphabet.id,
      imageUrl: `/letters/${alphabet.letter}.jpg`,
    })
  );

  await prisma.flashcard.createMany({
    data: flashcardsData,
    skipDuplicates: true,
  });

  console.log("Seeded flashcards");
}

async function main() {
  await seedAlphabets();
  await seedLessons();
  await seedLessonAlphabets();
  await seedExercises();
  await seedExerciseOptions();
  await seedFlashcards();
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
