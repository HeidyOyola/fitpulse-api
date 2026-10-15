
const paths = {
  '/usuarios/{id}/progress': {
    get: {
      tags: ['Progress'],
      summary: 'Get user fitness progress',
      description:
        'Returns completed classes, attendance streak, completed classes by category, and personal records for a user.',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID',
          schema: {
            type: 'integer',
            example: 2
          }
        }
      ],

      responses: {
        200: {
          description: 'User progress retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user_id: {
                    type: 'integer',
                    example: 2
                  },
                  completed_classes: {
                    type: 'integer',
                    example: 2
                  },
                  attendance_streak: {
                    type: 'integer',
                    example: 1
                  },
                  classes_by_category: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: {
                          type: 'string',
                          example: 'Flexibility'
                        },
                        total_classes: {
                          type: 'integer',
                          example: 2
                        }
                      }
                    }
                  },
                  personal_records: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        record_id: {
                          type: 'integer',
                          example: 1
                        },
                        activity: {
                          type: 'string',
                          example: 'Squat'
                        },
                        record_value: {
                          type: 'number',
                          example: 50
                        },
                        unit: {
                          type: 'string',
                          example: 'kg'
                        },
                        record_date: {
                          type: 'string',
                          format: 'date',
                          example: '2026-10-05'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },

        400: {
          description: 'Invalid user ID',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'El id debe ser un número entero positivo'
                  }
                }
              },
              example: {
                error: 'El id debe ser un número entero positivo'
              }
            }
          }
        },

        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Usuario no encontrado'
                  }
                }
              },
              example: {
                error: 'Usuario no encontrado'
              }
            }
          }
        },

        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Error interno del servidor'
                  }
                }
              },
              example: {
                error: 'Error interno del servidor'
              }
            }
          }
        }
      }
    }
  }
};

module.exports = paths;
