/**
 * @openapi
 * /api/company-employees:
 *   get:
 *     tags: [Company Employees]
 *     summary: List the admin's company employees
 *     description: >
 *       Requires an authenticated company admin. Returns all users belonging
 *       to the authenticated admin's company EXCEPT the admin themself.
 *       Co-admins are listed (with their role) but can never be removed.
 *       Inactive members remain listed so removals stay visible. Cross-company
 *       data is never returned; companyId is not accepted as a parameter -
 *       the tenant scope is always derived from the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Optional membership-status filter
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, email, role, isActive, createdAt]
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       '200':
 *         description: Employees fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     employees:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CompanyEmployee'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /api/company-employees/{id}/remove:
 *   patch:
 *     tags: [Company Employees]
 *     summary: Soft-remove an employee by deactivating their account
 *     description: >
 *       Requires an authenticated company admin. Sets the target user's
 *       isActive to false. The User is NEVER hard-deleted - historical CRM
 *       records keep their owner references and remain auditable. Email,
 *       company and role are untouched. The deactivated user immediately
 *       loses login access and any existing JWT stops working on the next
 *       authenticated request (the middleware reloads the user from the
 *       database). Protections: admins cannot remove themselves, cannot
 *       remove another company admin, and cannot touch users of another
 *       company (foreign ids resolve to 404). Removing an already-inactive
 *       employee returns a conflict instead of duplicating the transition.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee (User) id belonging to the admin's own company
 *     responses:
 *       '200':
 *         description: Employee removed (deactivated) successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Employee removed successfully
 *                 data:
 *                   $ref: '#/components/schemas/CompanyEmployee'
 *       '400':
 *         description: Malformed id or self-removal attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         description: Not an admin, or target is a company admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       '404':
 *         description: Employee not found in the admin's own company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       '409':
 *         description: Employee is already inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
