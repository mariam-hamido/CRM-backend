/**
 * @openapi
 * /api/deals:
 *   post:
 *     tags: [Deals]
 *     summary: Create a deal
 *     description: Creates a new deal linked to a customer and a pipeline stage.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customer, pipeline, stage, title]
 *             properties:
 *               customer:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c87
 *               pipeline:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c90
 *               stage:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c91
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Globex - Enterprise License
 *               value:
 *                 type: number
 *                 minimum: 0
 *                 example: 120000
 *               probability:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 60
 *               expectedCloseDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T00:00:00.000Z
 *               description:
 *                 type: string
 *                 example: Annual license renewal
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
 * /api/deals:
 *   get:
 *     tags: [Deals]
 *     summary: List deals
 *     description: Returns a paginated, searchable list of deals for the current user's company.
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
 *           enum: [open, won, lost]
 *         description: Filter by deal status
 *       - name: customer
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the customer
 *       - name: pipeline
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline
 *       - name: stage
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the stage
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
 * /api/deals/{id}:
 *   get:
 *     tags: [Deals]
 *     summary: Get a deal
 *     description: Returns a single deal by ID, scoped to the current user's company.
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
 * /api/deals/{id}:
 *   put:
 *     tags: [Deals]
 *     summary: Update a deal
 *     description: Updates an existing deal record.
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
 *               value:
 *                 type: number
 *                 minimum: 0
 *               probability:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               expectedCloseDate:
 *                 type: string
 *                 format: date-time
 *               description:
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
 * /api/deals/{id}:
 *   delete:
 *     tags: [Deals]
 *     summary: Delete a deal
 *     description: Soft-deletes a deal record.
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
 * /api/deals/{id}/stage:
 *   patch:
 *     tags: [Deals]
 *     summary: Move a deal to a different stage
 *     description: Moves the deal to the given pipeline stage within the same pipeline.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stage]
 *             properties:
 *               stage:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c91
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
 * /api/deals/{id}/won:
 *   patch:
 *     tags: [Deals]
 *     summary: Mark a deal as won
 *     description: Marks the deal as won and sets the actual close date to now.
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
 * /api/deals/{id}/lost:
 *   patch:
 *     tags: [Deals]
 *     summary: Mark a deal as lost
 *     description: Marks the deal as lost, optionally recording the reason.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lostReason:
 *                 type: string
 *                 maxLength: 500
 *                 example: Budget not approved
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
