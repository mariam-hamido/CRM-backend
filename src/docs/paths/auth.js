/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Creates a new user. Public endpoint - no authentication required.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, company]
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, number and special character
 *                 example: Passw0rd!
 *               company:
 *                 type: string
 *                 description: MongoDB ObjectId of the company the user belongs to
 *                 example: 60d21b4667d0d8992e610c86
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/Created'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/auth/register/employee:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new employee via admin invitation
 *     description: >
 *       First registration for invited employees. Requires the company NAME and
 *       an email that a company admin has pre-approved with a pending invitation.
 *       The company, role (sales) and active status are derived server-side;
 *       clients cannot supply company ids or roles. Public endpoint.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName, firstName, lastName, email, password]
 *             properties:
 *               companyName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Acme Inc.
 *                 description: Matched against the company's normalized identity (case/whitespace-insensitive)
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *                 description: Must match a pending invitation of the resolved company (normalized comparison)
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, number and special character
 *                 example: Passw0rd!
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/Created'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in and obtain a JWT token
 *     description: Validates credentials and returns a JWT bearer token. Public endpoint - no authentication required.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Passw0rd!
 *     responses:
 *       '200':
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user
 *     description: Returns the authenticated user's profile. Protected endpoint.
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
