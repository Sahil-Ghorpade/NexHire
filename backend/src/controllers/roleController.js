import { validateRole } from "../services/roleService.js";

/**
 * Validate a custom role
 */
export const validateRoleController = async (
  req,
  res
) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({
        success: false,
        message:
          "Role name is required",
      });
    }

    const {
      valid,
      source,
    } = await validateRole(
      req.user._id,
      roleName
    );

    return res.status(200).json({
      success: true,
      valid,
      source,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};