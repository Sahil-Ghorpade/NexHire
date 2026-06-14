import PDFDocument from "pdfkit";

/**
 * Format date as:
 * Jun 13, 2026, 2:30 PM
 */
const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Draw section heading
 */
const addSectionTitle = (doc, title) => {
  doc
    .moveDown()
    .fillColor("#0f172a")
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(title);

  doc.moveDown(0.5);
};

/**
 * Draw bullet list
 */
const addBulletList = (doc, items = []) => {
  doc
    .fillColor("#64748b")
    .font("Helvetica")
    .fontSize(10);

  if (!items.length) {
    doc.text("None");
    return;
  }

  items.forEach((item) => {
    doc.text(`• ${item}`);
  });
};

/**
 * Draw numbered list
 */
const addNumberedList = (doc, items = []) => {
  doc
    .fillColor("#64748b")
    .font("Helvetica")
    .fontSize(10);

  if (!items.length) {
    doc.text("None");
    return;
  }

  items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item}`);
  });
};

/**
 * Draw horizontal separator
 */
const addSeparator = (doc) => {
  const y = doc.y;

  doc
    .strokeColor("#e2e8f0")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();

  doc.moveDown();
};

/**
 * Generate Interview Report PDF
 */
export const generateInterviewPDF = ({
  userName,
  interview,
}) => {
  const doc = new PDFDocument({
    margin: 50,
  });

  // Title
  doc
    .fillColor("#2563eb")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("NexHire - Interview Report");

  doc.moveDown();

  // Metadata
  doc
    .fillColor("#64748b")
    .font("Helvetica")
    .fontSize(10)
    .text(`Candidate: ${userName}`)
    .text(
      `Report generated: ${formatDate(
        new Date()
      )}`
    )
    .text(
      `Interview taken: ${formatDate(
        interview.createdAt
      )}`
    );

  doc.moveDown();

  addSeparator(doc);

  /**
   * Interview Details
   */
  addSectionTitle(
    doc,
    "Interview Details"
  );

  doc
    .fillColor("#64748b")
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Type: ${interview.type}`
    )
    .text(
      `Role: ${interview.role}`
    )
    .text(
      `Difficulty: ${interview.difficulty}`
    );

  /**
   * Summary
   */
  addSectionTitle(
    doc,
    "Summary"
  );

  doc
    .fillColor("#64748b")
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Overall Score: ${interview.overallScore}/10`
    )
    .text(
      `Attempt Rate: ${interview.attemptRate}%`
    )
    .text(
      `Attempted: ${interview.attempted}`
    )
    .text(
      `Skipped: ${interview.skipped}`
    );

  /**
   * Strengths
   */
  addSectionTitle(
    doc,
    "Strengths"
  );

  addBulletList(
    doc,
    interview.strengths
  );

  /**
   * Weak Areas
   */
  addSectionTitle(
    doc,
    "Weak Areas"
  );

  addBulletList(
    doc,
    interview.weakAreas
  );

  /**
   * Recommendations
   */
  addSectionTitle(
    doc,
    "Recommendations"
  );

  addNumberedList(
    doc,
    interview.recommendations
  );

  /**
   * Question Breakdown
   */
  doc.addPage();

  addSectionTitle(
    doc,
    "Question Breakdown"
  );

  interview.questions?.forEach(
    (
      question,
      index
    ) => {
      doc
        .fillColor("#0f172a")
        .font(
          "Helvetica-Bold"
        )
        .fontSize(11)
        .text(
          `Q${index + 1}. ${
            question.question
          }`
        );

      doc
        .fillColor("#64748b")
        .font("Helvetica")
        .fontSize(10)
        .text(
          `Answer: ${
            question.answer ||
            "Skipped"
          }`
        )
        .text(
          `Score: ${question.score}/10`
        )
        .text(
          `Feedback: ${
            question.feedback
          }`
        );

      doc.moveDown();
    }
  );

  /**
   * Learning Path
   */
  addSectionTitle(
    doc,
    "Learning Path"
  );

  if (
    interview.learningPath
      ?.length
  ) {
    interview.learningPath.forEach(
      (item) => {
        doc
          .fillColor(
            "#64748b"
          )
          .fontSize(10)
          .text(
            `${item.topic} - ${item.resource}`
          );
      }
    );
  } else {
    doc.text("None");
  }

  return doc;
};

/**
 * Generate Resume Analysis PDF
 */
export const generateResumePDF = ({
  userName,
  analysis,
}) => {
  const doc = new PDFDocument({
    margin: 50,
  });

  // Title
  doc
    .fillColor("#2563eb")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(
      "NexHire - Resume Analysis Report"
    );

  doc.moveDown();

  // Metadata
  doc
    .fillColor("#64748b")
    .font("Helvetica")
    .fontSize(10)
    .text(`Candidate: ${userName}`)
    .text(
      `Report generated: ${formatDate(
        new Date()
      )}`
    )
    .text(
      `Analysis date: ${formatDate(
        analysis.createdAt
      )}`
    );

  doc.moveDown();

  addSeparator(doc);

  /**
   * Target Role
   */
  addSectionTitle(
    doc,
    "Target Role"
  );

  doc
    .fillColor("#64748b")
    .font("Helvetica")
    .fontSize(10)
    .text(analysis.role);

  /**
   * ATS Score
   */
  addSectionTitle(
    doc,
    "ATS Score"
  );

  doc
    .fillColor("#0f172a")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(
      `${analysis.atsScore}/100`
    );

  /**
   * Skills Found
   */
  addSectionTitle(
    doc,
    "Skills Found"
  );

  addBulletList(
    doc,
    analysis.skillsFound
  );

  /**
   * Missing Skills
   */
  addSectionTitle(
    doc,
    "Missing Skills"
  );

  addBulletList(
    doc,
    analysis.missingSkills
  );

  /**
   * Strengths
   */
  addSectionTitle(
    doc,
    "Strengths"
  );

  addBulletList(
    doc,
    analysis.strengths
  );

  /**
   * Weaknesses
   */
  addSectionTitle(
    doc,
    "Weaknesses"
  );

  addBulletList(
    doc,
    analysis.weaknesses
  );

  /**
   * Suggestions
   */
  addSectionTitle(
    doc,
    "Suggestions"
  );

  addNumberedList(
    doc,
    analysis.suggestions
  );

  return doc;
};