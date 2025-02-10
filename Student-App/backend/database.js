const sql = require('mssql');
const config = {
    user: 'dbuser',         // SQL Server username
    password: 'Agarsha@8',     // SQL Server password
    server: 'DESKTOP-MLHKBFD',           // SQL Server host
    database: 'student',            // Database name
    options: {
        encrypt: false,            // Set true if using Azure
        trustServerCertificate: true // For development
    }
};
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed: ', err);
    });

module.exports = {
    sql,
    poolPromise
};


