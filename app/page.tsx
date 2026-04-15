"use client";

import { useEffect, useState } from "react";

type Quiz = {
  quiz_name: string;
  questions: {
    id: number;
    text: string;
    options: string[];
    correct_answer: string;
  }[];
};

export default function Home() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then(setQuiz);
  }, []);

  if (!quiz) {
    return (
      <div className="container">
        <p>Loading quiz...</p>
      </div>
    );
  }

  const q = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  const submitAnswer = () => {
    if (!selected) return;

    setSubmitted(true);

    if (selected === q.correct_answer) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    setIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  };

  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSubmitted(false);
    setShowResults(false);
  };

  // Results Page
  if (showResults) {
    const percent = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="container center">
        <h1>{quiz.quiz_name}</h1>

        <div className="divider" />

        <p className="score">
          You scored <strong>{score}</strong> out of{" "}
          {quiz.questions.length}
        </p>

        <p className="percent">{percent}%</p>

        <div className="actions">
          <button className="btn" onClick={restartQuiz}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Quiz Title */}
      <div className="header">
        <h1>{quiz.quiz_name}</h1>
      </div>

      {/* Progress */}
      <div className="progress-text">
        Question {index + 1} of {quiz.questions.length}
      </div>

      <div className="divider" />

      {/* Question */}
      <h2 className="question">
        Question {index + 1}: {q.text}
      </h2>

      {/* Answer Options */}
      <div className="options">
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;

          let className = "option";
          if (submitted) {
            if (opt === q.correct_answer) className += " correct";
            else if (isSelected && opt !== q.correct_answer)
              className += " wrong";
          } else if (isSelected) {
            className += " selected";
          }

          return (
            <button
              key={opt}
              className={className}
              onClick={() => !submitted && setSelected(opt)}
            >
              <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div className="feedback">
          {selected === q.correct_answer ? (
            <p className="correct-text">Correct!</p>
          ) : (
            <>
              <p className="wrong-text">Not quite</p>
              <p>Correct answer: {q.correct_answer}</p>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="actions">
        {!submitted && (
          <button
            className="btn"
            onClick={submitAnswer}
            disabled={!selected}
          >
            Submit Answer
          </button>
        )}

        {submitted && !isLast && (
          <button className="btn" onClick={nextQuestion}>
            Next Question →
          </button>
        )}

        {submitted && isLast && (
          <button
            className="btn"
            onClick={() => setShowResults(true)}
          >
            See My Results
          </button>
        )}
      </div>
    </div>
  );
}