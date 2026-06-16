import pdfParse from "pdf-parse-debugging-disabled";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

import ResumeAnalysis from "../models/ResumeAnalysis.js";

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
 * Parse Gemini JSON response
 */
const parseGeminiJson = (text) => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

/**
 * Analyze resume and generate ATS report
 */
export const analyzeResumeService = async ({
  userId,
  role,
  fileBuffer,
  mimeType,
}) => {
  let extractedText = "";

   /**
   * File Size Validation (5 MB)
   */
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (!fileBuffer || fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(
      "File size exceeds the maximum limit of 5 MB."
    );
  }

  /**
   * Extract text from PDF
   */
  if (
    mimeType ===
    "application/pdf"
  ) {
    const pdfData =
      await pdfParse(fileBuffer);

    extractedText =
      pdfData.text;
  }

  /**
   * Extract text from DOCX
   */
  else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const docxData =
      await mammoth.extractRawText({
        buffer: fileBuffer,
      });

    extractedText =
      docxData.value;
  }

  /**
   * Unsupported file
   */
  else {
    throw new Error(
      "Unsupported file type. Please upload PDF or DOCX."
    );
  }

  extractedText =
    extractedText?.trim();

  if (!extractedText) {
    throw new Error(
      "Could not extract text from the file."
    );
  }

  /**
   * Prevent huge inputs
   */
  const resumeText =
    extractedText.slice(
      0,
      10000
    );

  /**
   * Step 1:
   * Validate resume
   */
  const validationPrompt = `
Does the following text appear to be a professional resume or CV containing information such as personal details, education, work experience, projects, skills, certifications, or achievements?

Answer ONLY YES or NO.

Resume Text:

${resumeText}
`;

  const validationResult =
    await model.generateContent(
      validationPrompt
    );

  const validationResponse =
    validationResult.response
      .text()
      .trim()
      .toUpperCase();

  if (
    !validationResponse.includes(
      "YES"
    )
  ) {
    throw new Error(
      "The uploaded file does not appear to be a valid resume."
    );
  }

  /**
   * Step 2:
   * ATS Analysis
   */
  const analysisPrompt = `
You are an expert ATS (Applicant Tracking System) evaluator.

Analyze the following resume for the role of ${role}.

Return ONLY valid JSON in this exact format.

No markdown.
No explanation.

{
  "atsScore": number,
  "skillsFound": [string],
  "missingSkills": [string],
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string]
}

Resume text:

${resumeText}
`;

  let analysis;

  try {
    const analysisResult =
      await model.generateContent(
        analysisPrompt
      );

    const response =
      analysisResult.response.text();

    analysis =
      parseGeminiJson(
        response
      );
  } catch (error) {
    throw new Error(
      "Failed to parse ATS analysis response"
    );

    throw new Error(
      "Resume analysis service is temporarily unavailable. Please try again later,"
    );
  }

  /**
  * Normalize ATS score
  */

   analysis.atsScore = Math.max(
        0,
        Math.min(
            100,
            Number(
            analysis.atsScore || 0
            )
        )
    );

  /**
   * Save analysis
   */
  const savedAnalysis =
    await ResumeAnalysis.create({
      userId,
      role,

      atsScore:
        analysis.atsScore,

      skillsFound:
        analysis.skillsFound ||
        [],

      missingSkills:
        analysis.missingSkills ||
        [],

      strengths:
        analysis.strengths ||
        [],

      weaknesses:
        analysis.weaknesses ||
        [],

      suggestions:
        analysis.suggestions ||
        [],
    });

  return savedAnalysis;
};