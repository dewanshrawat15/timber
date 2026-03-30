import { Router, type Request, type Response } from 'express';
import dashboard from '../schemas/dashboard.json';
import gallery from '../schemas/gallery.json';
import cardList from '../schemas/cardList.json';
import modal from '../schemas/modal.json';
import bottomSheet from '../schemas/bottomSheet.json';
import settings from '../schemas/settings.json';
import profile from '../schemas/profile.json';
import dataTable from '../schemas/dataTable.json';
import formPage from '../schemas/formPage.json';
import feedbackPage from '../schemas/feedbackPage.json';

const router = Router();

const SCREEN_MAP: Record<string, unknown> = {
  // Original screens
  dashboard,
  gallery,
  'card-list': cardList,
  modal,
  'bottom-sheet': bottomSheet,
  // New screens
  settings,
  profile,
  'data-table': dataTable,
  'form-page': formPage,
  'feedback-page': feedbackPage,
};

const VALID_SCREENS = Object.keys(SCREEN_MAP);

/**
 * @openapi
 * /api/details:
 *   get:
 *     summary: Fetch a Timber schema for a given screen
 *     tags:
 *       - Timber
 *     parameters:
 *       - in: query
 *         name: screen
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dashboard, gallery, card-list, modal, bottom-sheet, settings, profile, data-table, form-page, feedback-page]
 *         description: The screen/layout type to render
 *       - in: query
 *         name: navId
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional navigation identifier for deep-linking to a specific item
 *     responses:
 *       200:
 *         description: A valid TimberSchema object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimberSchema'
 *       400:
 *         description: Unknown or missing screen parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req: Request, res: Response) => {
  const { screen, navId } = req.query as { screen?: string; navId?: string };

  if (!screen) {
    res.status(400).json({
      error: 'Missing required query parameter: screen',
      validScreens: VALID_SCREENS,
    });
    return;
  }

  const schema = SCREEN_MAP[screen];

  if (!schema) {
    res.status(400).json({
      error: `Unknown screen: "${screen}". Valid values are: ${VALID_SCREENS.join(', ')}.`,
      validScreens: VALID_SCREENS,
    });
    return;
  }

  res.json({ ...schema as object, navId: navId ?? null });
});

export default router;
