/**
 * @openapi
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Global search
 *     description: Searches across Customers, Leads, Deals, Tasks, Meetings and Notes simultaneously and returns grouped results. Case-insensitive, scoped to the current user's company.
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         description: Search query (minimum 2, maximum 100 characters)
 *         example: john
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
