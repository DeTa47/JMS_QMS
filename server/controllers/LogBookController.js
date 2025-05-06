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

const getMonthlyLogbooks = async (req, res) => {
    const { logbookid } = req.body;
    console.log('Logbook ID:', logbookid);
    try {
        const [rows] = await db.query('SELECT * FROM log_book_monthly WHERE logbookid = ?', [logbookid]);


        return res.status(200).json(rows);
        
    } catch (error) {
        console.error('Error fetching monthly logbooks:', error);
        res.status(500).json({ error: 'Failed to fetch monthly logbooks' });
    }
}

const getLogbookdata = async (req, res) => {
    const { logbookid, logbookmid } = req.body;
    
    try {

        const logbookQuery = 'SELECT log_book_field_id, log_book_field FROM log_book_fields WHERE logbookid = ?';

        const [logbookfields] = await db.query(logbookQuery, [logbookid]);

        const query = ` select lgbfv.case_id, lgbfv.logbook_values, lgbf.log_book_field
                        from logbook_field_values lgbfv
                        INNER JOIN log_book_fields lgbf ON lgbf.log_book_field_id = lgbfv.log_book_field_id
                        where lgbfv.log_book_monthly_id = ?`;
        
        const [rows] = await db.query(query, [logbookmid]);


        console.log('Logbook data:', {fields:rows, logbookfields: logbookfields});

        res.status(200).json({fields:rows, logbookfields: logbookfields});

        
    } catch (error) {
        console.error('Error fetching logbook fields:', error);
        res.status(500).json({ error: 'Failed to fetch logbook fields' });
    }
}


const updateValues = async (req, res) => {
    const { fields } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        for (let field of fields) {
            let case_id = field.case_id;
            let fields = field.fields;

            console.log('Fields:', field);

            for (let field of fields) {
                const updateQuery = 'UPDATE logbook_field_values SET logbook_values = ? WHERE log_book_field_id = ? AND case_id = ? AND log_book_monthly_id = ?';
                await connection.query(updateQuery, [field.value, field.field_id, case_id, field.logbookmid]);
            }
        }

        await connection.commit();
        res.status(200).json({ message: 'Logbook updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating logbook:', error);
        res.status(500).json({ error: 'Failed to update logbook' });
    } finally {
        connection.release();
    }
}

const insertValues = async (req, res) => {
    const {fields} = req.body;
    const connection = await db.getConnection();

    try{

        await connection.beginTransaction();

        for(let field of fields){

            let case_id = field.case_id;
            let fields = field.fields;

            for (let field of fields) {

                const insertQuery = 'INSERT INTO logbook_field_values (logbook_values, log_book_field_id, case_id, log_book_monthly_id) VALUES (?, ?, ?, ?)';
                await connection.query(insertQuery, [field.value, field.field_id, case_id, field.logbookmid ]);
            }
        }
        
        await connection.commit();

        res.status(201).json({ message: 'Logbook created successfully'});
        
    } catch(error){
        await connection.rollback();
        console.error('Error creating logbook:', error);
        res.status(500).json({ error: 'Failed to create logbook' });
    }
    finally {
        connection.release();
    }
}

const createLogBookById = async (req, res) => {
    const { logbookid, date } = req.body;

    try {

        const insertQuery = 'INSERT INTO log_book_monthly (logbook_date, logbookid) VALUES (?, ?)';
        const [result] = await db.query(insertQuery, [date, logbookid]);
        const logbookmid = result.insertId;

        res.status(201).json({ message: 'Logbook created successfully', id: logbookmid });

    }catch(error) {
        console.error('Error creating logbook:', error);
        res.status(500).json({ error: 'Failed to create logbook' });
    }

}

const createLogBook = async (req, res) => {
    const { equipment_id, equipment_name, make, title, status, logbook_date } = req.body;
    const fields = req.body.fields || [];

    console.log('Request body', req.body);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insert into logbooks table
        const insertQuery = 'INSERT INTO logbooks (equipment_id, equipment_name, make, title, status) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.query(insertQuery, [equipment_id, equipment_name, make, title, status]);
        const logbookId = result.insertId;

        // Insert into log_book_monthly table
        const insertLogbookMQuery = 'INSERT INTO log_book_monthly (logbook_date, logbookid) VALUES (?, ?)';
        const [logbookMResult] = await connection.query(insertLogbookMQuery, [logbook_date, logbookId]);
        const logbookMid = logbookMResult.insertId;

        // Insert fields into log_book_fields table
        for (const field of fields) {
            const insertFieldQuery = 'INSERT INTO log_book_fields (log_book_field, logbookid) VALUES (?, ?)';
            await connection.query(insertFieldQuery, [field, logbookId]);
        }

        // Commit the transaction
        await connection.commit();

        res.status(201).json({ message: 'Logbook created successfully', logbookId, logbookMid });
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error('Error creating logbook:', error);
        res.status(500).json({ error: 'Failed to create logbook' });
    } finally {
        // Release the connection
        connection.release();
    }
};

 module.exports = { getLogbooks, createLogBook, createLogBookById, insertValues, getMonthlyLogbooks, getLogbookdata, updateValues };