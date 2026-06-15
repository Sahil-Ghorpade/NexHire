import { GoogleGenerativeAI } from "@google/generative-ai";

import User from "../models/User.js";
import ValidRole from "../models/ValidRole.js";

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
 * Escape special regex characters
 */
const escapeRegExp = (string) => {
  return string.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

/**
 * Convert string to title case
 */
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

/**
 * Validate role using:
 * 1. User cache
 * 2. Global cache
 * 3. Gemini
 */
export const validateRole = async (
  userId,
  roleName
) => {
  // Clean input
  const cleanedRole =
    roleName?.trim();

  if (!cleanedRole) {
    throw new Error(
      "Role name is required"
    );
  }

  if (cleanedRole.length < 3) {
    return {
      valid: false,
      source: "rule",
    };
  }

  // Find user
  const user =
    await User.findById(userId);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  /**
   * Layer 1
   * User recent role cache
   */
  const existsInUserCache =
    user.recentCustomRoles.some(
      (role) =>
        role.toLowerCase() ===
        cleanedRole.toLowerCase()
    );

  if (existsInUserCache) {
    return {
      valid: true,
      source: "user-cache",
    };
  }

  /**
   * Layer 2
   * Global role cache
   */
  const escapedRole =
    escapeRegExp(cleanedRole);

  const existingRole =
    await ValidRole.findOne({
      role: {
        $regex: new RegExp(
          `^${escapedRole}$`,
          "i"
        ),
      },
    });

  if (existingRole) {
    const alreadyExists =
      user.recentCustomRoles.some(
        (role) =>
          role.toLowerCase() ===
          existingRole.role.toLowerCase()
      );

    if (!alreadyExists) {
      user.recentCustomRoles.push(
        existingRole.role
      );

      await user.save();
    }

    return {
      valid: true,
      source: "global-cache",
    };
  }

  /**
   * Layer 3
   * Gemini validation
   */
  const prompt = `
You are a job title validation expert for an AI interview preparation platform. Determine whether a given job title is a commonly recognized professional role that people apply for on job portals. Validate the input job title "${cleanedRole}" against a list of known professional job titles, such as Software Engineer, Data Scientist, or Marketing Manager. Avoid considering non-professional or humorous titles like Banana Seller or Super Hero. Structure your response as a simple "YES" or "NO" indicating whether the job title is valid.
  `;

  let response;

  try {
    const result =
      await model.generateContent(
        prompt
      );

    response =
      result.response
        .text()
        .trim()
        .toUpperCase();

    // existing logic
  } catch (error) {
    console.error(
      "Role validation error:",
      error
    );

    throw new Error(
      "Unable to validate role at the moment. Please try again."
    );
  }

  if (response.includes("YES")) {
    const normalizedRole =
      toTitleCase(cleanedRole);

    /**
     * Save globally
     * Safe against duplicate key errors
     */
    await ValidRole.findOneAndUpdate(
      {
        role: normalizedRole,
      },
      {
        role: normalizedRole,
      },
      {
        upsert: true,
        new: true,
      }
    );

    /**
     * Save to user cache
     */
    const alreadyExists =
      user.recentCustomRoles.some(
        (role) =>
          role.toLowerCase() ===
          normalizedRole.toLowerCase()
      );

    if (!alreadyExists) {
      user.recentCustomRoles.push(
        normalizedRole
      );

      await user.save();
    }

    return {
      valid: true,
      source: "gemini",
    };
  }

  return {
    valid: false,
    source: "gemini",
  };
};