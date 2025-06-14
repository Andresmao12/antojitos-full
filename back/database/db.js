import sql from 'mssql'

const config = {
    user: 'MAUROAS_auth',
    password: 'andresmao1234567',
    server: 'localhost',
    database: 'bd_antojitos',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export {sql, config}
