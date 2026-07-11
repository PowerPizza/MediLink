## Development notes:-
**Database Requirements**
* Using `SQLAlchemy` for ORM
* Using `psycopg` as it's official postgres database connector for python.
* Using `alembic` for database migrations - updating existing table's DDL etc...

## Environment variable configurations
While deploying or running the project the .env file should present in root of backend which shoud have these variables:-
```
SENDER_MAIL_PASSWORD=<APP PASSWORD OF GMAIL, TO SEND MAIL>
SENDER_MAIL=<GMAIL ADDRESS FOR WHICH PASSWORD IS PROVIDED ABOVE>
DATABASE_DRIVER_PREFIX=<MUST BE postgresql+psycopg://>
DATABASE_CONNECTION_URL=<POSTGRES CONNECTION URL WITHOUT postgresql:// PREFIX>
SUPER_SECRET_KEY=<ANY 32 LENGTH STRING OF RANDOM CHARACTERS>
SUPABASE_URL=<SUPABASE APP URL>
SUPABASE_SECRET_KEY=<SUPABASE SECRET KEY (NON ANON KEY)>
```
All these info must be kept private to admin only.
