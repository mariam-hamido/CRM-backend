/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List my notifications
 *     description: Returns the paginated notifications of the authenticated user. Only the user's own notifications are returned.
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortByQuery'
 *       - $ref: '#/components/parameters/SortOrderQuery'
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [system, task, meeting, customer, lead, deal, reminder, success, warning, error]
 *         description: Filter by notification type
 *       - name: isRead
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - name: entityType
 *         in: query
 *         schema:
 *           type: string
 *           enum: [customer, lead, deal, task, meeting, note, attachment, user, company]
 *         description: Filter by related entity type
 *       - name: entityId
 *         in: query
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the related entity
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
 * /api/notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count
 *     description: Returns the number of unread notifications for the authenticated user.
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
 * /api/notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get a notification
 *     description: Returns a single notification by ID. Only the owner can retrieve it.
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
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     description: Marks a single notification as read and records the readAt timestamp.
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
 * /api/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     description: Marks all notifications of the authenticated user as read.
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
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     description: Permanently deletes a notification. Only the owner can delete it.
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
