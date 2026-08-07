/**
 * @openapi
 * /api/meetings:
 *   post:
 *     tags: [Meetings]
 *     summary: Create a meeting
 *     description: Creates a new meeting for the current user's company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, customer, meetingDate]
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Discovery call
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Initial discovery with Globex
 *               customer:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c87
 *               deal:
 *                 type: string
 *                 nullable: true
 *                 example: 60d21b4667d0d8992e610c92
 *               meetingDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-12T14:00:00.000Z
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 60
 *               meetingType:
 *                 type: string
 *                 enum: [in_person, phone, video]
 *                 example: video
 *               location:
 *                 type: string
 *                 example: Zoom
 *               meetingLink:
 *                 type: string
 *                 nullable: true
 *                 example: https://zoom.us/j/123
 *               notes:
 *                 type: string
 *                 example: Bring the pricing sheet
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
 * /api/meetings:
 *   get:
 *     tags: [Meetings]
 *     summary: List meetings
 *     description: Returns a paginated, searchable list of meetings for the current user's company.
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
 *           enum: [scheduled, completed, cancelled, no_show]
 *         description: Filter by meeting status
 *       - name: meetingType
 *         in: query
 *         schema:
 *           type: string
 *           enum: [in_person, phone, video]
 *         description: Filter by meeting type
 *       - name: organizer
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the organizer
 *       - name: customer
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the customer
 *       - name: deal
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the deal
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
 * /api/meetings/{id}:
 *   get:
 *     tags: [Meetings]
 *     summary: Get a meeting
 *     description: Returns a single meeting by ID, scoped to the current user's company.
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
 * /api/meetings/{id}:
 *   put:
 *     tags: [Meetings]
 *     summary: Update a meeting
 *     description: Updates an existing meeting record.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               meetingDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *               meetingType:
 *                 type: string
 *                 enum: [in_person, phone, video]
 *               location:
 *                 type: string
 *               meetingLink:
 *                 type: string
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
 * /api/meetings/{id}:
 *   delete:
 *     tags: [Meetings]
 *     summary: Delete a meeting
 *     description: Soft-deletes a meeting record.
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
 * /api/meetings/{id}/complete:
 *   patch:
 *     tags: [Meetings]
 *     summary: Mark a meeting as completed
 *     description: Marks the meeting as completed.
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
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/meetings/{id}/cancel:
 *   patch:
 *     tags: [Meetings]
 *     summary: Cancel a meeting
 *     description: Marks the meeting as cancelled.
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
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
