import { asyncHandler } from '../errors.js';
import { generateSubtasks } from '../services/ai.js';

/**
 * POST /api/subtasks
 * Body: { projectTitle: string }
 * Returns: { steps: string[], projectTitle: string }
 */
export const generate = asyncHandler(async (req, res) => {
  const { projectTitle } = req.body ?? {};
  const result = await generateSubtasks(projectTitle);
  res.json(result);
});
