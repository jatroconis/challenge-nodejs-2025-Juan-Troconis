import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    console.log(`[LoggingInterceptor] ${method} ${url} - Inicio`);

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[LoggingInterceptor] ${method} ${url} - Fin ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
