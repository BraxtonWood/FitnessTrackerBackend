const { Pool } = require('pg');

//const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/fitness-dev';

const client = new Pool({
  user: "BraxtonWood",
  host: "db.bit.io",
  database: "postgresql://BraxtonWood:v2_3z3x9_vix3METmW9PiewcXZPXyYKs@db.bit.io:5432/BraxtonWood/FitnessTracker",
  password: "v2_3z3x9_vix3METmW9PiewcXZPXyYKs",
  port: 5432,
  ssl: true
});

module.exports = client;
