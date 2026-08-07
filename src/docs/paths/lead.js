/**
 * @openapi
 * /api/leads:
 *   post:
 *     tags: [Leads]
 *     summary: Create a lead
 *     description: Creates a new lead for the current user's company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               companyName:
 *                 type: string
 *                 example: Initech
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@initech.com
 *               phone:
 *                 type: string
 *                 example: +1-555-0140
 *               status:
 *                 type: string
 *                 enum: [new, contacted, qualified, proposal_sent, negotiation, converted, lost]
 *                 example: new
 *               source:
 *                 type: string
 *                 enum: [website, referral, social_media, cold_call, email, advertisement, event, other]
 *                 example: website
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 60
 *               estimatedValue:
 *                 type: number
 *                 minimum: 0
 *                 example: 50000
 *               notes:
 *                 type: string
 *                 example: Interested in the enterprise plan
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
 * /api/leads:
 *   get:
 *     tags: [Leads]
 *     summary: List leads
 *     description: Returns a paginated, searchable list of leads for the current user's company.
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
 *           enum: [new, contacted, qualified, proposal_sent, negotiation, converted, lost]
 *         description: Filter by lead status
 *       - name: source
 *         in: query
 *         schema:
 *           type: string
 *           enum: [website, referral, social_media, cold_call, email, advertisement, event, other]
 *         description: Filter by lead source
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
 * /api/leads/{id}:
 *   get:
 *     tags: [Leads]
 *     summary: Get a lead
 *     description: Returns a single lead by ID, scoped to the current user's company.
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
 * /api/leads/{id}:
 *   put:
 *     tags: [Leads]
 *     summary: Update a lead
 *     description: Updates an existing lead record.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [new, contacted, qualified, proposal_sent, negotiation, converted, lost]
 *               source:
 *                 type: string
 *                 enum: [website, referral, social_media, cold_call, email, advertisement, event, other]
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               estimatedValue:
 *                 type: number
 *                 minimum: 0
 *               notes:
 *                 type: string
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
 * /api/leads/{id}:
 *   delete:
 *     tags: [Leads]
 *     summary: Delete a lead
 *     description: Soft-deletes a lead record.
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

/**
 * @openapi
 * /api/leads/{id}/convert:
 *   patch:
 *     tags: [Leads]
 *     summary: Convert a lead to a customer
 *     description: Converts the lead into a customer. Creates a customer and links the lead to it.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
