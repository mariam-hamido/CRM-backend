const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CRM Backend API",
    version: "1.0.0",
    description:
      "Interactive documentation for the multi-tenant CRM backend. " +
      "All endpoints except Authentication (register/login) require a Bearer JWT token. " +
      "Click the Authorize button, paste a token obtained from POST /api/auth/login, and " +
      "the token is automatically sent on every request.",
    contact: {
      name: "CRM Backend Team",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current server (API and docs served from the same origin)",
    },
  ],
  tags: [
    { name: "Authentication", description: "Register, login and current user" },
    { name: "Companies", description: "Tenant company management" },
    { name: "Customers", description: "Customer records" },
    { name: "Customer Contacts", description: "Contacts belonging to customers" },
    { name: "Leads", description: "Lead management and conversion" },
    { name: "Pipelines", description: "Sales pipelines" },
    { name: "Pipeline Stages", description: "Stages within a pipeline" },
    { name: "Deals", description: "Deals / opportunities" },
    { name: "Tasks", description: "Follow-up tasks" },
    { name: "Meetings", description: "Meetings and appointments" },
    { name: "Notes", description: "Notes attached to entities" },
    { name: "Attachments", description: "File uploads and downloads" },
    { name: "Notifications", description: "User notifications" },
    { name: "Activities", description: "Audit log (read-only)" },
    { name: "Dashboard", description: "Aggregated analytics" },
    { name: "Reports", description: "Statistics and CSV exports" },
    { name: "Search", description: "Global multi-entity search" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token returned by POST /api/auth/login",
      },
    },
    parameters: {
      IdPath: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "MongoDB ObjectId of the resource",
      },
      SearchQuery: {
        name: "search",
        in: "query",
        schema: { type: "string" },
        description: "Case-insensitive search term",
      },
      PageQuery: {
        name: "page",
        in: "query",
        schema: { type: "integer", minimum: 1 },
        description: "Page number (default 1)",
      },
      LimitQuery: {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100 },
        description: "Results per page (default 10, max 100)",
      },
      SortByQuery: {
        name: "sortBy",
        in: "query",
        schema: { type: "string" },
        description: "Field to sort by (default createdAt)",
      },
      SortOrderQuery: {
        name: "sortOrder",
        in: "query",
        schema: { type: "string", enum: ["asc", "desc"] },
        description: "Sort direction (default desc)",
      },
      StartDateQuery: {
        name: "startDate",
        in: "query",
        schema: { type: "string", format: "date-time" },
        description: "Start of the date range (ISO date)",
      },
      EndDateQuery: {
        name: "endDate",
        in: "query",
        schema: { type: "string", format: "date-time" },
        description: "End of the date range (ISO date)",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation completed successfully" },
          data: {
            oneOf: [
              { type: "object" },
              { type: "array", items: { type: "object" } },
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
            ],
            nullable: true,
            example: null,
          },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "A valid email is required" },
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
          firstName: { type: "string", example: "Jane" },
          lastName: { type: "string", example: "Smith" },
          email: { type: "string", format: "email", example: "jane.smith@example.com" },
          role: { type: "string", enum: ["admin", "manager", "sales"], example: "sales" },
          company: { type: "string", example: "60d21b4667d0d8992e610c86" },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Company: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c86" },
          name: { type: "string", example: "Acme Inc." },
          logo: { type: "string", example: "https://cdn.example.com/logos/acme.png" },
          industry: { type: "string", example: "Technology" },
          website: { type: "string", example: "https://acme.com" },
          phone: { type: "string", example: "+1-555-0100" },
          email: { type: "string", format: "email", example: "info@acme.com" },
          country: { type: "string", example: "United States" },
          city: { type: "string", example: "New York" },
          address: { type: "string", example: "1 Main Street" },
          subscriptionPlan: {
            type: "string",
            enum: ["free", "starter", "professional", "enterprise"],
            example: "professional",
          },
          status: {
            type: "string",
            enum: ["trial", "active", "suspended", "cancelled"],
            example: "active",
          },
          timezone: { type: "string", example: "America/New_York" },
          currency: { type: "string", example: "USD" },
          createdBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Customer: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c87" },
          companyName: { type: "string", example: "Globex Corp" },
          industry: { type: "string", example: "Retail" },
          website: { type: "string", example: "https://globex.com" },
          email: { type: "string", format: "email", example: "contact@globex.com" },
          phone: { type: "string", example: "+1-555-0130" },
          country: { type: "string", example: "Canada" },
          city: { type: "string", example: "Toronto" },
          address: { type: "string", example: "10 King Street" },
          status: { type: "string", enum: ["active", "inactive", "prospect"], example: "active" },
          source: {
            type: "string",
            enum: ["website", "referral", "social_media", "cold_call", "email", "advertisement", "other"],
            example: "referral",
          },
          annualRevenue: { type: "number", example: 2500000 },
          employeesCount: { type: "number", example: 120 },
          owner: { type: "string", example: "60d21b4667d0d8992e610c85" },
          company: { type: "string", example: "60d21b4667d0d8992e610c86" },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CustomerContact: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c88" },
          customer: { type: "string", example: "60d21b4667d0d8992e610c87" },
          firstName: { type: "string", example: "Alice" },
          lastName: { type: "string", example: "Johnson" },
          fullName: { type: "string", example: "Alice Johnson" },
          jobTitle: { type: "string", example: "Procurement Manager" },
          email: { type: "string", format: "email", example: "alice@globex.com" },
          phone: { type: "string", example: "+1-555-0131" },
          isPrimary: { type: "boolean", example: true },
          company: { type: "string", example: "60d21b4667d0d8992e610c86" },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Lead: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c89" },
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          fullName: { type: "string", example: "John Doe" },
          companyName: { type: "string", example: "Initech" },
          email: { type: "string", format: "email", example: "john.doe@initech.com" },
          phone: { type: "string", example: "+1-555-0140" },
          status: {
            type: "string",
            enum: ["new", "contacted", "qualified", "proposal_sent", "negotiation", "converted", "lost"],
            example: "qualified",
          },
          source: {
            type: "string",
            enum: ["website", "referral", "social_media", "cold_call", "email", "advertisement", "event", "other"],
            example: "website",
          },
          score: { type: "number", example: 75 },
          estimatedValue: { type: "number", example: 50000 },
          notes: { type: "string", example: "Interested in the enterprise plan" },
          owner: { type: "string", example: "60d21b4667d0d8992e610c85" },
          convertedCustomer: { type: "string", nullable: true, example: "60d21b4667d0d8992e610c87" },
          convertedAt: { type: "string", format: "date-time", nullable: true },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Pipeline: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c90" },
          name: { type: "string", example: "Default Pipeline" },
          description: { type: "string", example: "Main sales pipeline" },
          color: { type: "string", example: "#3B82F6" },
          isDefault: { type: "boolean", example: true },
          isActive: { type: "boolean", example: true },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PipelineStage: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c91" },
          pipeline: { type: "string", example: "60d21b4667d0d8992e610c90" },
          name: { type: "string", example: "Qualified" },
          description: { type: "string", example: "Qualified prospects" },
          order: { type: "number", example: 2 },
          color: { type: "string", example: "#10B981" },
          probability: { type: "number", example: 40 },
          isWonStage: { type: "boolean", example: false },
          isLostStage: { type: "boolean", example: false },
          isActive: { type: "boolean", example: true },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Deal: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c92" },
          title: { type: "string", example: "Globex - Enterprise License" },
          value: { type: "number", example: 120000 },
          probability: { type: "number", example: 60 },
          expectedCloseDate: { type: "string", format: "date-time", nullable: true },
          actualCloseDate: { type: "string", format: "date-time", nullable: true },
          status: { type: "string", enum: ["open", "won", "lost"], example: "open" },
          lostReason: { type: "string", nullable: true, example: null },
          description: { type: "string", example: "Annual license renewal" },
          customer: { type: "string", example: "60d21b4667d0d8992e610c87" },
          owner: { type: "string", example: "60d21b4667d0d8992e610c85" },
          pipeline: { type: "string", example: "60d21b4667d0d8992e610c90" },
          stage: { type: "string", example: "60d21b4667d0d8992e610c91" },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Task: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c93" },
          title: { type: "string", example: "Follow up with Globex" },
          description: { type: "string", example: "Send the proposal follow-up email" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"], example: "high" },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed", "cancelled", "overdue"],
            example: "pending",
          },
          dueDate: { type: "string", format: "date-time", example: "2026-08-15T10:00:00.000Z" },
          reminderDate: { type: "string", format: "date-time", nullable: true },
          completedAt: { type: "string", format: "date-time", nullable: true },
          assignedTo: { type: "string", example: "60d21b4667d0d8992e610c85" },
          createdBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
          customer: { type: "string", nullable: true, example: "60d21b4667d0d8992e610c87" },
          deal: { type: "string", nullable: true, example: null },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Meeting: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c94" },
          title: { type: "string", example: "Discovery call" },
          description: { type: "string", example: "Initial discovery with Globex" },
          meetingDate: { type: "string", format: "date-time", example: "2026-08-12T14:00:00.000Z" },
          duration: { type: "number", example: 60 },
          meetingType: { type: "string", enum: ["in_person", "phone", "video"], example: "video" },
          location: { type: "string", example: "Zoom" },
          meetingLink: { type: "string", nullable: true, example: "https://zoom.us/j/123" },
          status: { type: "string", enum: ["scheduled", "completed", "cancelled", "no_show"], example: "scheduled" },
          notes: { type: "string", example: "Bring the pricing sheet" },
          customer: { type: "string", example: "60d21b4667d0d8992e610c87" },
          organizer: { type: "string", example: "60d21b4667d0d8992e610c85" },
          deal: { type: "string", nullable: true, example: "60d21b4667d0d8992e610c92" },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Note: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c95" },
          content: { type: "string", example: "Customer prefers email communication" },
          isPinned: { type: "boolean", example: false },
          createdBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
          customer: { type: "string", nullable: true, example: "60d21b4667d0d8992e610c87" },
          lead: { type: "string", nullable: true, example: null },
          deal: { type: "string", nullable: true, example: null },
          task: { type: "string", nullable: true, example: null },
          meeting: { type: "string", nullable: true, example: null },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Attachment: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c96" },
          fileName: { type: "string", example: "a1b2c3d4.pdf" },
          originalFileName: { type: "string", example: "proposal.pdf" },
          fileUrl: { type: "string", example: "/uploads/deals/a1b2c3d4.pdf" },
          mimeType: { type: "string", example: "application/pdf" },
          fileSize: { type: "number", example: 20480 },
          storageProvider: { type: "string", enum: ["local", "cloudinary", "s3"], example: "local" },
          customer: { type: "string", nullable: true, example: null },
          lead: { type: "string", nullable: true, example: null },
          deal: { type: "string", nullable: true, example: "60d21b4667d0d8992e610c92" },
          task: { type: "string", nullable: true, example: null },
          meeting: { type: "string", nullable: true, example: null },
          note: { type: "string", nullable: true, example: null },
          uploadedBy: { type: "string", example: "60d21b4667d0d8992e610c85" },
          company: { type: "string", example: "60d21b4667d0d8992e610c86" },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c97" },
          title: { type: "string", example: "New task assigned" },
          message: { type: "string", example: "You have been assigned a new task" },
          type: {
            type: "string",
            enum: ["system", "task", "meeting", "customer", "lead", "deal", "reminder", "success", "warning", "error"],
            example: "task",
          },
          entityType: {
            type: "string",
            enum: ["customer", "lead", "deal", "task", "meeting", "note", "attachment", "user", "company"],
            nullable: true,
            example: "task",
          },
          entityId: { type: "string", nullable: true, example: "60d21b4667d0d8992e610c93" },
          actionUrl: { type: "string", nullable: true, example: "/tasks/60d21b4667d0d8992e610c93" },
          isRead: { type: "boolean", example: false },
          readAt: { type: "string", format: "date-time", nullable: true },
          expiresAt: { type: "string", format: "date-time", nullable: true },
          user: { type: "string", example: "60d21b4667d0d8992e610c85" },
          company: { type: "string", example: "60d21b4667d0d8992e610c86" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Activity: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60d21b4667d0d8992e610c98" },
          entityType: {
            type: "string",
            enum: ["company", "user", "customer", "customer_contact", "lead", "pipeline", "pipeline_stage", "deal", "task", "meeting", "note", "attachment"],
            example: "deal",
          },
          entityId: { type: "string", example: "60d21b4667d0d8992e610c92" },
          action: {
            type: "string",
            enum: ["create", "update", "delete", "restore", "assign", "unassign", "convert", "move_stage", "login", "logout", "upload", "download"],
            example: "move_stage",
          },
          description: { type: "string", example: "Deal moved to Qualified" },
          oldValues: { type: "object", nullable: true },
          newValues: { type: "object", nullable: true },
          metadata: { type: "object" },
          ipAddress: { type: "string", nullable: true, example: "192.168.1.10" },
          userAgent: { type: "string", nullable: true },
          isSystem: { type: "boolean", example: false },
          user: { type: "string", example: "60d21b4667d0d8992e610c85" },
          company: { type: "string", example: "60d21b4667d0d8992e610c86" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          total: { type: "integer", example: 42 },
          totalPages: { type: "integer", example: 5 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
        },
      },
    },
    responses: {
      Success: {
        description: "Success",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: true,
              message: "Fetched successfully",
              data: null,
            },
          },
        },
      },
      Created: {
        description: "Created",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: true,
              message: "Created successfully",
              data: null,
            },
          },
        },
      },
      BadRequest: {
        description: "Bad request - invalid parameters or validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationError" },
            example: {
              success: false,
              message: "Validation failed",
              errors: [
                { field: "email", message: "A valid email is required" },
              ],
            },
          },
        },
      },
      Unauthorized: {
        description: "Unauthorized - missing or invalid JWT token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              message: "No token provided",
              data: null,
            },
          },
        },
      },
      Forbidden: {
        description: "Forbidden - the user does not have permission",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              message: "You do not have permission to access this resource",
              data: null,
            },
          },
        },
      },
      NotFound: {
        description: "Not found - the resource does not exist in this company",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              message: "Resource not found",
              data: null,
            },
          },
        },
      },
      Conflict: {
        description: "Conflict - the request conflicts with the current state",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              message: "Resource already exists",
              data: null,
            },
          },
        },
      },
      UnprocessableEntity: {
        description: "Unprocessable entity - valid request, but cannot be processed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              message: "Operation cannot be processed",
              data: null,
            },
          },
        },
      },
      InternalServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              message: "Internal server error",
              data: null,
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/docs/paths/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerDefinition, options };
