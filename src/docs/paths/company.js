/**
 * @openapi
 * /api/companies/me:
 *   get:
 *     tags: [Companies]
 *     summary: Get the current company
 *     description: Returns the company the authenticated user belongs to. Available to all authenticated roles.
 *     responses:
 *       '200':
 *         description: Company fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Company fetched successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *   patch:
 *     tags: [Companies]
 *     summary: Update the current company
 *     description: Updates the company the authenticated user belongs to. Only users with the admin role can update the company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Acme Inc.
 *               logo:
 *                 type: string
 *                 example: https://cdn.example.com/logos/acme.png
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
 *               status:
 *                 type: string
 *                 enum: [trial, active, suspended, cancelled]
 *                 example: active
 *               timezone:
 *                 type: string
 *                 example: America/New_York
 *               currency:
 *                 type: string
 *                 example: USD
 *     responses:
 *       '200':
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Company updated successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *
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
