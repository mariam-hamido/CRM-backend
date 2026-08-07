/**
 * @openapi
 * /api/dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard overview
 *     description: Returns summary cards (customers, leads, deals, pipeline value, tasks, meetings) for the current user's company.
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
 * /api/dashboard/pipeline:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get pipeline grouped by stage
 *     description: Returns open deals grouped by pipeline stage with count and total value.
 *     parameters:
 *       - name: pipelineId
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline to filter by (optional)
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
 * /api/dashboard/sales:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get sales statistics
 *     description: Returns monthly revenue, won/lost deals and conversion rate. Defaults to the current calendar month.
 *     parameters:
 *       - name: from
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of the period (ISO date)
 *       - name: to
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of the period (ISO date)
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
 * /api/dashboard/tasks:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get task statistics
 *     description: Returns completed, pending, overdue and due-today task counts.
 *     parameters:
 *       - name: assignedTo
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the assignee to filter by (optional)
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
 * /api/dashboard/meetings:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get meeting statistics
 *     description: Returns scheduled meeting counts for today, this week and this month.
 *     parameters:
 *       - name: organizer
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the organizer to filter by (optional)
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
 * /api/dashboard/recent-activities:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent activities
 *     description: Returns the 10 most recent audit log entries for the current user's company.
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/Success'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
