import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quiz = await prisma.quiz.findFirst({
      include: {
        questions: {
          orderBy: { order_number: "asc" },
          include: { answers: true },
        },
      },
    });

    if (!quiz) {
      return Response.json({ error: "Quiz not found" }, { status: 404 });
    }

    return Response.json({
      quiz_name: quiz.title,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.question_text,
        options: q.answers.map(a => a.answer_text),
        correct_answer: q.answers.find(a => a.is_correct)?.answer_text,
      })),
    });

  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}