
const respuestaError = (descripcion) => ({
  description: descripcion,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: { type: "string" }
        },
        required: ["error"]
      }
    }
  }
});

const usuario = {
  type: "object",
  properties: {
    user_id: { type: "integer", example: 1 },
    name: { type: "string", example: "Ana García" },
    email: { type: "string", format: "email", example: "ana@correo.com" },
    role: { type: "string", enum: ["client", "admin"] }
  }
};

const datosUsuario = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: { type: "string", example: "Ana García" },
    email: { type: "string", format: "email", example: "ana@correo.com" },
    password: { type: "string", minLength: 6, example: "clave123" }
  }
};

const idParametro = {
  name: "id",
  in: "path",
  required: true,
  description: "Identificador del usuario",
  schema: { type: "integer", minimum: 1 }
};

module.exports = {
  "/usuarios": {
    post: {
      tags: ["Users"],
      summary: "Register a user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: datosUsuario
          }
        }
      },
      responses: {
        201: {
          description: "Usuario registrado correctamente",
          content: {
            "application/json": { schema: usuario }
          }
        },
        400: respuestaError("Datos inválidos o incompletos"),
        409: respuestaError("El correo ya está registrado"),
        500: respuestaError("Error interno del servidor")
      }
    },
    get: {
      tags: ["Users"],
      summary: "Get all users",
      responses: {
        200: {
          description: "Lista de usuarios",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: usuario
              }
            }
          }
        },
        500: respuestaError("Error interno del servidor")
      }
    }
  },

  "/usuarios/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      parameters: [idParametro],
      responses: {
        200: {
          description: "Usuario encontrado",
          content: {
            "application/json": { schema: usuario }
          }
        },
        400: respuestaError("Identificador inválido"),
        404: respuestaError("Usuario no encontrado"),
        500: respuestaError("Error interno del servidor")
      }
    },

    put: {
      tags: ["Users"],
      summary: "Update a user",
      parameters: [idParametro],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email"],
              properties: {
                name: { type: "string", example: "Ana García" },
                email: { type: "string", format: "email", example: "ana@correo.com" },
                password: { type: "string", minLength: 6 },
                role: { type: "string", enum: ["client", "admin"] }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Usuario actualizado",
          content: {
            "application/json": { schema: usuario }
          }
        },
        400: respuestaError("Datos inválidos"),
        404: respuestaError("Usuario no encontrado"),
        409: respuestaError("El correo ya está registrado"),
        500: respuestaError("Error interno del servidor")
      }
    },

    delete: {
      tags: ["Users"],
      summary: "Delete a user",
      parameters: [idParametro],
      responses: {
        200: {
          description: "Usuario eliminado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  mensaje: {
                    type: "string",
                    example: "Usuario eliminado"
                  }
                }
              }
            }
          }
        },
        400: respuestaError("Identificador inválido"),
        404: respuestaError("Usuario no encontrado"),
        409: respuestaError("El usuario tiene registros asociados"),
        500: respuestaError("Error interno del servidor")
      }
    }
  }
};
