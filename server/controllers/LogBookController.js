const db = require('../config/config');

const getLogbooks = async (req, res) => { 


    try{
        const [rows] = await db.query('SELECT * FROM logbooks');
        res.status(200).json(rows);
    }


    catch(error){
        console.error('Error fetching logbooks:', error);
        res.status(500).json({ error: 'Failed to fetch logbooks' });
        
    }

}

createMonthlyLogBook = async (req, res) => {  
    
 }

const createLogBookById = async (req, res) => {
    const { logbookid } = req.body.id;

    const { fields, values} = req.body;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const insertQuery = 'INSERT INTO log_book_monthly (logbookid) VALUES (?)';
        const [result] = await connection.query(insertQuery, [logbookid]);
        const logbookId = result.insertId;

        for (const field of fields) { 

            const insertFieldQuery = 'INSERT INTO log_book_monthly_fields (log_book_field, logbookmid) VALUES (?, ?)';
            await connection.query(insertFieldQuery, [logbookId, field]);

        }

        res.status(201).json({ message: 'Logbook created successfully', id: result.insertId });

    }catch(error) {
        connection.rollback();
        console.error('Error creating logbook:', error);
        res.status(500).json({ error: 'Failed to create logbook' });
    }

}

const createLogBook = async (req, res) => {
    
    const { logbookid, equipment_id, equipment_name, make, title, status, logbook_date} = req.body;

    const fields = req.body.fields || [];

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const insertQuery = 'INSERT INTO logbooks (logbookid, equipment_id, equipment_name, make, title, status) values (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(insertQuery, [logbookid, equipment_id, equipment_name, make, title, status]);
        const logbookId = result.insertId;

        const insertLogbookMQuery =  'INSERT INTO log_book_monthly (logbook_date, logbookid) VALUES (?, ?)';
        const [logbookMResult] = await connection.query(insertLogbookMQuery, [logbook_date, logbookId]);

        const logboookmid = logbookMResult.insertId;

        for (const field of fields) { 

            const insertFieldQuery = 'INSERT INTO log_book_monthly_fields (log_book_field, logbookmid) VALUES (?, ?)';
            await connection.query(insertFieldQuery, [logboookmid, field]);

        }

        res.status(201).json({ message: 'Logbook created successfully', id: result.insertId });
    } catch (error) {
        connection.rollback();
        console.error('Error creating logbook:', error);
        res.status(500).json({ error: 'Failed to create logbook' });
    }
}

 module.exports = { getLogbooks };