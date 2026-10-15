
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

const packageSchema = {
  type: "object",
  properties: {
    package_id: {
      type: "integer",
      example: 1
    },
    name: {
      type: "string",
      example: "Basic Plan"
    },
    included_classes: {
      type: "integer",
      example: 5
    },
    price: {
      type: "number",
      example: 120000
    }
  }
};

module.exports = {
  "/paquetes": {
    get: {
      tags: ["Packages"],
      summary: "Get all packages",
      description: "Returns the available gym class packages.",

      responses: {
        200: {
          description: "Packages retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: packageSchema
              }
            }
          }
        },

        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  },

  "/paquetes/{id}": {
    get: {
      tags: ["Packages"],
      summary: "Get package by ID",
      description: "Returns the information of a specific package.",

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Package identifier",
          schema: {
            type: "integer",
            minimum: 1
          },
          example: 1
        }
      ],

      responses: {
        200: {
          description: "Package retrieved successfully",
          content: {
            "application/json": {
              schema: packageSchema
            }
          }
        },

        400: errorResponse(
          "Invalid package identifier",
          "Identificador inválido"
        ),

        404: errorResponse(
          "Package not found",
          "Paquete no encontrado"
        ),

        500: errorResponse(
          "Internal server error",
          "Error interno del servidor"
        )
      }
    }
  }
};
