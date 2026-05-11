// import pkg from 'pg';
// const { Pool } = pkg;

// const pool = new Pool({
//     user: 'mauro',
//     password: 'mauro',
//     host: 'localhost',
//     port: 3000,
//     database: 'antojitos_db'
// });


import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    password: 'Andresmao1205',
    host: 'db.vhwrwnizskcbupmvykrx.supabase.co',
    port: 5432,
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false,
    }
});



export { pool }
