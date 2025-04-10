const db = require('../config/config'); // Assuming a database connection is configured here

const createMaterialSupplier = async (req, res) => {
    const { material_name, material_type, material_grade, stock_quantity, supplier_id, supplier_name, supplier_type, active, location, bill_number } = req.body;

    try {
        // Insert into Material table
        const [materialResult] = await db.query(
            `INSERT INTO Material (material_name, material_type, material_grade, stock_quantity) VALUES (?, ?, ?, ?)`,
            [material_name, material_type, material_grade, stock_quantity]
        );
        const material_id = materialResult.insertId;

        // Check if additional supplier data is provided
        if (supplier_name || supplier_type || active || po_number || location) {
            // Update or insert into Supplier table
            await db.query(
                `INSERT INTO Supplier (supplier_id, supplier_name, supplier_type, active, location)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 supplier_name = VALUES(supplier_name),
                 supplier_type = VALUES(supplier_type),
                 active = VALUES(active),
                 po_number = VALUES(po_number),
                 location = VALUES(location)`,
                [supplier_id, supplier_name, supplier_type, active, location]
            );
        }

        // Insert into Material_Supplier table
        await db.query(
            `INSERT INTO Material_Supplier (material_id, supplier_id, bill_number) VALUES (?, ?, ?)`,
            [material_id, supplier_id, bill_number]
        );

        res.status(201).json({ message: 'Material and supplier data inserted successfully', material_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while inserting data', error });
    }
};

const getAllMaterialsAndSuppliers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                material.material_id, 
                material.material_name, 
                material.material_type, 
                material.material_grade, 
                material.stock_quantity, 
                supplier.supplier_name, 
                supplier.supplier_type, 
                supplier.active,
                supplier.location 
            FROM material
            JOIN material_supplier ON material.material_id = material_supplier.material_id 
            JOIN supplier ON material_supplier.supplier_id = supplier.supplier_id
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch materials and suppliers' });
    }
};

module.exports = { createMaterialSupplier, getAllMaterialsAndSuppliers };
