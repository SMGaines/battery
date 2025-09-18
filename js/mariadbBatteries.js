const OK=0;
const ERROR_NO_SUCH_BATTERY=-1;
const ERROR_OUT_OF_STOCK=-2;

const mariadb = require('mariadb');

// database, table, row, column, cell  = baza danych, tabela, wiersz, kolumna, komórka

// Create a connection pool (recommended)
/* Localhost
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ivansteve', // replace with your root password
  database: 'batteryDB',        // or any DB you created
  port: 7777,
  connectionLimit: 5
});
*/
const pool = mariadb.createPool({
  host: 'serverless-northeurope.sysp0000.db3.skysql.com',
  user: 'dbpbf30486750',
  password: 'o7Q8w_odGhN{K0l571Xsw', // replace with your root password
  database: 'batteryDB',        // or any DB you created
  port: 4003,
  connectionLimit: 5
});

// serverless-northeurope.sysp0000.db3.skysql.com
// 4003
// dbpbf30486750
// o7Q8w_odGhN{K0l571Xsw
// ivanSteve1!
// o7Q8w_odGhN{K0l571Xsw
exports.initialise = function() 
{
  
}

exports.getBatteryList = async function(marka) 
{
    let conn;
    try 
    {
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT * FROM battery WHERE marka = ?`,
            [marka]
        );

        return rows; // Returns an array of records
    } 
    catch (err) 
    {
        console.error('Error fetching battery list:', err);
        return null; // Or throw err if you prefer to handle upstream
    } finally {
        if (conn) conn.release();
    }
};

exports.buyBattery = async function(anID) 
{
    let conn;
    try 
    {
        conn = await pool.getConnection();

        // Decrement only if available > 0
        const result = await conn.query(
            `select battery 
             SET available = available - 1 
             WHERE id = ? AND available > 0`,
            [anID]
        );

        // result.affectedRows will be 1 if successful, 0 if no rows were updated
        if (result.affectedRows === 0) {
            return ERROR_OUT_OF_STOCK;
        }

        return OK;
    } 
    catch (err) 
    {
        console.error('Error buying battery:', err);
        return ERROR_OUT_OF_STOCK;
    } 
    finally 
    {
        if (conn) conn.release();
    }
};

exports.addBatteryType=async function(brand, price, available, length, width, height, ampere, amp) 
{
    try 
    {
        const conn = await pool.getConnection();
        await conn.query(
        `INSERT INTO battery 
        (marka, price, available, length, width, height, amper, amp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [brand, price, available, length, width, height, ampere, amp]
        );
        conn.release();
        return 0;
    } 
    catch (err) 
    {
        console.error('Error adding battery type:', err);
        return err;
    }
}