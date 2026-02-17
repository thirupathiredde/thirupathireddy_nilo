import { asyncHandler } from '../errors.js';
import { simplifyToBionic } from '../services/ai.js';

/**
 * POST /api/simplify
 * Body: { text: string, summarizeFirst?: boolean }
 * Returns: { bionicWords, bionicText, originalLength, bionicLength, summarized }
 */
export const simplify = asyncHandler(async (req, res) => {
  const { text, summarizeFirst = false } = req.body ?? {};
  const result = await simplifyToBionic(text, { summarizeFirst });
  res.json(result);
});
