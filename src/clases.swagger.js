
const errorResponse = (description, message) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "string",
            example: message
          }
        }
      }
    }
  }
});

const classSchema = {
  type: "object",
  properties: {
    class_id: { type: "integer", example: 1 },
    name: { type: "string", example: "Yoga" },
    category: { type: "string", example: "Flexibility" },
    description: {
      type: "string",
      nullable: true,
      example: "Yoga class for beginners"
    },
    price: { type: "number", example: 25000 }
  }
};

const sessionSchema = {
  type: "object",
  properties: {
    session_id: { type: "integer", example: 1 },
    class_id: { type: "integer", example: 1 },
    instructor: { type: "string", example: "Laura Perez" },
    location: { type: "string", example: "Room A" },
    start_time: {
      type: "string",
      example: "2026-11-10 08:00:00"
    },
    end_time: {
      type: "string",
      example: "2026-11-10 09:00:00"
    },
    max_capacity: { type: "integer", example: 20 }
  }
};

const classIdParameter = {
  name: "id",
  in: "path",
  required: true,
  description: "Class identifier",
  schema: {
    type: "integer",
    minimum: 1
  }
};

const jsonResponse = (description, schema) => ({
  description,
  content: {
    "application/json": {
      schema
    }
  }
});

module.exports = {
  "/clases": {
    get: {
      tags: ["Classes"],
      summary: "Get all classes",
      description: "Returns the available gym classes.",
      responses: {
        200: jsonResponse("Classes retrieved successfully", {
          type: "array",
          items: classSchema
        }),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    },

    post: {
      tags: ["Classes"],
      summary: "Create a class",
      description: "Creates a new gym class.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "category", "price"],
              properties: {
                name: {
                  type: "string",
                  example: "Pilates"
                },
                category: {
                  type: "string",
                  example: "Flexibility"
                },
                description: {
                  type: "string",
                  nullable: true,
                  example: "Pilates for beginners"
                },
                price: {
                  type: "number",
                  minimum: 0,
                  example: 30000
                }
              }
            }
          }
        }
      },
      responses: {
        201: jsonResponse("Class created successfully", {
          type: "object",
          properties: {
            ...classSchema.properties,
            sesiones: {
              type: "array",
              items: sessionSchema
            }
          }
        }),
        400: errorResponse(
          "Invalid or missing class data",
          "name, category y price son obligatorios"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  },

  "/clases/{id}": {
    get: {
      tags: ["Classes"],
      summary: "Get class by ID",
      description: "Returns a class and its scheduled sessions.",
      parameters: [classIdParameter],
      responses: {
        200: jsonResponse("Class retrieved successfully", {
          type: "object",
          properties: {
            ...classSchema.properties,
            sesiones: {
              type: "array",
              items: sessionSchema
            }
          }
        }),
        400: errorResponse(
          "Invalid class identifier",
          "Identificador inválido"
        ),
        404: errorResponse(
          "Class not found",
          "Clase no encontrada"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  },

  "/clases/{id}/sesiones": {
    post: {
      tags: ["Classes"],
      summary: "Create a class session",
      description: "Creates a new scheduled session for an existing class.",
      parameters: [classIdParameter],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "instructor",
                "location",
                "start_time",
                "end_time",
                "max_capacity"
              ],
              properties: {
                instructor: {
                  type: "string",
                  example: "Laura Perez"
                },
                location: {
                  type: "string",
                  example: "Room A"
                },
                start_time: {
                  type: "string",
                  description: "Format: YYYY-MM-DD HH:MM:SS",
                  example: "2026-11-10 08:00:00"
                },
                end_time: {
                  type: "string",
                  description: "Must be later than start_time",
                  example: "2026-11-10 09:00:00"
                },
                max_capacity: {
                  type: "integer",
                  minimum: 1,
                  example: 20
                }
              }
            }
          }
        }
      },
      responses: {
        201: jsonResponse(
          "Class session created successfully",
          sessionSchema
        ),
        400: errorResponse(
          "Invalid or missing session data",
          "instructor, location, start_time, end_time y max_capacity son obligatorios"
        ),
        404: errorResponse(
          "Class not found",
          "Clase no encontrada"
        ),
        409: errorResponse(
          "Session already exists",
          "Ya existe una sesión de esta clase en esa sede y horario"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  }
};

