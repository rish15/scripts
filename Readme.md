## Script to create databases in an RDS 
Logins into the db with default user i.e postgres and creates dbs and role and grants all privilege to the created role on the db. Upon successful creation creates a .csv file with details of the database and role along with postgres connection string. 

### env contents
---
```
rds_host=""
rds_username=""
rds_password=""
db_env=""
```
