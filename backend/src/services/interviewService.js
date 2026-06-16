import { GoogleGenerativeAI } from "@google/generative-ai";

import Interview from "../models/Interview.js";

/**
 * Gemini Setup
 */
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/**
 * Parse Gemini JSON responses
 */
const parseGeminiJson = (text) => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

/**
 * Generate interview questions
 */
export const generateQuestionsService =
  async ({
    userId,
    type,
    role,
    difficulty,
    count,
  }) => {
    const prompt = `
Generate exactly ${count} interview questions for a ${difficulty} level ${type} interview for the role of ${role}.

Return ONLY a valid JSON array of strings.

No explanation.
No markdown.
No code blocks.

Example format:

["Question 1", "Question 2"]
`;

    try {
      const result =
        await model.generateContent(
          prompt
        );

      const response =
        result.response.text();

      const questions =
        parseGeminiJson(
          response
        );

      const isValid =
        Array.isArray(
          questions
        ) &&
        questions.length ===
          count &&
        questions.every(
          (question) =>
            typeof question ===
            "string"
        );

      if (!isValid) {
        throw new Error();
      }

      return questions;
    } catch (error) {
      throw new Error(
        "Failed to generate valid questions"
      );
    }
  };

/**
 * Evaluate completed interview
 */
export const evaluateInterviewService =
  async ({
    userId,
    type,
    role,
    difficulty,
    questions,
  }) => {
    const formattedQuestions =
      questions
        .map(
          (
            item,
            index
          ) => `
Q${index + 1}: ${
            item.question
          }
A${index + 1}: ${
            item.answer ??
            "SKIPPED"
          }
`
        )
        .join("\n");

    const prompt = `
You are an expert interview evaluator.

Evaluate the following ${type} interview for the role of ${role} at ${difficulty} difficulty.

${formattedQuestions}

For each question:

- If answered: give a score from 0 to 10 and provide constructive feedback.

- If SKIPPED: give a score of 0 and provide the ideal answer as feedback so the candidate can learn.

Also provide:

- Overall strengths (array of strings)

- Overall weak areas (array of strings)

- Recommendations for improvement (array of strings)

- Learning path: array of objects with "topic" and "resource"

Resource URLs must ONLY come from (Avoid giving invalid URLs):

youtube.com
roadmap.sh
developer.mozilla.org
react.dev
nodejs.org
docs.python.org

Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "score": number,
      "feedback": string
    }
  ],
  "strengths": [string],
  "weakAreas": [string],
  "recommendations": [string],
  "learningPath": [
    {
      "topic": string,
      "resource": string
    }
  ]
}
`;

    let evaluation;

    try {
      const result =
        await model.generateContent(
          prompt
        );

      const response =
        result.response.text();

      evaluation =
        parseGeminiJson(
          response
        );
    } catch (error) {
      throw new Error(
        "Failed to parse evaluation response"
      );
    }

    const totalQuestions =
      questions.length;

    const attempted =
      questions.filter(
        (question) =>
          question.answer !==
            null &&
          question.answer.trim() !==
            ""
      ).length;

    const skipped =
      totalQuestions -
      attempted;

    const attemptRate =
      Number(
        (
          (attempted /
            totalQuestions) *
          100
        ).toFixed(1)
      );

    const totalScore =
      evaluation.questions.reduce(
        (
          sum,
          question
        ) =>
          sum +
          (question.score || 0),
        0
      );

    const overallScore =
      Number(
        (
          totalScore /
          totalQuestions
        ).toFixed(1)
      );

    const mergedQuestions =
      questions.map(
        (
          question,
          index
        ) => ({
          question:
            question.question,

          answer:
            question.answer,

          score:
            evaluation
              .questions[
              index
            ]?.score ?? 0,

          feedback:
            evaluation
              .questions[
              index
            ]?.feedback ??
            "No feedback available",
        })
      );

    const interview =
      await Interview.create({
        userId,

        type,
        role,
        difficulty,

        totalQuestions,

        attempted,
        skipped,
        attemptRate,
        overallScore,

        questions:
          mergedQuestions,

        strengths:
          evaluation
            .strengths || [],

        weakAreas:
          evaluation
            .weakAreas || [],

        recommendations:
          evaluation
            .recommendations ||
          [],

        learningPath:
          evaluation
            .learningPath ||
          [],
      });

    return interview;
  };