
const usuariosPaths = require("./usuarios.swagger");
const authPaths = require("./auth.swagger");

const clasesPaths = require("./clases.swagger");
const paquetesPaths = require("./paquetes.swagger");
const reservasPaths = require("./reservas.swagger");
const comprasPaths = require("./compras.swagger");
const ventasPaths = require("./ventas.swagger");
const resenasPaths = require("./resenas.swagger");
const etiquetasPaths = require("./etiquetas.swagger");
const anidadasPaths = require("./anidadas.swagger");
const progresoPaths = require('./progreso.swagger');

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "FitPulse REST API",
        version: "1.0.0",
        description: "Interactive API documentation for the FitPulse gym management system. Database Project - Second Term."
    },

    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server"
        }
    ],

    tags: [
        { name: "Users", description: "User registration and management" },
        { name: "Classes", description: "Class management and availability" },
        { name: "Reservations", description: "Gym class reservations" },
        { name: "Packages", description: "Available class packages" },
        { name: "Purchases", description: "User package purchases" },
        { name: "Sales", description: "Daily sales information" },
        { name: "Reviews", description: "Class ratings and reviews" },
        { name: "Tags", description: "Review tags" },
        { name: "Progress", description: "User fitness progress tracking" },
        { name: "Authentication", description: "User login and authentication" },
    ],


    paths: {
        ...usuariosPaths,
        ...authPaths,
        ...clasesPaths,
        ...paquetesPaths,
        ...reservasPaths,
        ...comprasPaths,
        ...ventasPaths,
        ...resenasPaths,
        ...etiquetasPaths,
        ...anidadasPaths,
        ...progresoPaths
    }
};

module.exports = swaggerDocument;

