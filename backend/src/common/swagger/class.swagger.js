const classAPI = {
    "/class/create": {
      post: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "Create a new class",
        responses: {
          200: { description: "Class created successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",                properties: {
                  className: { type: "string", description: "Name of the class" },
                  moduleId: { type: "string", description: "Module ID associated with the class" },
                },
                required: ["className", "moduleId"],
              },
            },
          },
        },
      },
    },
  
    "/class/{classId}": {
      put: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "Update a class",
        parameters: [
          {
            name: "classId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the class to update",
          },
        ],
        responses: {
          200: { description: "Class updated successfully" },
          401: { description: "Unauthorized" },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  className: { type: "string", description: "Updated class name" },
                },
                required: ["className"],
              },
            },
          },
        },
      },
      delete: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "Delete a class",
        parameters: [
          {
            name: "classId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the class to delete",
          },
        ],
        responses: {
          200: { description: "Class deleted successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },
  
    "/class/lecturer/{lecturerId}": {
      get: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "View classes for a lecturer",
        parameters: [
          {
            name: "lecturerId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the lecturer",
          },
        ],
        responses: {
          200: { description: "List of classes for the lecturer" },
          401: { description: "Unauthorized" },
        },
      },
    },
  
    "/class/student/{studentId}": {
      get: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "View classes for a student",
        parameters: [
          {
            name: "studentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the student",
          },
        ],
        responses: {
          200: { description: "List of classes for the student" },
          401: { description: "Unauthorized" },
        },
      },
    },
  
    "/class/intake-module/{moduleId}": {
      get: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "View classes for an intake module",
        parameters: [
          {
            name: "moduleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the intake module",
          },
        ],
        responses: {
          200: { description: "List of classes for the intake module" },
          401: { description: "Unauthorized" },
        },
      },
    },
  
    "/class/attendance/{classId}": {
      get: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "View student attendance for a class",
        parameters: [
          {
            name: "classId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the class",
          },
        ],
        responses: {
          200: { description: "Attendance records for the class" },
          401: { description: "Unauthorized" },
        },
      },
    },
  
    "/class/attendance-rate/{moduleId}": {
      get: {
        security: [{ BearerAuth: [] }],
        tags: ["Class"],
        summary: "View attendance rate for an intake module",
        parameters: [
          {
            name: "moduleId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the intake module",
          },
        ],
        responses: {
          200: { description: "Attendance rate for the intake module" },
          401: { description: "Unauthorized" },
        },
      },
    },
  };
  
  export default classAPI;
  