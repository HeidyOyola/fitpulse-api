
const errorResponse = (description, example) => ({
    description,
    content: {
        "application/json": {
            schema: {
                type: "object",
                required: ["error"],
                properties: {
                    error: { type: "string", example }
                }
            }
        }
    }
});


const reservationSchema = {
    type: "object",
    properties: {
        reservation_id: { type: "integer", example: 4 },
        user_id: { type: "integer", example: 2 },
        session_id: { type: "integer", example: 7 },
        class_id: { type: "integer", example: 1 },
        class_name: { type: "string", example: "Yoga" },
        instructor: { type: "string", example: "Sofia Martinez" },
        location: { type: "string", example: "North Studio" },
        start_time: {
            type: "string",
            example: "2026-10-05 08:00:00"
        },
        end_time: {
            type: "string",
            example: "2026-10-05 09:00:00"
        },
        status: {
            type: "string",
            enum: ["pending", "confirmed", "completed", "cancelled"],
            example: "completed"
        },
        reservation_date: {
            type: "string",
            example: "2026-10-14 15:16:26"
        }
    }
};


const idParameter = {
    name: "id",
    in: "path",
    required: true,
    description: "Reservation identifier",
    schema: { type: "integer", minimum: 1 }
};

const jsonResponse = (description, schema) => ({
    description,
    content: {
        "application/json": { schema }
    }
});

module.exports = {
    "/reservations": {
        get: {
            tags: ["Reservations"],
            summary: "Get all reservations",
            description: "Returns reservations with optional filters.",
            parameters: [
                {
                    name: "user_id",
                    in: "query",
                    schema: { type: "integer", minimum: 1 },
                    description: "Filter by user ID"
                },
                {
                    name: "session_id",
                    in: "query",
                    schema: { type: "integer", minimum: 1 },
                    description: "Filter by session ID"
                },
                {
                    name: "type",
                    in: "query",
                    schema: {
                        type: "string",
                        enum: ["upcoming", "completed"]
                    },
                    description: "Filter by reservation type"
                }
            ],
            responses: {
                200: jsonResponse("Reservations retrieved successfully", {
                    type: "array",
                    items: reservationSchema
                }),
                400: errorResponse(
                    "Invalid filter",
                    "type debe ser upcoming o completed"
                ),
                500: errorResponse(
                    "Internal server error",
                    "Error interno del servidor"
                )
            }
        },

        post: {
            tags: ["Reservations"],
            summary: "Create a reservation",
            description: "Creates a reservation if the session has available capacity.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["user_id", "session_id"],
                            properties: {
                                user_id: { type: "integer", minimum: 1, example: 6 },
                                session_id: { type: "integer", minimum: 1, example: 11 }
                            }
                        }
                    }
                }
            },
            responses: {
                201: jsonResponse("Reservation created successfully", reservationSchema),
                400: errorResponse(
                    "Invalid or missing data",
                    "user_id y session_id son obligatorios"
                ),
                404: errorResponse(
                    "User or session not found",
                    "Sesión no encontrada"
                ),
                409: errorResponse(
                    "Duplicate reservation or full session",
                    "La sesión no tiene cupos disponibles"
                ),
                422: errorResponse(
                    "Session has already started",
                    "No se puede reservar una sesión que ya comenzó"
                ),
                500: errorResponse(
                    "Internal server error",
                    "Error interno del servidor"
                )
            }
        }
    },

    "/reservations/{id}": {
        get: {
            tags: ["Reservations"],
            summary: "Get reservation by ID",
            parameters: [idParameter],
            responses: {
                200: jsonResponse("Reservation retrieved successfully", reservationSchema),
                400: errorResponse("Invalid reservation ID", "Identificador inválido"),
                404: errorResponse("Reservation not found", "Reserva no encontrada"),
                500: errorResponse("Internal server error", "Error interno del servidor")
            }
        },

        delete: {
            tags: ["Reservations"],
            summary: "Cancel a reservation",
            description: "Cancels a reservation without deleting its history.",
            parameters: [idParameter],
            responses: {
                200: jsonResponse("Reservation cancelled successfully", reservationSchema),
                400: errorResponse("Invalid reservation ID", "Identificador inválido"),
                404: errorResponse("Reservation not found", "Reserva no encontrada"),
                409: errorResponse(
                    "Invalid status transition",
                    "No se puede pasar una reserva de cancelled a cancelled"
                ),
                422: errorResponse(
                    "Reservation cannot be cancelled after session starts",
                    "No se puede cancelar una reserva de una sesión que ya comenzó"
                ),
                500: errorResponse("Internal server error", "Error interno del servidor")
            }
        }
    },

    "/reservations/{id}/status": {
        patch: {
            tags: ["Reservations"],
            summary: "Update reservation status",
            description: "Changes reservation status according to allowed transitions.",
            parameters: [idParameter],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["status"],
                            properties: {
                                status: {
                                    type: "string",
                                    enum: ["pending", "confirmed", "completed", "cancelled"],
                                    example: "completed"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: jsonResponse("Reservation status updated successfully", reservationSchema),
                400: errorResponse(
                    "Invalid status",
                    "status debe ser uno de: pending, confirmed, completed, cancelled"
                ),
                404: errorResponse("Reservation not found", "Reserva no encontrada"),
                409: errorResponse(
                    "Invalid status transition",
                    "La reserva ya está en estado confirmed"
                ),
                422: errorResponse(
                    "Session has not started",
                    "No se puede completar una reserva de una sesión que aún no comienza"
                ),
                500: errorResponse("Internal server error", "Error interno del servidor")
            }
        }
    }
};
