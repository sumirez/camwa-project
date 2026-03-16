const module = {
    "/module/create": {
      post: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Create a new module (Admin only)",
        responses: {
          200: { description: "Module created successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  moduleName: { type: "string", description: "Name of the module" },
                  description: { type: "string", description: "Description of the module" },
                },
                required: ["moduleName"],
              },
            },
          },
        },
      },
    },
  
    "/module/{moduleId}": {
      put: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Update a module (Admin/Faculty Assistant)",
        parameters: [
          {
            name: "moduleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the module to update",
          },
        ],
        responses: {
          200: { description: "Module updated successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  moduleName: { type: "string", description: "Updated name of the module" },
                  description: { type: "string", description: "Updated description of the module" },
                },
              },
            },
          },
        },
      },
      delete: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Delete a module (Admin only)",
        parameters: [
          {
            name: "moduleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the module to delete",
          },
        ],
        responses: {
          200: { description: "Module deleted successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },
  
    "/module/{intakeModuleId}/assign-lecturer": {
      put: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Assign a lecturer to an intake module (Faculty Assistant only)",
        parameters: [
          {
            name: "intakeModuleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the intake module",
          },
        ],
        responses: {
          200: { description: "Lecturer assigned to intake module successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  lecturerId: { type: "string", description: "ID of the lecturer" },
                },
                required: ["lecturerId"],
              },
            },
          },
        },
      },
    },
  
    "/module/{intakeModuleId}/assign-students": {
      put: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Assign students to an intake module (Faculty Assistant only)",
        parameters: [
          {
            name: "intakeModuleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the intake module",
          },
        ],
        responses: {
          200: { description: "Students assigned to intake module successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  studentIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of student IDs to assign",
                  },
                },
                required: ["studentIds"],
              },
            },
          },
        },
      },
    },
  
    "/module/{intakeModuleId}/classes": {
      post: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Create classes for an intake module (Faculty Assistant only)",
        parameters: [
          {
            name: "intakeModuleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the intake module",
          },
        ],
        responses: {
          200: { description: "Classes created for intake module successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  classData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        className: { type: "string", description: "Name of the class" },
                        schedule: { type: "string", description: "Schedule for the class" },
                      },
                    },
                  },
                },
                required: ["classData"],
              },
            },
          },
        },
      },
    },
  
    "/module/{intakeModuleId}/export-report": {
      get: {
        security: [{ BearerAuth: [] }],
        tags: ["Module"],
        summary: "Export report for an intake module (Faculty Assistant only)",
        parameters: [
          {
            name: "intakeModuleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the intake module",
          },
        ],
        responses: {
          200: { description: "Report exported successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },
  };
  
  export default module;
