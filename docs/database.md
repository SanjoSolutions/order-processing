```sh
cd app
npx ampx sandbox secret set SQL_CONNECTION_STRING
# Enter database password retrieved from Secret Manager in AWS console.
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --out amplify/data/schema.sql.ts
```
