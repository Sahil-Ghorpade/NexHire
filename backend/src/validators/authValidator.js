import {
  body,
  validationResult,
} from "express-validator";

/**
 * Disposable email domains to block
 */
const blockedDomains = [
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwam.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "sharklasers.com",
  "maildrop.cc",
];

/**
 * Signup validation rules
 */
export const signupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Name must be between 2 and 50 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom((email) => {
      const domain = email
        .split("@")[1]
        ?.toLowerCase();

      if (
        blockedDomains.includes(domain)
      ) {
        throw new Error(
          "Temporary email addresses are not allowed"
        );
      }

      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long"
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain at least one uppercase letter"
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one digit"
    )
    .matches(
      /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/
    )
    .withMessage(
      "Password must contain at least one special character"
    ),
];

/**
 * Validation result handler
 */
export const validate = (
  req,
  res,
  next
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};