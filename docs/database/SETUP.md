# Database Setup Guide

## Prerequisites
- PostgreSQL installed and running
- Access to PostgreSQL command line or GUI tool (pgAdmin)

## Setup Steps

### 1. Create the Database

Connect to PostgreSQL and run:

```sql
CREATE DATABASE elwaseet_db;
```

### 2. Run the Schema SQL

Open PostgreSQL (psql, pgAdmin, or DBeaver) and connect to `elwaseet_db`, then:
- Open `elwaseet_schema.sql` from `docs/database/`
- Copy and paste the entire SQL content into PostgreSQL
- Run it to create all tables

This will create the necessary database tables.

### 3. Configure Database Connection

Update your local `application.properties` file in `backend/src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/elwaseet_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
```

**Note:** Use `application-example.properties` as a template. Never commit `application.properties` to git.

### 4. Run the Application

Start the Spring Boot application. It will connect to the database with the tables you created.

## Troubleshooting

**Q: Database connection refused?**
- Ensure PostgreSQL is running
- Check the database URL, username, and password in `application.properties`

**Q: Table doesn't exist error?**
- Make sure you ran the SQL schema file in PostgreSQL
- Verify all SQL commands executed without errors

**Q: Want to reset the database?**
```sql
DROP DATABASE elwaseet_db;
CREATE DATABASE elwaseet_db;
```

Then re-run the SQL schema file to recreate tables.

## Schema File
- `elwaseet_schema.sql` - Contains all SQL statements to create the database tables. Copy and paste this into PostgreSQL to set up the schema.

## Schema Files
- `elwaseet_schema.sql` - Reference schema documentation
- Migration files in `src/main/resources/db/migration/` - Automatically executed by Flyway
