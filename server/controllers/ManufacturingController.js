const db = require('../config/config');

const createData = async (req, res) => {
    const { product_name, material_id, quantity } = req.body;

    if (!product_name || !material_id || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check if material exists and has sufficient stock
        const [material] = await connection.query(
            'SELECT stock_quantity FROM material WHERE material_id = ?',
            [material_id]
        );

        if (material.length === 0) {
            throw new Error('Material not found');
        }

        if (material[0].stock_quantity < quantity) {
            throw new Error('Insufficient stock quantity');
        }

        // Insert into manufacturing table
        await connection.query(
            'INSERT INTO manufacturing (product_name, material_id, quantity) VALUES (?, ?, ?)',
            [product_name, material_id, quantity]
        );

        // Update stock_quantity in material table
        await connection.query(
            'UPDATE material SET stock_quantity = stock_quantity - ? WHERE material_id = ?',
            [quantity, material_id]
        );

        // Insert into material_outwarded table
        await connection.query(
            'INSERT INTO material_outwarded (material_id, outward_qty) VALUES (?, ?)',
            [material_id, quantity]
        );

        await connection.commit();
        res.status(201).json({ message: 'Data created successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

const getManufacturingData = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT mfg.product_name, mfg.quantity, mat.material_name
            FROM manufacturing mfg
            JOIN material mat ON mfg.material_id = mat.material_id
        `);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

module.exports = { createData, getManufacturingData };
