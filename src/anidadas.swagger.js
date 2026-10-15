
const errorResponse = (description, message) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string", example: message }
        }
      }
    }
  }
});

const idParameter = (description) => ({
  name: "id",
  in: "path",
  required: true,
  description,
  schema: { type: "integer", minimum: 1 }
});

const listResponse = (description, properties) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "array",
        items: {
          type: "object",
          properties
        }
      }
    }
  }
});

const reservationFields = {
  reservation_id: { type: "integer", example: 8 },
  user_id: { type: "integer", example: 6 },
  session_id: { type: "integer", example: 11 },
  class_id: { type: "integer", example: 6 },
  class_name: { type: "string", example: "Dance Fitness Test" },
  instructor: { type: "string", example: "Sofia Martinez" },
  location: { type: "string", example: "Studio B" },
  start_time: { type: "string", example: "2026-11-20 08:00:00" },
  end_time: { type: "string", example: "2026-11-20 09:00:00" },
  status: {
    type: "string",
    enum: ["pending", "confirmed", "completed", "cancelled"]
  },
  reservation_date: { type: "string" }
};

const purchaseFields = {
  purchase_id: { type: "integer", example: 5 },
  user_id: { type: "integer", example: 6 },
  user_name: { type: "string", example: "Login Test" },
  package_id: { type: "integer", example: 1 },
  package_name: { type: "string", example: "Basic" },
  purchase_date: { type: "string" },
  paid_price: { type: "number", example: 90000 }
};

const reviewFields = {
  reservation_id: { type: "integer", example: 4 },
  user_id: { type: "integer", example: 2 },
  user_name: { type: "string", example: "Test Client One" },
  class_id: { type: "integer", example: 1 },
  class_name: { type: "string", example: "Yoga" },
  rating: { type: "integer", minimum: 1, maximum: 5 },
  comment: { type: "string" },
  review_date: { type: "string" },
  tags: {
    type: "array",
    items: { type: "string" }
  }
};

const commonErrors = {
  400: errorResponse("Invalid identifier", "Identificador inválido"),
  404: errorResponse("Resource not found", "Usuario no encontrado"),
  500: errorResponse("Internal server error", "Error interno del servidor")
};

module.exports = {
  "/usuarios/{id}/reservations": {
    get: {
      tags: ["Reservations"],
      summary: "Get reservations by user",
      description: "Returns reservations belonging to a specific user.",
      parameters: [
        idParameter("User identifier"),
        {
          name: "type",
          in: "query",
          required: false,
          description: "Optional reservation type filter",
          schema: {
            type: "string",
            enum: ["upcoming", "completed"]
          }
        }
      ],
      responses: {
        200: listResponse("User reservations retrieved successfully", reservationFields),
        ...commonErrors
      }
    }
  },

  "/usuarios/{id}/purchases": {
    get: {
      tags: ["Purchases"],
      summary: "Get purchases by user",
      description: "Returns package purchases made by a specific user.",
      parameters: [idParameter("User identifier")],
      responses: {
        200: listResponse("User purchases retrieved successfully", purchaseFields),
        ...commonErrors
      }
    }
  },

  "/usuarios/{id}/reviews": {
    get: {
      tags: ["Reviews"],
      summary: "Get reviews by user",
      description: "Returns reviews written by a specific user.",
      parameters: [idParameter("User identifier")],
      responses: {
        200: listResponse("User reviews retrieved successfully", reviewFields),
        ...commonErrors
      }
    }
  },

  "/clases/{id}/reviews": {
    get: {
      tags: ["Reviews"],
      summary: "Get reviews by class",
      description: "Returns reviews associated with a specific class.",
      parameters: [idParameter("Class identifier")],
      responses: {
        200: listResponse("Class reviews retrieved successfully", reviewFields),
        400: errorResponse("Invalid class identifier", "Identificador inválido"),
        404: errorResponse("Class not found", "Clase no encontrada"),
        500: errorResponse("Internal server error", "Error interno del servidor")
      }
    }
  }
};

