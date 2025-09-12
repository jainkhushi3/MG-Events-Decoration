const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    port: 3306,
    database: "mgeventsdecoration",
    password: "Deepti@123",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

const connectDB = async () => {
    try {
        // Run a simple test query
        await pool.query('SELECT 1');
        console.log("MySQL Connected Successfully");
        return pool;
    } catch (error) {
        console.error("Error connecting to MySQL:", error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, pool };
