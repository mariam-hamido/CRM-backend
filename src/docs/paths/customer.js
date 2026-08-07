/**
 * @openapi
 * /api/customers:
 *   post:
 *     tags: [Customers]
 *     summary: Create a customer
 *     description: Creates a new customer record for the current user's company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName]
 *             properties:
 *               companyName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Globex Corp
 *               industry:
 *                 type: string
 *                 example: Retail
 *               website:
 *                 type: string
 *                 example: https://globex.com
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contact@globex.com
 *               phone:
 *                 type: string
 *                 example: +1-555-0130
 *               country:
 *                 type: string
 *                 example: Canada
 *               city:
 *                 type: string
 *                 example: Toronto
 *               address:
 *                 type: string
 *                 example: 10 King Street
 *               status:
 *                 type: string
 *                 enum: [active, inactive, prospect]
 *                 example: active
 *               source:
 *                 type: string
 *                 enum: [website, referral, social_media, cold_call, email, advertisement, other]
 *                 example: referral
 *               annualRevenue:
 *                 type: number
 *                 minimum: 0
 *                 example: 2500000
 *               employeesCount:
 *                 type: integer
 *                 minimum: 0
 *                 example: 120
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/Created'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: List customers
 *     description: Returns a paginated, searchable list of customers for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortByQuery'
 *       - $ref: '#/components/parameters/SortOrderQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [active, inactive, prospect]
 *         description: Filter by customer status
 *       - name: source
 *         in: query
 *         schema:
 *           type: string
 *           enum: [website, referral, social_media, cold_call, email, advertisement, other]
 *         description: Filter by customer source
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get a customer
 *     description: Returns a single customer by ID, scoped to the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/customers/{id}:
 *   put:
 *     tags: [Customers]
 *     summary: Update a customer
 *     description: Updates an existing customer record. Only editable fields are updated.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: Globex Corp
 *               industry:
 *                 type: string
 *                 example: Retail
 *               website:
 *                 type: string
 *                 example: https://globex.com
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, prospect]
 *               source:
 *                 type: string
 *                 enum: [website, referral, social_media, cold_call, email, advertisement, other]
 *               annualRevenue:
 *                 type: number
 *                 minimum: 0
 *               employeesCount:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Delete a customer
 *     description: Soft-deletes a customer record (isDeleted set to true).
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
