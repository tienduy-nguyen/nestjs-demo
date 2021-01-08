"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_constants_1 = require("./swagger.constants");
const setupSwagger = (app) => {
    const options = new swagger_1.DocumentBuilder()
        .setTitle(swagger_constants_1.SWAGGER_API_NAME)
        .setDescription(swagger_constants_1.SWAGGER_API_DESCRIPTION)
        .setVersion(swagger_constants_1.SWAGGER_API_CURRENT_VERSION)
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(swagger_constants_1.SWAGGER_API_ROOT, app, document);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=index.js.map