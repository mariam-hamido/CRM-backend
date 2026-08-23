/**
 * @openapi
 * /api/company-invitations:
 *   post:
 *     tags: [Company Invitations]
 *     summary: Invite an employee email
 *     description: >
 *       Approves an email for future employee first-registration with the
 *       authenticated admin's company. Only company admins can create
 *       invitations. The target company and the inviting admin are derived
 *       from the authenticated user - clients cannot choose them.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: New.Hire@Example.com
 *                 description: Stored and matched normalized (trimmed, lowercased)
 *     responses:
 *       '201':
 *         description: Invitation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Invitation created successfully }
 *                 data:
 *                   $ref: '#/components/schemas/CompanyInvitation'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     tags: [Company Invitations]
 *     summary: List invitations for the current company
 *     description: >
 *       Returns the authenticated admin's company invitations only.
 *       Company-admin only; the company is derived from the authenticated user.
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, accepted, removed]
 *         description: Filter by invitation status
 *       - name: page
 *         in: query
 *         required: false
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - name: limit
 *         in: query
 *         required: false
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema: { type: string, enum: [email, status, createdAt], default: createdAt }
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       '200':
 *         description: Invitations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Invitations fetched successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     invitations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CompanyInvitation'
 *                     pagination: { $ref: '#/components/schemas/Pagination' }
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/company-invitations/{id}:
 *   delete:
 *     tags: [Company Invitations]
 *     summary: Remove a pending invitation
 *     description: >
 *       Soft-removes a pending invitation of the authenticated admin's company
 *       (status becomes "removed"; the record stays auditable). A removed
 *       email can be invited again later. Company-admin only.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       '200':
 *         description: Invitation removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Invitation removed successfully }
 *                 data:
 *                   $ref: '#/components/schemas/CompanyInvitation'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
