/**
 * @openapi
 * /api/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Create a note
 *     description: Creates a note linked to exactly one entity (customer, lead, deal, task or meeting).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 5000
 *                 example: Customer prefers email communication
 *               isPinned:
 *                 type: boolean
 *                 example: false
 *               customer:
 *                 type: string
 *                 nullable: true
 *                 example: 60d21b4667d0d8992e610c87
 *               lead:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               deal:
 *                 type: string
 *                 nullable: true
 *                 example: 60d21b4667d0d8992e610c92
 *               task:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               meeting:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *             description: Exactly one entity reference (customer, lead, deal, task or meeting) is required.
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/Created'
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
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     summary: List notes
 *     description: Returns a paginated, searchable list of notes for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortByQuery'
 *       - $ref: '#/components/parameters/SortOrderQuery'
 *       - name: customer
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the customer
 *       - name: lead
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lead
 *       - name: deal
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the deal
 *       - name: task
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *       - name: meeting
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the meeting
 *       - name: createdBy
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the creator
 *       - name: isPinned
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filter by pinned flag
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
 * /api/notes/customer/{customerId}:
 *   get:
 *     tags: [Notes]
 *     summary: List notes for a customer
 *     description: Returns notes attached to a specific customer, scoped to the current user's company.
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the customer
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
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
 * /api/notes/lead/{leadId}:
 *   get:
 *     tags: [Notes]
 *     summary: List notes for a lead
 *     description: Returns notes attached to a specific lead, scoped to the current user's company.
 *     parameters:
 *       - name: leadId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lead
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
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
 * /api/notes/deal/{dealId}:
 *   get:
 *     tags: [Notes]
 *     summary: List notes for a deal
 *     description: Returns notes attached to a specific deal, scoped to the current user's company.
 *     parameters:
 *       - name: dealId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the deal
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
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
 * /api/notes/task/{taskId}:
 *   get:
 *     tags: [Notes]
 *     summary: List notes for a task
 *     description: Returns notes attached to a specific task, scoped to the current user's company.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
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
 * /api/notes/meeting/{meetingId}:
 *   get:
 *     tags: [Notes]
 *     summary: List notes for a meeting
 *     description: Returns notes attached to a specific meeting, scoped to the current user's company.
 *     parameters:
 *       - name: meetingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the meeting
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
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
 * /api/notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Get a note
 *     description: Returns a single note by ID, scoped to the current user's company.
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
 * /api/notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Update a note
 *     description: Updates the content and pinned status of a note. The linked entity cannot be changed.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated note content
 *               isPinned:
 *                 type: boolean
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
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
 * /api/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Delete a note
 *     description: Soft-deletes a note record.
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
