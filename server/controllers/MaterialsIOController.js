const db = require('../config/config');

const createMaterialIO = async (req, res) => {
    const { materialIO, material_id } = req.body;

    console.log('Material IO:', materialIO);
    console.log('Material ID:', material_id);

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        if (materialIO.length === 0) {
            return res.status(400).json({ message: 'No material IO data provided' });
        }

        const errors = [];
        const successes = [];

        for (const material of materialIO) {
            const { purpose, outward_date, in_stock, outward_qty, stock_qty, recieved_by, given_by, remarks } = material;


            try {

                const query = `INSERT INTO material_outwarded (purpose, outward_date, in_stock, outward_qty, stock_qty, recieved_by, given_by, remarks, material_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                await db.query(query, [purpose, outward_date, in_stock, outward_qty, stock_qty, recieved_by, given_by, remarks, material_id]);

                successes.push({ message: 'Material IO created successfully', material_id });
            } catch (error) {
                errors.push({ message: 'Database insert failed', material, error });
            }
        }

        await connection.commit();

        res.status(200).json({ successes, errors });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating Material IO:', error);
        res.status(500).json({ error: 'Failed to create Material IO', err: error });
    }   
}

const updateMaterialIO = async (req, res) => {
    const { materialIO } = req.body;

    console.log('Material IO:', materialIO);

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        if (materialIO.length === 0) {
            return res.status(400).json({ message: 'No material IO data provided' });
        }

        const errors = [];
        const successes = [];

        for (const material of materialIO) {
            const { OW_id, purpose, outward_date, in_stock, outward_qty, stock_qty, recieved_by, given_by, remarks } = material;


            try {

                const query2 = `UPDATE material_outwarded SET purpose = ? outward_date = ? in_stock = ? outward_qty = ? stock_qty = ? recieved_by = ? given_by = ? remarks = ? WHERE OW_id = ?`;
                await db.query(query2, [purpose, outward_date, in_stock, outward_qty, stock_qty, recieved_by, given_by, remarks, OW_id]);

                successes.push({ message: 'Material IO updated successfully', material_id });
            } catch (error) {
                errors.push({ message: 'Database update failed', material, error });
            }
        }

        await connection.commit();

        res.status(200).json({ successes, errors });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating Material IO:', error);
        res.status(500).json({ error: 'Failed to update Material IO', err: error });
    }
}

const getMaterialIOById = async (req, res) => {

    const material_id = req.body.material_id;

    try {
        
         const query = `SELECT mo.OW_id, mo.material_id, mo.purpose, mo.outward_date, mo.in_stock, mo.outward_qty, mo.stock_qty, mo.recieved_by, mo.given_by, mo.remarks
                        FROM material m 
                        LEFT JOIN material_outwarded mo ON mo.material_id = m.material_id
                        WHERE m.material_id = ?`;

         const [rows] = await db.query(query, [material_id]);

         const iirquery = `SELECT mir.iir_iid from material_iir mir INNER JOIN material m ON m.material_id = mir.material_id where m.material_id = ?`;

         const [iirrows] = await db.query(iirquery, [material_id]);

         const mi_query= `SELECT mi.inward_date, mi.inwarded_by, mi.approved_qty, mi.rejected_qty
                          FROM material m 
                          INNER JOIN material_inwarded mi ON mi.material_id = m.material_id
                          WHERE m.material_id = ?`;
        const [mirows] = await db.query(mi_query, [material_id]);

        if (rows.length === 0) {
                return res.status(404).json({ message: 'Material IO not found' }); 
        }

        res.status(200).json({
            iir_number: iirrows[0]?.iir_iid,
            mi_details: mirows[0],
            rows});

    } catch (error) {
        res.status(500).json({ errormsg: 'Failed to fetch material IO', err: error });
    }

}

module.exports = { getMaterialIOById, updateMaterialIO, createMaterialIO }