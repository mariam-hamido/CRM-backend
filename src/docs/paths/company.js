/**
 * @openapi
 * /api/companies:
 *   post:
 *     tags: [Companies]
 *     summary: Create a company
 *     description: Creates a new tenant company. Only users with the admin role can create companies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Acme Inc.
 *               industry:
 *                 type: string
 *                 example: Technology
 *               website:
 *                 type: string
 *                 example: https://acme.com
 *               phone:
 *                 type: string
 *                 example: +1-555-0100
 *               email:
 *                 type: string
 *                 format: email
 *                 example: info@acme.com
 *               country:
 *                 type: string
 *                 example: United States
 *               city:
 *                 type: string
 *                 example: New York
 *               address:
 *                 type: string
 *                 example: 1 Main Street
 *               subscriptionPlan:
 *                 type: string
 *                 enum: [free, starter, professional, enterprise]
 *                 example: professional
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/Created'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
