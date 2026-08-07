/**
 * @openapi
 * /api/activities:
 *   get:
 *     tags: [Activities]
 *     summary: List activities
 *     description: Returns a paginated, searchable audit log for the current user's company. Read-only.
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortByQuery'
 *       - $ref: '#/components/parameters/SortOrderQuery'
 *       - name: entityType
 *         in: query
 *         schema:
 *           type: string
 *           enum: [company, user, customer, customer_contact, lead, pipeline, pipeline_stage, deal, task, meeting, note, attachment]
 *         description: Filter by entity type
 *       - name: entityId
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the entity
 *       - name: action
 *         in: query
 *         schema:
 *           type: string
 *           enum: [create, update, delete, restore, assign, unassign, convert, move_stage, login, logout, upload, download]
 *         description: Filter by action
 *       - name: user
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the acting user
 *       - name: isSystem
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filter by system-generated flag
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
 * /api/activities/entity/{entityType}/{entityId}:
 *   get:
 *     tags: [Activities]
 *     summary: List activities for an entity
 *     description: Returns the audit log entries for a specific entity, scoped to the current user's company.
 *     parameters:
 *       - name: entityType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [company, user, customer, customer_contact, lead, pipeline, pipeline_stage, deal, task, meeting, note, attachment]
 *         description: Type of the entity
 *       - name: entityId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the entity
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
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
 * /api/activities/{id}:
 *   get:
 *     tags: [Activities]
 *     summary: Get an activity
 *     description: Returns a single audit log entry by ID, scoped to the current user's company.
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
