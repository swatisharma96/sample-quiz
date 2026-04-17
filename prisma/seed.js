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
      title: "General Knowledge Quiz",
    },
  });

  console.log("🧠 Created quiz:", quiz.title);

  // 3. Question data
  const questions = [
    {
      text: "What is the capital of California?",
      answers: [
        { text: "Los Angeles", correct: false },
        { text: "San Diego", correct: false },
        { text: "Sacramento", correct: true },
        { text: "San Francisco", correct: false },
      ],
    },
    {
      text: "Which planet is known as the Red Planet?",
      answers: [
        { text: "Earth", correct: false },
        { text: "Mars", correct: true },
        { text: "Jupiter", correct: false },
        { text: "Venus", correct: false },
      ],
    },
    {
      text: "How many continents are there?",
      answers: [
        { text: "5", correct: false },
        { text: "6", correct: false },
        { text: "7", correct: true },
        { text: "8", correct: false },
      ],
    },
    {
      text: "Which ocean is the largest?",
      answers: [
        { text: "Atlantic", correct: false },
        { text: "Indian", correct: false },
        { text: "Pacific", correct: true },
        { text: "Arctic", correct: false },
      ],
    },
    {
      text: "What is 10 + 10?",
      answers: [
        { text: "10", correct: false },
        { text: "15", correct: false },
        { text: "20", correct: true },
        { text: "25", correct: false },
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