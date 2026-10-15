
const errorResponse = (message) => ({
  description: message,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: message
          }
        },
        required: ["error"]
      }
    }
  }
});

module.exports = {
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Log in a user",
      description: "Validates user credentials against the database.",

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "client1@fitpulse.test"
                },
                password: {
                  type: "string",
                  example: "example123"
                }
              }
            }
          }
        }
      },

      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  mensaje: {
                    type: "string",
                    example: "Inicio de sesión exitoso"
                  },
                  usuario: {
                    type: "object",
                    properties: {
                      user_id: {
                        type: "integer",
                        example: 2
                      },
                      name: {
                        type: "string",
                        example: "Test Client One"
                      },
                      email: {
                        type: "string",
                        example: "client1@fitpulse.test"
                      },
                      role: {
                        type: "string",
                        enum: ["client", "admin"],
                        example: "client"
                      }
                    }
                  }
                }
              }
            }
          }
        },

        400: errorResponse("email y password son obligatorios"),
        401: errorResponse("Credenciales inválidas"),
        500: errorResponse("Error interno del servidor")
      }
    }
  }
};

