/**
 * @openapi
 * /api/pipeline-stages:
 *   post:
 *     tags: [Pipeline Stages]
 *     summary: Create a pipeline stage
 *     description: Creates a new stage within a pipeline for the current user's company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pipeline, name, order]
 *             properties:
 *               pipeline:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c90
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Qualified
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Qualified prospects
 *               order:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               color:
 *                 type: string
 *                 example: "#10B981"
 *               probability:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 40
 *               isWonStage:
 *                 type: boolean
 *                 example: false
 *               isLostStage:
 *                 type: boolean
 *                 example: false
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
 * /api/pipeline-stages:
 *   get:
 *     tags: [Pipeline Stages]
 *     summary: List pipeline stages
 *     description: Returns the stages for the current user's company, sorted by order.
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - name: pipeline
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline
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
 * /api/pipeline-stages/pipeline/{pipelineId}:
 *   get:
 *     tags: [Pipeline Stages]
 *     summary: List stages for a pipeline
 *     description: Returns the stages belonging to a specific pipeline, scoped to the current user's company.
 *     parameters:
 *       - name: pipelineId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the pipeline
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
 * /api/pipeline-stages/{id}:
 *   get:
 *     tags: [Pipeline Stages]
 *     summary: Get a pipeline stage
 *     description: Returns a single stage by ID, scoped to the current user's company.
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
 * /api/pipeline-stages/{id}:
 *   put:
 *     tags: [Pipeline Stages]
 *     summary: Update a pipeline stage
 *     description: Updates an existing stage. The linked pipeline cannot be changed.
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
 *               description:
 *                 type: string
 *               order:
 *                 type: integer
 *                 minimum: 1
 *               color:
 *                 type: string
 *               probability:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               isWonStage:
 *                 type: boolean
 *               isLostStage:
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
 * /api/pipeline-stages/{id}:
 *   delete:
 *     tags: [Pipeline Stages]
 *     summary: Delete a pipeline stage
 *     description: Soft-deletes a stage.
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
