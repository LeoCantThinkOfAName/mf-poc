module.exports = {
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST,
  autoLoadEntities: true,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/migration/*.js'],
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  cli: {
    migrationsDir: 'migration',
  },
  seeds: ['dist/**/seeds/*.js'],
  factories: ['dist/**/*.factory.js'],
  ...(process.env.NODE_ENV === 'production'
    ? {
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : null),
};
