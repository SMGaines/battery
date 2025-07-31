const OK=0;
const ERROR_NO_SUCH_BATTERY=-1;
const ERROR_OUT_OF_STOCK=-2;

const mariadb = require('mariadb');

// Create a connection pool (recommended)
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ivansteve', // replace with your root password
  database: 'batteryDB',        // or any DB you created
  port: 7777,
  connectionLimit: 5
});

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
            `UPDATE battery 
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