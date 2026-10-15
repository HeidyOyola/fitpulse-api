
module.exports = {
  "/tags": {
    get: {
      tags: ["Tags"],
      summary: "Get all tags",
      description: "Returns the available tags that can be used when creating or updating a review.",

      responses: {
        200: {
          description: "Tags retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    tag_id: {
                      type: "integer",
                      example: 1
                    },
                    name: {
                      type: "string",
                      example: "Relaxing"
                    }
                  }
                }
              }
            }
          }
        },

        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["error"],
                properties: {
                  error: {
                    type: "string",
                    example: "Error interno del servidor"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

