/**
 * @openapi
 * /api/pipelines:
 *   post:
 *     tags: [Pipelines]
 *     summary: Create a pipeline
 *     description: Creates a new sales pipeline for the current user's company.
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
 *                 maxLength: 100
 *                 example: Default Pipeline
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Main sales pipeline
 *               color:
 *                 type: string
 *                 example: "#3B82F6"
 *               isDefault:
 *                 type: boolean
 *                 example: true
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
 * /api/pipelines:
 *   get:
 *     tags: [Pipelines]
 *     summary: List pipelines
 *     description: Returns the pipelines for the current user's company.
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - name: isDefault
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filter by default pipeline flag
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
 * /api/pipelines/{id}:
 *   get:
 *     tags: [Pipelines]
 *     summary: Get a pipeline
 *     description: Returns a single pipeline by ID, scoped to the current user's company.
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
 * /api/pipelines/{id}:
 *   put:
 *     tags: [Pipelines]
 *     summary: Update a pipeline
 *     description: Updates an existing pipeline.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Pipeline
 *               description:
 *                 type: string
 *               color:
 *                 type: string
 *               isDefault:
 *                 type: boolean
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
 * /api/pipelines/{id}:
 *   delete:
 *     tags: [Pipelines]
 *     summary: Delete a pipeline
 *     description: Soft-deletes a pipeline.
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
