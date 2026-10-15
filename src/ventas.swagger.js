
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

const purchaseSchema = {
    type: "object",
    properties: {
        purchase_id: { type: "integer", example: 5 },
        user_id: { type: "integer", example: 6 },
        user_name: { type: "string", example: "Login Test" },
        package_id: { type: "integer", example: 1 },
        package_name: { type: "string", example: "Basic" },
        purchase_date: {
            type: "string",
            example: "2026-10-14 21:31:25"
        },
        paid_price: { type: "number", example: 90000 }
    }
};

module.exports = {
    "/sales/daily": {
        get: {
            tags: ["Sales"],
            summary: "Get daily sales",
            description:
                "Returns daily sales totals and purchase details. If no date is provided, the server uses the current date.",

            parameters: [
                {
                    name: "date",
                    in: "query",
                    required: false,
                    description: "Sales date in YYYY-MM-DD format",
                    schema: {
                        type: "string",
                        format: "date"
                    },
                    example: "2026-10-14"
                }
            ],

            responses: {
                200: {
                    description: "Daily sales retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    sale_date: {
                                        type: "string",
                                        format: "date",
                                        example: "2026-10-14"
                                    },
                                    total_purchases: {
                                        type: "integer",
                                        example: 1
                                    },
                                    total_sales: {
                                        type: "number",
                                        example: 90000
                                    },
                                    purchases: {
                                        type: "array",
                                        items: purchaseSchema
                                    }
                                }
                            }
                        }
                    }
                },

                400: errorResponse(
                    "Invalid date parameter",
                    "date debe tener el formato YYYY-MM-DD y ser una fecha real"
                ),

                500: errorResponse(
                    "Internal server error",
                    "Error interno del servidor"
                )
            }
        }
    }
};
