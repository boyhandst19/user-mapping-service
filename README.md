# User Mapping Service

A NestJS-based microservice that provides user ID mapping functionality using MySQL database and TypeORM.

## Features

- POST endpoint to accept two identifiers (id1 and id2)
- Automatic UUID generation for new user mappings
- Database lookup to retrieve existing user IDs
- MySQL integration with TypeORM for data persistence
- Redis support for caching (optional)

## Prerequisites

- Node.js 18+
- npm or yarn
- MySQL 8+
- Redis (optional, for caching)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory with your database credentials:

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

2. Create the MySQL database:

```sql
CREATE DATABASE user_mapping_db;
```

## Database Setup

The application uses TypeORM with `synchronize: true`, which means the tables are automatically created when the application starts. However, you can manually create the table structure:

```sql
CREATE TABLE user_mappings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  id1 VARCHAR(50) NOT NULL,
  id2 VARCHAR(50) NOT NULL,
  userID VARCHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_id1_id2 (id1, id2)
);
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### Production Mode

```bash
npm run build
npm run start:prod
```

## Running with Docker Compose

You can run the entire stack (API, MySQL, Redis) using Docker Compose:

```bash
docker-compose up --build
```

- The API will be available at `http://localhost:3000`
- MySQL will run on port `3306` (user: root, password: rootpassword)
- Redis will run on port `6379`

To stop all services:

```bash
docker-compose down
```

Environment variables are set automatically for containers. For local development, ensure your `.env` matches the values in [docker-compose.yml](docker-compose.yml).

## API Endpoints

### POST `/user-mapping`

Maps two identifiers to a user ID. If the mapping already exists, returns the existing user ID. Otherwise, creates a new mapping with a generated UUID.

**Request Body:**
```json
{
  "id1": "identifier1",
  "id2": "identifier2"
}
```

**Response (Success - 201 Created):**
```json
{
  "userID": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/user-mapping \
  -H "Content-Type: application/json" \
  -d '{"id1": "user_123", "id2": "email_456"}'
```

## How It Works

1. **Request Received**: The endpoint receives a POST request with `id1` and `id2`
2. **Database Check**: The service queries the database to check if a mapping for these IDs already exists
3. **Response**:
   - **If Found**: Returns the existing `userID`
   - **If Not Found**: 
     - Generates a new UUIDv4
     - Inserts the new mapping into the database
     - Returns the newly generated `userID`

## Project Structure

```
src/
├── config/
│   └── database.config.ts       # TypeORM database configuration
├── user-mapping/
│   ├── user-mapping.controller.ts   # API endpoints
│   ├── user-mapping.entity.ts       # Database entity
│   ├── user-mapping.service.ts      # Business logic
│   └── user-mapping.module.ts       # Module definition
├── utils/
│   └── uuid.util.ts              # UUID generation utility
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## Database Entity

The `UserMapping` entity has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| id1 | VARCHAR(50) | First identifier |
| id2 | VARCHAR(50) | Second identifier |
| userID | VARCHAR(36) | Generated or stored user ID |
| createdAt | TIMESTAMP | Creation timestamp |

**Constraints:**
- `UNIQUE(id1, id2)`: Ensures no duplicate mappings exist

## Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Linting and Formatting

```bash
npm run lint
npm run format
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_HOST | localhost | MySQL database host |
| DATABASE_PORT | 3306 | MySQL database port |
| DATABASE_USER | root | MySQL username |
| DATABASE_PASSWORD | (empty) | MySQL password |
| DATABASE_NAME | user_mapping_db | Database name |
| REDIS_HOST | localhost | Redis host (optional) |
| REDIS_PORT | 6379 | Redis port (optional) |
| PORT | 3000 | Application port |

## Common Issues

### Connection Refused Error
- Ensure MySQL is running on the specified host and port
- Verify credentials in `.env` file
- Check if the database exists

### UNIQUE constraint violation
- This occurs when trying to insert duplicate id1, id2 pairs
- The application automatically handles this by returning the existing userID

## Future Enhancements

- Add Redis caching for frequently accessed mappings
- Implement pagination for bulk operations
- Add authentication/authorization
- Create reverse mapping endpoints
- Add metrics and monitoring
- Implement database migration system

## License

UNLICENSED
