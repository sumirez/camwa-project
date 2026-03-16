// Student API Swagger Documentation
const studentAPI = {
  "/student/{student_id}/modules-with-attendance": {
    get: {
      security: [{ BearerAuth: [] }],
      tags: ["Student"],
      summary: "Get student's registered modules with attendance rates",
      description: "Retrieve all registered modules for a specific student with calculated attendance rates for each module",
      parameters: [
        {
          name: "student_id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID of the student",
        },
      ],
      responses: {
        200: {
          description: "Student modules with attendance rates retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  code: { type: "number", example: 200 },
                  message: { type: "string", example: "Student modules with attendance rates retrieved successfully" },
                  metaData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        module_reg_id: { type: "number", example: 1 },
                        module_id: { type: "string", example: "MOD001" },
                        module_name: { type: "string", example: "Software Engineering" },
                        lecturer_id: { type: "string", example: "LEC001" },
                        program_id: { type: "string", example: "PROG001" },
                        intake: { type: "number", example: 2024 },
                        semester_id: { type: "string", example: "SEM001" },
                        attendance_rate: { type: "number", example: 85.5 },
                        total_classes: { type: "number", example: 20 },
                        attended_classes: { type: "number", example: 17 },
                        registration_date: { type: "string", format: "date-time" }
                      }
                    }
                  },
                  doc: { type: "string", example: "https://api.example.com/docs" }
                }
              }
            }
          }
        },
        403: { description: "Forbidden - Students can only view their own modules" },
        500: { description: "Internal server error" },
      },
    },
  },

  "/student/my/modules-with-attendance": {
    get: {
      security: [{ BearerAuth: [] }],
      tags: ["Student"],
      summary: "Get my registered modules with attendance rates (Student only)",
      description: "Retrieve all registered modules for the authenticated student with calculated attendance rates",
      responses: {
        200: {
          description: "My modules with attendance rates retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  code: { type: "number", example: 200 },
                  message: { type: "string", example: "My modules with attendance rates retrieved successfully" },
                  metaData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        module_reg_id: { type: "number", example: 1 },
                        module_id: { type: "string", example: "MOD001" },
                        module_name: { type: "string", example: "Software Engineering" },
                        lecturer_id: { type: "string", example: "LEC001" },
                        program_id: { type: "string", example: "PROG001" },
                        intake: { type: "number", example: 2024 },
                        semester_id: { type: "string", example: "SEM001" },
                        attendance_rate: { type: "number", example: 85.5 },
                        total_classes: { type: "number", example: 20 },
                        attended_classes: { type: "number", example: 17 },
                        registration_date: { type: "string", format: "date-time" }
                      }
                    }
                  },
                  doc: { type: "string", example: "https://api.example.com/docs" }
                }
              }
            }
          }
        },
        401: { description: "Unauthorized" },
        500: { description: "Internal server error" },
      },
    },
  },

  "/student/{student_id}/exam-eligibility-status": {
    get: {
      security: [{ BearerAuth: [] }],
      tags: ["Student"],
      summary: "Get student's exam eligibility status",
      description: "Retrieve exam eligibility status for all modules where the student has exam records",
      parameters: [
        {
          name: "student_id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID of the student",
        },
      ],
      responses: {
        200: {
          description: "Student exam eligibility status retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  code: { type: "number", example: 200 },
                  message: { type: "string", example: "Student exam eligibility status retrieved successfully" },
                  metaData: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Found 2 exam record(s) for this student" },
                      exam_records: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            exam_id: { type: "number", example: 1 },
                            module_id: { type: "string", example: "MOD001" },
                            module_name: { type: "string", example: "Software Engineering" },
                            lecturer_id: { type: "string", example: "LEC001" },
                            program_id: { type: "string", example: "PROG001" },
                            intake: { type: "number", example: 2024 },
                            semester_id: { type: "string", example: "SEM001" },
                            attendance_rate: { type: "number", example: 85.5 },
                            is_eligible: { type: "boolean", example: true },
                            eligibility_status: { type: "string", example: "This student is eligible for the exam in module Software Engineering" },
                            exam_record_date: { type: "string", format: "date-time" }
                          }
                        }
                      }
                    }
                  },
                  doc: { type: "string", example: "https://api.example.com/docs" }
                }
              }
            }
          }
        },
        403: { description: "Forbidden - Students can only view their own exam eligibility" },
        500: { description: "Internal server error" },
      },
    },
  },

  "/student/my/exam-eligibility-status": {
    get: {
      security: [{ BearerAuth: [] }],
      tags: ["Student"],
      summary: "Get my exam eligibility status (Student only)",
      description: "Retrieve exam eligibility status for the authenticated student",
      responses: {
        200: {
          description: "My exam eligibility status retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  code: { type: "number", example: 200 },
                  message: { type: "string", example: "My exam eligibility status retrieved successfully" },
                  metaData: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Found 2 exam record(s) for this student" },
                      exam_records: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            exam_id: { type: "number", example: 1 },
                            module_id: { type: "string", example: "MOD001" },
                            module_name: { type: "string", example: "Software Engineering" },
                            lecturer_id: { type: "string", example: "LEC001" },
                            program_id: { type: "string", example: "PROG001" },
                            intake: { type: "number", example: 2024 },
                            semester_id: { type: "string", example: "SEM001" },
                            attendance_rate: { type: "number", example: 85.5 },
                            is_eligible: { type: "boolean", example: true },
                            eligibility_status: { type: "string", example: "This student is eligible for the exam in module Software Engineering" },
                            exam_record_date: { type: "string", format: "date-time" }
                          }
                        }
                      }
                    }
                  },
                  doc: { type: "string", example: "https://api.example.com/docs" }
                }
              }
            }
          }
        },
        401: { description: "Unauthorized" },
        500: { description: "Internal server error" },
      },
    },
  },
};

export default studentAPI;
