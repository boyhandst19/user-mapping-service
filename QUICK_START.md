# Quick Start Guide - User Mapping Service

## What You Have

A fully functional NestJS backend API service that maps two identifiers to unique user IDs.

## Files Overview

### Core Files Created
1. **src/user-mapping/user-mapping.controller.ts** - API endpoint handler
2. **src/user-mapping/user-mapping.service.ts** - Business logic
3. **src/user-mapping/user-mapping.entity.ts** - Database model
4. **src/user-mapping/user-mapping.module.ts** - NestJS module
5. **src/config/database.config.ts** - Database configuration
6. **src/utils/uuid.util.ts** - UUID generation utility
7. **src/app.module.ts** - Updated to include TypeORM and UserMappingModule
8. **.env** - Environment variables

### Documentation Files
- **README.md** - Full documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **IMPLEMENTATION_SUMMARY.md** - Complete implementation overview

## 60-Second Setup

### Step 1: Create Database
```bash
mysql -u root -p
CREATE DATABASE user_mapping_db;
EXIT;
```

### Step 2: Update .env
Edit `.env` and set your MySQL credentials:
```env
DATABASE_USER=root
DATABASE_PASSWORD=your_password
```

### Step 3: Run Application
```bash
cd d:\Studies_JS\Full-Stack\test-code-BE-Candidates\user-mapping-service
npm run start:dev
```

Application will start on `http://localhost:3000`

## Test the API

### Terminal Command

```bash
curl -X POST http://localhost:3000/api/user-mapping \
  -H "Content-Type: application/json" \
  -d '{"id1": "test1", "id2": "test2"}'
```

### Expected Response
```json
{
  "userID": "550e8400-e29b-41d4-a716-446655440000"
}
```

## How It Works

1. **First Request**: Generates new UUIDv4 and stores mapping
2. **Second Request** (same ids): Returns existing UUIDv4

## What's Included

✅ POST `/user-mapping` endpoint  
✅ MySQL database integration  
✅ TypeORM ORM  
✅ UUID generation  
✅ TypeScript types  
✅ Environment configuration  
✅ Error handling  
✅ Production-ready code  

## Key Endpoints

- **POST** `/api/user-mapping` - Create or get user ID mapping

## Database Schema

```sql
CREATE TABLE user_mappings (
  id VARCHAR(36) PRIMARY KEY,
  id1 VARCHAR(50) NOT NULL,
  id2 VARCHAR(50) NOT NULL,
  userID VARCHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_id1_id2 (id1, id2)
);
```

## Project Structure

```
src/
├── config/           # Configuration
├── user-mapping/     # Feature module
│   ├── controller   # API handlers
│   ├── service      # Business logic
│   ├── entity       # Database model
│   └── module       # Module definition
├── utils/           # Utilities
└── app.module.ts    # Main module
```

## Helpful Commands

```bash
# Development with auto-reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Next Steps

1. ✅ Set up database connection
2. ✅ Start the application
3. ✅ Test the API endpoint
4. ✅ Verify data in database
5. (Optional) Add Redis caching
6. (Optional) Add authentication
7. (Optional) Add validation decorators

## Troubleshooting

**Connection Refused?**
- Check MySQL is running
- Verify `.env` credentials
- Ensure database exists

**Port Already in Use?**
- Change PORT in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill`

**Build Errors?**
- Delete `node_modules` and `dist`
- Run `npm install` again
- Run `npm run build`

## Support

For more details, see:
- [README.md](README.md) - Complete documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

---

**Status**: ✅ Complete and Ready to Use

Generated: January 15, 2026
