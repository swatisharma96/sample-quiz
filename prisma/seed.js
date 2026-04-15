const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clean old data (safe reset)
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  // Create quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "General Knowledge Quiz",
    },
  });

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

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const question = await prisma.question.create({
      data: {
        quiz_id: quiz.id,
        question_text: q.text,
        order_number: i + 1,
      },
    });

    for (const a of q.answers) {
      await prisma.answer.create({
        data: {
          question_id: question.id,
          answer_text: a.text,
          is_correct: a.correct,
        },
      });
    }
  }

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