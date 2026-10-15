
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


const purchaseSchema = {
  type: "object",
  properties: {
    purchase_id: {
      type: "integer",
      example: 4
    },
    user_id: {
      type: "integer",
      example: 2
    },
    user_name: {
      type: "string",
      example: "Test Client One"
    },
    package_id: {
      type: "integer",
      example: 4
    },
    package_name: {
      type: "string",
      example: "Unlimited"
    },
    purchase_date: {
      type: "string",
      example: "2026-10-13 14:00:00"
    },
    paid_price: {
      type: "number",
      example: 450000
    }
  }
};


const jsonResponse = (description, schema) => ({
  description,
  content: {
    "application/json": { schema }
  }
});

module.exports = {
  "/purchases": {
    get: {
      tags: ["Purchases"],
      summary: "Get all purchases",
      description: "Returns purchases with an optional user filter.",
      parameters: [
        {
          name: "user_id",
          in: "query",
          required: false,
          description: "Filter purchases by user ID",
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: jsonResponse("Purchases retrieved successfully", {
          type: "array",
          items: purchaseSchema
        }),
        400: errorResponse(
          "Invalid user identifier",
          "Identificador inválido"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    },

    post: {
      tags: ["Purchases"],
      summary: "Create a purchase",
      description: "Creates a package purchase. The paid price is set automatically by the server based on the selected package.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["user_id", "package_id"],
              properties: {
                user_id: {
                  type: "integer",
                  minimum: 1,
                  example: 6
                },
                package_id: {
                  type: "integer",
                  minimum: 1,
                  example: 1
                }
              }
            }
          }
        }
      },
      responses: {
        201: jsonResponse(
          "Purchase created successfully",
          purchaseSchema
        ),
        400: errorResponse(
          "Invalid or missing purchase data",
          "user_id y package_id son obligatorios"
        ),
        404: errorResponse(
          "User or package not found",
          "Paquete no encontrado"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  },

  "/purchases/{id}": {
    get: {
      tags: ["Purchases"],
      summary: "Get purchase by ID",
      description: "Returns the information of a specific purchase.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Purchase identifier",
          schema: { type: "integer", minimum: 1 }
        }
      ],
      responses: {
        200: jsonResponse(
          "Purchase retrieved successfully",
          purchaseSchema
        ),
        400: errorResponse(
          "Invalid purchase identifier",
          "Identificador inválido"
        ),
        404: errorResponse(
          "Purchase not found",
          "Compra no encontrada"
        ),
        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  }
};
