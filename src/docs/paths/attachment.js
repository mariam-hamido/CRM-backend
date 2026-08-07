/**
 * @openapi
 * /api/attachments:
 *   post:
 *     tags: [Attachments]
 *     summary: Upload an attachment
 *     description: "Uploads a file (multipart/form-data) linked to exactly one entity (customer, lead, deal, task, meeting or note). Maximum file size 20 MB. Allowed types: jpg, jpeg, png, webp, svg, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, zip."
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
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
 *               note:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *             description: Exactly one entity reference (customer, lead, deal, task, meeting or note) is required.
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
 * /api/attachments:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments
 *     description: Returns a paginated, searchable list of attachments for the current user's company.
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
 *       - name: note
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the note
 *       - name: uploadedBy
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the uploader
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
 * /api/attachments/customer/{customerId}:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments for a customer
 *     description: Returns attachments linked to a specific customer, scoped to the current user's company.
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
 * /api/attachments/lead/{leadId}:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments for a lead
 *     description: Returns attachments linked to a specific lead, scoped to the current user's company.
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
 * /api/attachments/deal/{dealId}:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments for a deal
 *     description: Returns attachments linked to a specific deal, scoped to the current user's company.
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
 * /api/attachments/task/{taskId}:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments for a task
 *     description: Returns attachments linked to a specific task, scoped to the current user's company.
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
 * /api/attachments/meeting/{meetingId}:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments for a meeting
 *     description: Returns attachments linked to a specific meeting, scoped to the current user's company.
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
 * /api/attachments/note/{noteId}:
 *   get:
 *     tags: [Attachments]
 *     summary: List attachments for a note
 *     description: Returns attachments linked to a specific note, scoped to the current user's company.
 *     parameters:
 *       - name: noteId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the note
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
 * /api/attachments/{id}:
 *   get:
 *     tags: [Attachments]
 *     summary: Get an attachment
 *     description: Returns attachment metadata by ID, scoped to the current user's company.
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
 * /api/attachments/{id}/download:
 *   get:
 *     tags: [Attachments]
 *     summary: Download an attachment
 *     description: Streams the file to the client. Ownership is verified against the current user's company before the file is sent.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: The file is streamed with Content-Disposition attachment
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/attachments/{id}:
 *   delete:
 *     tags: [Attachments]
 *     summary: Delete an attachment
 *     description: Soft-deletes the record and removes the physical file from disk. Sales users can only delete files they uploaded.
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
