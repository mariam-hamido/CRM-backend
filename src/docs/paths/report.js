/**
 * @openapi
 * /api/reports/customers:
 *   get:
 *     tags: [Reports]
 *     summary: Customer report
 *     description: Returns customer statistics (totals, top sources, growth by month) for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [active, inactive, prospect]
 *         description: Filter by customer status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
 *       - name: pipelineStage
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline stage (only applies to the deals report)
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

/**
 * @openapi
 * /api/reports/leads:
 *   get:
 *     tags: [Reports]
 *     summary: Lead report
 *     description: Returns lead statistics including conversion percentage for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [new, contacted, qualified, proposal_sent, negotiation, converted, lost]
 *         description: Filter by lead status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
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

/**
 * @openapi
 * /api/reports/deals:
 *   get:
 *     tags: [Reports]
 *     summary: Deal report
 *     description: Returns deal statistics (pipeline value, won revenue, average deal size) for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [open, won, lost]
 *         description: Filter by deal status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
 *       - name: pipelineStage
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline stage
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

/**
 * @openapi
 * /api/reports/tasks:
 *   get:
 *     tags: [Reports]
 *     summary: Task report
 *     description: Returns task statistics including completion percentage for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled, overdue]
 *         description: Filter by task status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the assignee
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

/**
 * @openapi
 * /api/reports/meetings:
 *   get:
 *     tags: [Reports]
 *     summary: Meeting report
 *     description: Returns meeting statistics (today, week, month, completed, cancelled) for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no_show]
 *         description: Filter by meeting status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the organizer
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

/**
 * @openapi
 * /api/reports/export/customers:
 *   get:
 *     tags: [Reports]
 *     summary: Export customers to CSV
 *     description: Streams a downloadable CSV of customers for the current user's company. Respects the same filters as the customers report.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [active, inactive, prospect]
 *         description: Filter by customer status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
 *     responses:
 *       '200':
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *             example: "Company Name,Industry,Email\nAcme Inc,Technology,info@acme.com\n"
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/reports/export/leads:
 *   get:
 *     tags: [Reports]
 *     summary: Export leads to CSV
 *     description: Streams a downloadable CSV of leads for the current user's company. Respects the same filters as the leads report.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [new, contacted, qualified, proposal_sent, negotiation, converted, lost]
 *         description: Filter by lead status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
 *     responses:
 *       '200':
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/reports/export/deals:
 *   get:
 *     tags: [Reports]
 *     summary: Export deals to CSV
 *     description: Streams a downloadable CSV of deals for the current user's company. Respects the same filters as the deals report.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [open, won, lost]
 *         description: Filter by deal status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the owning user
 *       - name: pipelineStage
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline stage
 *     responses:
 *       '200':
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/reports/export/tasks:
 *   get:
 *     tags: [Reports]
 *     summary: Export tasks to CSV
 *     description: Streams a downloadable CSV of tasks for the current user's company. Respects the same filters as the tasks report.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled, overdue]
 *         description: Filter by task status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the assignee
 *     responses:
 *       '200':
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/reports/export/meetings:
 *   get:
 *     tags: [Reports]
 *     summary: Export meetings to CSV
 *     description: Streams a downloadable CSV of meetings for the current user's company. Respects the same filters as the meetings report.
 *     parameters:
 *       - $ref: '#/components/parameters/StartDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no_show]
 *         description: Filter by meeting status
 *       - name: owner
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the organizer
 *     responses:
 *       '200':
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
