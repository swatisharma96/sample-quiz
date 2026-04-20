const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Check if DB already has data
  const existingQuiz = await prisma.quiz.findFirst({
    include: {
      questions: true,
    },
  });

  if (existingQuiz && existingQuiz.questions.length > 0) {
    console.log("✅ Database already seeded. Skipping...");
    return;
  }

  // 2. Create quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "Recycling and Waste Management Quiz",
    },
  });

  console.log("🧠 Created quiz:", quiz.title);

  // 3. Question data
  const questions = [
    {
      text: "What does the number under the bottom of plastic bottles mean?",
      answers: [
        { text: "Where the bottle ends up going", correct: true },
        { text: "How many times the item has been recycled", correct: false },
        { text: "The number of chemicals used to create the bottle", correct: false },
        { text: "The resale value of the bottle", correct: false },
      ],
    },
    {
      text: "Where can Hudson County residents drop off household hazardous waste like paint or batteries?",
      answers: [
        { text: "Any curbside bin", correct: false },
        { text: "HCIA facility in Secaucus", correct: true },
        { text: "Regular trash pickup", correct: false },
        { text: "A nearby park", correct: false },
      ],
    },
    {
      text: "Which of these is NOT accepted curbside in most Hudson County municipalities?",
      answers: [
        { text: "Cardboard boxes", correct: true },
        { text: "Plastic bottles (#1 & #2)", correct: false },
        { text: "Plastic bags", correct: false },
        { text: "Aluminum cans", correct: false },
      ],
    },
  ];

  // 4. Insert questions + answers
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const question = await prisma.question.create({
      data: {
        quiz_id: quiz.id,
        question_text: q.text,
        order_number: i + 1,
      },
    });

    await prisma.answer.createMany({
      data: q.answers.map((a) => ({
        question_id: question.id,
        answer_text: a.text,
        is_correct: a.correct,
      })),
    });
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });