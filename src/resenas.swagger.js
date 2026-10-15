
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

const jsonResponse = (description, schema) => ({
  description,
  content: {
    "application/json": { schema }
  }
});


const reviewSchema = {
  type: "object",
  properties: {
    reservation_id: { type: "integer", example: 4 },
    user_id: { type: "integer", example: 2 },
    user_name: { type: "string", example: "Test Client One" },
    class_id: { type: "integer", example: 1 },
    class_name: { type: "string", example: "Yoga" },
    rating: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      example: 5
    },
    comment: {
      type: "string",
      example: "Excellent yoga session"
    },
    review_date: {
      type: "string",
      example: "2026-10-14 15:16:26"
    },
    tags: {
      type: "array",
      items: { type: "string" },
      example: ["Good Instructor", "Relaxing"]
    }
  }
};


const reviewBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["rating", "comment"],
        properties: {
          rating: {
            type: "integer",
            minimum: 1,
            maximum: 5,
            example: 5
          },
          comment: {
            type: "string",
            maxLength: 1000,
            example: "Excellent class!"
          },
          tags: {
            type: "array",
            items: { type: "string" },
            example: []
          }
        }
      }
    }
  }
};

const reservationId = {
  name: "id",
  in: "path",
  required: true,
  description: "Reservation identifier",
  schema: { type: "integer", minimum: 1 }
};

module.exports = {
  "/reviews": {
    get: {
      tags: ["Reviews"],
      summary: "Get all reviews",
      description: "Returns reviews with optional user and class filters.",
      parameters: [
        {
          name: "user_id",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1 }
        },
        {
          name: "class_id",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: jsonResponse("Reviews retrieved successfully", {
          type: "array",
          items: reviewSchema
        }),
        400: errorResponse(
          "Invalid filter parameter",
          "Identificador inválido"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  },

  "/reservations/{id}/review": {
    get: {
      tags: ["Reviews"],
      summary: "Get reservation review",
      parameters: [reservationId],
      responses: {
        200: jsonResponse("Review retrieved successfully", reviewSchema),
        400: errorResponse("Invalid reservation ID", "Identificador inválido"),
        404: errorResponse("Review not found", "La reserva no tiene reseña"),
        500: errorResponse("Internal server error", "Error interno del servidor")
      }
    },

    post: {
      tags: ["Reviews"],
      summary: "Create a review",
      description: "Creates a review for a completed reservation. Only one review is allowed per reservation.",
      parameters: [reservationId],
      requestBody: reviewBody,
      responses: {
        201: jsonResponse("Review created successfully", reviewSchema),
        400: errorResponse(
          "Invalid or missing review data",
          "rating y comment son obligatorios"
        ),
        404: errorResponse("Reservation not found", "Reserva no encontrada"),
        409: errorResponse("Review already exists", "Esta reserva ya tiene una reseña"),
        422: errorResponse(
          "Reservation is not completed",
          "Solo se pueden reseñar reservas de clases ya realizadas (estado completed)"
        ),
        500: errorResponse("Internal server error", "Error interno del servidor")
      }
    },

    put: {
      tags: ["Reviews"],
      summary: "Update a review",
      description: "Updates the rating, comment and tags of an existing review.",
      parameters: [reservationId],
      requestBody: reviewBody,
      responses: {
        200: jsonResponse("Review updated successfully", reviewSchema),
        400: errorResponse("Invalid review data", "rating y comment son obligatorios"),
        404: errorResponse("Review not found", "La reserva no tiene reseña"),
        500: errorResponse("Internal server error", "Error interno del servidor")
      }
    },

    delete: {
      tags: ["Reviews"],
      summary: "Delete a review",
      parameters: [reservationId],
      responses: {
        200: jsonResponse("Review deleted successfully", {
          type: "object",
          properties: {
            mensaje: {
              type: "string",
              example: "Reseña eliminada"
            }
          }
        }),
        400: errorResponse("Invalid reservation ID", "Identificador inválido"),
        404: errorResponse("Review not found", "La reserva no tiene reseña"),
        500: errorResponse("Internal server error", "Error interno del servidor")
      }
    }
  }
};
