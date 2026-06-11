import { Router } from 'express';
import { analyzeSymptomsMvp } from '../controllers/symptom.controller';

const router = Router();

/**
 * @openapi
 * /api/symptoms/analyze-mvp:
 *   post:
 *     summary: Analyze symptoms using Gemini AI (MVP Stage 1)
 *     tags: [Symptoms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - age
 *               - temperature
 *               - duration
 *             properties:
 *               age:
 *                 type: string
 *                 enum: [child, teenager, adult, elderly]
 *               temperature:
 *                 type: string
 *                 enum: [no_fever, subfebrile, high, critical]
 *               duration:
 *                 type: string
 *                 enum: [less_24h, 1_3_days, week_plus]
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI analysis and recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disclaimer:
 *                   type: string
 *                 analysis:
 *                   type: string
 *                 textRecommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isCritical:
 *                   type: boolean
 *       500:
 *         description: Server error
 */
router.post('/analyze-mvp', analyzeSymptomsMvp);

export default router;
