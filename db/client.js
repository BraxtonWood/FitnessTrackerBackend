const { Pool } = require('pg');

//const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/fitness-dev';

const client = new Pool({
  user: "BraxtonWood",
  host: "db.bit.io",
  database: "postgresql://BraxtonWood:v2_3z48R_khVTG84Y7mF2zJArvfMxQ3g@db.bit.io:5432/BraxtonWood/FitnessTracker",
  password: "v2_3z48R_khVTG84Y7mF2zJArvfMxQ3g",
  port: 5432,
  ssl: true
});

module.exports = client;
