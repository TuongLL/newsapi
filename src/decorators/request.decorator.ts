import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Request = createParamDecorator((data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.body;
    return request.body[data]
})