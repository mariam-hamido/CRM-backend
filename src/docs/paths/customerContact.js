/**
 * @openapi
 * /api/customer-contacts:
 *   post:
 *     tags: [Customer Contacts]
 *     summary: Create a customer contact
 *     description: Creates a new contact linked to an existing customer in the current user's company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customer, firstName, lastName]
 *             properties:
 *               customer:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c87
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Johnson
 *               jobTitle:
 *                 type: string
 *                 example: Procurement Manager
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@globex.com
 *               phone:
 *                 type: string
 *                 example: +1-555-0131
 *               isPrimary:
 *                 type: boolean
 *                 example: true
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
 * /api/customer-contacts:
 *   get:
 *     tags: [Customer Contacts]
 *     summary: List customer contacts
 *     description: Returns a paginated, searchable list of contacts for the current user's company.
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
 *       - name: isPrimary
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Filter by primary contact flag
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
 * /api/customer-contacts/customer/{customerId}:
 *   get:
 *     tags: [Customer Contacts]
 *     summary: List contacts for a customer
 *     description: Returns contacts belonging to a specific customer, scoped to the current user's company.
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
 * /api/customer-contacts/{id}:
 *   get:
 *     tags: [Customer Contacts]
 *     summary: Get a customer contact
 *     description: Returns a single contact by ID, scoped to the current user's company.
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
 * /api/customer-contacts/{id}:
 *   put:
 *     tags: [Customer Contacts]
 *     summary: Update a customer contact
 *     description: Updates an existing contact. The linked customer cannot be changed.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Johnson
 *               jobTitle:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               isPrimary:
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
 * /api/customer-contacts/{id}:
 *   delete:
 *     tags: [Customer Contacts]
 *     summary: Delete a customer contact
 *     description: Soft-deletes a contact record.
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
