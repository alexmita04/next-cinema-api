const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Next Cinema API",
      version: "1.0.0",
      description:
        "A concise RESTful backend built with Node.js (Express) and MongoDB (Mongoose).",
      contact: {
        name: "Mita Alexandru Serban",
        email: "alexmita04@gmail.com",
      },
    },
    servers: [
      {
        url: `https://next-cinema-api.onrender.com/`,
      },
    ],
  },
  apis: [
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./models/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
