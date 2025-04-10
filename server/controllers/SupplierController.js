const db = require('../config/config.js');

const createSupplier = async (req, res) => {
    try {
        const { supplier_id, supplier_name, supplier_bno, supplier_type, active, po_number, location } = req.body.data;

        if (!supplier_id || !supplier_name || !supplier_type) {
            return res.status(500).send({
                success: false,
                message: "Incomplete Data"
            });
        }

        const columns = ['supplier_id', 'supplier_name', 'supplier_type'];
        const values = [supplier_id, supplier_name, supplier_type];

        if (active !== undefined) {
            columns.push('active');
            values.push(active);
        }
        if (location !== undefined) {
            columns.push('location');
            values.push(location);
        }

        const placeholders = values.map(() => '?').join(', ');
        const query = `INSERT INTO SUPPLIER (${columns.join(', ')}) VALUES (${placeholders})`;

        const data = await db.query(query, values);

        return res.status(200).send({
            success: true,
            message: "Data created",
            data: data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: error
        });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const query = 'SELECT * FROM supplier where active = 1';
        const data = await db.query(query);
        
        
        return res.status(200).send({
            success: true,
            message: "Data retrieved",
            data: data[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: error
        });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { supplier_id } = req.body;

        if (!supplier_id) {
            return res.status(500).send({
                success: false,
                message: "Supplier ID is required"
            });
        }

        const query = 'DELETE FROM SUPPLIER WHERE supplier_id = ?';
        await db.query(query, [supplier_id]);

        return res.status(200).send({
            success: true,
            message: "Supplier deleted"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: error
        });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { supplier_id, supplier_name, supplier_bno, supplier_type, active, po_number, location } = req.body;

        if (!supplier_id) {
            return res.status(500).send({
                success: false,
                message: "Supplier ID is required"
            });
        }

        const updates = [];
        const values = [];

        if (supplier_name !== undefined) {
            updates.push('supplier_name = ?');
            values.push(supplier_name);
        }
        if (supplier_bno !== undefined) {
            updates.push('supplier_bno = ?');
            values.push(supplier_bno);
        }
        if (supplier_type !== undefined) {
            updates.push('supplier_type = ?');
            values.push(supplier_type);
        }
        if (active !== undefined) {
            updates.push('active = ?');
            values.push(active);
        }
        if (po_number !== undefined) {
            updates.push('po_number = ?');
            values.push(po_number);
        }
        if (location !== undefined) {
            updates.push('location = ?');
            values.push(location);
        }

        if (updates.length === 0) {
            return res.status(500).send({
                success: false,
                message: "No fields to update"
            });
        }

        values.push(supplier_id);
        const query = `UPDATE SUPPLIER SET ${updates.join(', ')} WHERE supplier_id = ?`;
        await db.query(query, values);

        return res.status(200).send({
            success: true,
            message: "Supplier updated"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: error
        });
    }
};

module.exports = { createSupplier, getSuppliers, deleteSupplier, updateSupplier };