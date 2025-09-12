import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'mauro',
    password: 'mauro',
    host: 'localhost',
    port: 3000,
    database: 'antojitos_db'
});


export { pool }
