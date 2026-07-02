/**
 * @openapi
 * /auth/:
 *   get:
 *     summary: Authentication
 *     description: >
 *       Authentication routes
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: params
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: overview successful
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Market overview not found.
 */
