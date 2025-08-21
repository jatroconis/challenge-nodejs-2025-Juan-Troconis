# OlaClick Orders API

Construida con **NestJS + Sequelize + PostgreSQL + Redis**, documentada con **Swagger**, validada con **DTOs/Pipes**, con **interceptor de logging** y **job programado** para depurar órdenes antiguas.

---
**Dev: JUAN ANDRES TROCONIS REDONDO**
---
**TEL : 3105249121**

## Características clave

- **Arquitectura por capas**: Controller → Service → Repository → Entity.
- **Sequelize + PostgreSQL** (migración sencilla y auto-load de modelos en dev).
- **Redis** para cachear lecturas (lista de órdenes y detalle).
- **Swagger** para documentación interactiva.
- **Validaciones** con `class-validator` + `ValidationPipe` global.
- **Interceptor** de logging (tiempos y endpoints).
- **Job con `@nestjs/schedule`** para limpiar órdenes antiguas entregadas.
- **Pruebas** con Jest (unitarias/e2e).

---

##  Modelo y flujo de negocio

- **Estados** de una orden: `initiated ➜ sent ➜ delivered`.
- Al avanzar a **`delivered`** se elimina la orden (y se invalida cache).
- Listados **excluyen** órdenes `delivered`.
- **Job**: elimina periódicamente órdenes `delivered` con `updatedAt` antiguo.

---

## Endpoints principales

- **Crear orden**  
  `POST /orders`
  ```json
  {
    "clientName": "Ana López",
    "items": [
      { "description": "Ceviche", "quantity": 2, "unitPrice": 50 },
      { "description": "Chicha morada", "quantity": 1, "unitPrice": 10 }
    ]
  }
  ```

- **Listar órdenes (no entregadas)**  
  `GET /orders`

- **Detalle de orden**  
  `GET /orders/:id`

- **Avanzar estado**  
  `POST /orders/:id/advance`

> **Swagger**: `http://localhost:3000/api-docs` (configurable por `.env`).

---

##  Variables de entorno

```env
# Application Configuration
APP_PORT=3000
APP_GLOBAL_PREFIX=api-ola
APP_ENABLE_CORS=true
SWAGGER_ENABLED=true
SWAGGER_PATH=api-docs

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=orders_db
DB_LOGGING=false
DB_POOL_MAX=10
DB_POOL_MIN=2
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=60

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

---

##  Levantar con Docker Compose

### Requisitos

- Docker Desktop

### Archivos relevantes

- **Dockerfile** 
- **docker-compose.yml** (orquesta app + postgres + redis + pgadmin)

### Comandos

```bash
docker compose up --build
# o en segundo plano:
docker compose up -d --build
```

Servicios:

- API: `http://localhost:${APP_PORT}` (por defecto `3000`)
- Swagger: `http://localhost:${APP_PORT}/api-docs`
- pgAdmin: `http://localhost:5050`

#### Posibles Errores de Conexopn

- Si ves `ECONNREFUSED ::1:5432`, asegúrate que en el contenedor **APP** se use `POSTGRES_HOST=postgres`.  
  `docker-compose.yml` ya lo **sobrescribe** así:
  ```yaml
  app:
    env_file: [.env]
    environment:
      POSTGRES_HOST: postgres
  ```
- El servicio de Postgres tiene **healthcheck**; la app espera a que la DB esté “healthy” antes de iniciar.

---


## Pruebas con Jest

Unit tests (`OrdersService`):

```bash
pnpm run test
```

---

##  Swagger

Accede en: `http://localhost:3000/api-docs`

---

##  Interceptor de logging

Archivo: `src/common/interceptors/logging.interceptor.ts`  
Registrado globalmente en `main.ts`.

Ejemplo de logs:
```
[LoggingInterceptor] GET /orders - Inicio
[LoggingInterceptor] GET /orders - Fin 42ms
```

---

##  Cache con Redis

- **Clave de lista**: `orders`
- **Clave de detalle**: `order_{id}`
- **TTL**: `REDIS_TTL` (segundos)
- **Invalidación**: en `create`, `advance` y `delete` se borra `orders` y/o `order_{id}`.

Ver keys desde el contenedor:
```bash
docker compose exec redis-cache redis-cli
keys *
get orders
ttl orders
```

---

##  Job programado

Archivo: `src/orders/jobs/order-cleanup.job.ts`  
- Programado con `@nestjs/schedule` (p. ej. `EVERY_HOUR`). Cada Hora ejecutara
- Elimina órdenes `delivered` con `updatedAt` anterior a un umbral.
- Para probar rápido, cámbialo a `EVERY_MINUTE`.

---

## pgAdmin

- URL: `http://localhost:5050`
- Login: `admin@admin.com / admin`
- Tablas: `Servers → Databases → orders_db → Schemas → public → Tables`

---


##  Scripts para Trabajar

```bash
# Dev local
pnpm run start:dev

# Build prod
pnpm run build
pnpm run start:prod

# Docker
docker compose up --build
docker compose down -v
docker compose logs -f app


# Defecto
- Por defecto la app se monta en el puerto 3000
- Consultarlo con Swager 
- URL: `http://localhost:3000/api#`

- Si se desea ver los cambios en la base de datos 
- URL: `http://localhost:5050/`
- USER: `admin@admin.com`
- PASS: `admin`

```
