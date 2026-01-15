# User Mapping Service - Setup & Usage Guide

## Implementation Summary

The User Mapping Service has been successfully implemented with all the requested features using NestJS, TypeORM, MySQL, and TypeScript.

## What Was Implemented

### 1. API Endpoint
- **Endpoint**: `POST /user-mapping`
- **Parameters**: JSON body with `id1` and `id2`
- **Response**: JSON object with `userID` (UUIDv4)

### 2. Database
- **Database**: MySQL 8+
- **Table**: `user_mappings`
- **Fields**:
  - `id` (UUID): Primary key
  - `id1` (VARCHAR): First identifier
  - `id2` (VARCHAR): Second identifier
  - `userID` (VARCHAR): User ID (UUIDv4 or retrieved)
  - `createdAt` (TIMESTAMP): Creation timestamp
- **Unique Constraint**: `UNIQUE(id1, id2)` ensures no duplicate mappings

### 3. Business Logic
When a request is received:
1. **Check Database**: Searches for existing mapping with the provided id1 and id2
2. **If Found**: Returns the existing userID
3. **If Not Found**:
   - Generates a new UUIDv4
   - Inserts the new mapping into the database
   - Returns the newly generated userID

## File Structure

```
user-mapping-service/
├── src/
│   ├── config/
│   │   └── database.config.ts          # Database configuration
│   ├── user-mapping/
│   │   ├── user-mapping.controller.ts  # API endpoint controller
│   │   ├── user-mapping.entity.ts      # Database entity
│   │   ├── user-mapping.service.ts     # Business logic service
│   │   └── user-mapping.module.ts      # Module definition
│   ├── utils/
│   │   └── uuid.util.ts                # UUID generation utility
│   ├── app.module.ts                   # Main module (updated)
│   └── main.ts                         # Application entry point
├── .env                                # Environment variables
├── package.json                        # Dependencies
├── README.md                           # Full documentation
└── SETUP_GUIDE.md                      # This file
```


## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MySQL 8+
- npm or yarn
- Docker & Docker Compose (optional, recommended)

### 2. Clone & Install
```bash
git clone <repo-url>
cd user-mapping-service
npm install
```

### 3. Database Setup
#### a) Manual (Local MySQL)
Create the database:
```sql
CREATE DATABASE user_mapping_db;
```

#### b) With Docker Compose (Recommended)
Run the following to start MySQL, Redis, and the API:
```bash
docker-compose up --build
```
This will start:
- API service on port 3000
- MySQL on port 3306 (user: root, password: rootpassword)
- Redis on port 6379

### 4. Configure Environment
Update the `.env` file with your credentials (see example below):
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=user_mapping_db
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```
If using Docker Compose, these are set automatically for containers.

### 5. Build & Run (Local)
**Development:**
```bash
npm run start:dev
```
**Production:**
```bash
npm run build
npm run start:prod
```

---

## Running Tests

### Unit Tests
```bash
npm run test
```

### End-to-End (E2E) Tests
```bash
npm run test:e2e
```
E2E tests are located in the `test/` directory and use Jest + Supertest.

---

## Running with Docker

1. Build and start all services:
  ```bash
  docker-compose up --build
  ```
2. The API will be available at `http://localhost:3000`.
3. To stop services:
  ```bash
  docker-compose down
  ```

---

The service will start on `http://localhost:3000`

## Testing the Endpoint

### Using cURL
```bash
curl -X POST http://localhost:3000/user-mapping \
  -H "Content-Type: application/json" \
  -d '{"id1": "user_123", "id2": "email_456"}'
```

### Using Postman
1. Create a new POST request
2. URL: `http://localhost:3000/user-mapping`
3. Body (JSON):
```json
{
  "id1": "user_123",
  "id2": "email_456"
}
```
4. Click Send

### Expected Responses

**First Request (New Mapping):**
```json
{
  "userID": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Second Request (Same IDs - Returns Existing):**
```json
{
  "userID": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Database Verification

To verify the data is being stored:

```sql
USE user_mapping_db;
SELECT * FROM user_mappings;
```

## Key Features

1. **Automatic Table Creation**: Tables are automatically created when the application starts (synchronize: true)
2. **UUID Generation**: Uses UUIDv4 for user ID generation
3. **Duplicate Prevention**: Unique constraint on (id1, id2) prevents duplicate mappings
4. **Timestamp Tracking**: createdAt field automatically records insertion time
5. **Type Safety**: Full TypeScript support with strict typing

## Dependencies Installed

- `@nestjs/core` - NestJS core framework
- `@nestjs/common` - Common utilities
- `@nestjs/typeorm` - TypeORM integration
- `typeorm` - Object-relational mapping
- `mysql2` - MySQL driver
- `uuid` - UUID generation
- `@nestjs/config` - Configuration management
- `redis` - Redis support (optional)


## Troubleshooting

### MySQL/Database Issues
- Ensure MySQL is running (or the Docker container is up)
- Verify credentials in `.env` or Docker Compose
- Check if database `user_mapping_db` exists
- If using Docker, check logs with `docker-compose logs mysql_db`

### Redis Issues (Optional)
- Redis is only required if you enable caching in the code
- If not using Redis, ensure your config disables or ignores it

### Port Already in Use
- Change the `PORT` in `.env` or Docker Compose
- Or stop the process using port 3000 (e.g., `npx kill-port 3000`)

### Build/Install Errors
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Run `npm run build`

### Docker Issues
- Ensure Docker Desktop is running
- Use `docker-compose down -v` to remove volumes if you want a clean DB
- Check logs with `docker-compose logs`

### Test Failures
- Ensure the database is up and clean before running E2E tests
- For E2E, the test DB may be dropped/recreated

---

## Notes

- The application auto-creates the database schema on startup (TypeORM synchronize: true)
- All responses are JSON
- Error handling is implemented at the controller level
- Redis is optional and only needed if you enable caching
- Docker Compose is the fastest way to get started for local/dev
- The service uses TypeORM's query builder for DB operations

---

## Next Steps (Production)

1. Set strong database credentials and secrets
2. Enable regular database backups
3. Configure Redis for caching if needed
4. Set up monitoring/logging (e.g., with Prometheus, Grafana, or ELK)
5. Implement authentication/authorization as required
6. Use environment-specific `.env` files and secrets management
7. Consider using migrations instead of synchronize: true

---

## Support & References

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [Docker Documentation](https://docs.docker.com)

---
