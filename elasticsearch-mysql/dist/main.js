"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    swagger_1.setupSwagger(app);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    app.use(helmet());
    await app.listen(1776, () => {
        console.log('Server is running at http://localhost:1776/api/docs/');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map