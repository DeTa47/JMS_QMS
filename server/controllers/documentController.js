const mysqlPool = require('../config/config');

const getDocumentDetails = async (req, res) => {
    const { document_type } = req.body;

    try {
        let query = '';
        let params = [];

        // Conditional logic for different document types
        if (document_type === 'IIR') {
            query = `
                SELECT d.document_number, d.issue_number, d.reference_standard, d.effective_date
                FROM iir_document id
                JOIN documents d ON id.document_id = d.document_id
                WHERE id.iir_id = ?;
            `;
            params = [req.body.iir_id];
        } else if (document_type === 'GRN') {
            console.log('GRN ID:', req.body.grn_id); // Debugging line
            query = `
                SELECT d.document_number, d.issue_number, d.reference_standard, d.effective_date
                FROM grn_document gd
                JOIN documents d ON gd.document_id = d.document_id
                WHERE gd.grn_id = ?;
            `;
            params = [req.body.grn_id];
        } else {
            return res.status(400).json({ error: 'Invalid document type' });
        }

        const [rows] = await mysqlPool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching document details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllDocuments = async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM documents');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching all documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDocumentById = async (req, res) => {
    const { document_id } = req.params;

    try {
        const [rows] = await mysqlPool.query('SELECT * FROM documents WHERE document_id = ?', [document_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching document by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createDocument = async (req, res) => {
    const {
        document_number, issue_number, revision_number, reference_standard, document_type,
        effective_date, company_seal, prepared_by, prepared_date, prepared_sign,
        reviewed_by, reviewed_date, reviewed_sign, approved_by, approved_date, approved_sign
    } = req.body;

    try {
        const [result] = await mysqlPool.query(
            `INSERT INTO documents (
                document_number, issue_number, revision_number, reference_standard, document_type,
                effective_date, company_seal, prepared_by, prepared_date, prepared_sign,
                reviewed_by, reviewed_date, reviewed_sign, approved_by, approved_date, approved_sign
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                document_number, issue_number, revision_number, reference_standard, document_type,
                effective_date, company_seal, prepared_by, prepared_date, prepared_sign,
                reviewed_by, reviewed_date, reviewed_sign, approved_by, approved_date, approved_sign
            ]
        );
        res.status(201).json({ message: 'Document created successfully', document_id: result.insertId });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateDocument = async (req, res) => {
    const { document_id } = req.params;
    const {
        document_number, issue_number, revision_number, reference_standard, document_type,
        effective_date, company_seal, prepared_by, prepared_date, prepared_sign,
        reviewed_by, reviewed_date, reviewed_sign, approved_by, approved_date, approved_sign
    } = req.body;

    try {
        const [result] = await mysqlPool.query(
            `UPDATE documents SET
                document_number = ?, issue_number = ?, revision_number = ?, reference_standard = ?, document_type = ?,
                effective_date = ?, company_seal = ?, prepared_by = ?, prepared_date = ?, prepared_sign = ?,
                reviewed_by = ?, reviewed_date = ?, reviewed_sign = ?, approved_by = ?, approved_date = ?, approved_sign = ?
            WHERE document_id = ?`,
            [
                document_number, issue_number, revision_number, reference_standard, document_type,
                effective_date, company_seal, prepared_by, prepared_date, prepared_sign,
                reviewed_by, reviewed_date, reviewed_sign, approved_by, approved_date, approved_sign,
                document_id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json({ message: 'Document updated successfully' });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDocument = async (req, res) => {
    const { document_id } = req.params;

    try {
        const [result] = await mysqlPool.query('DELETE FROM documents WHERE document_id = ?', [document_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getDocumentDetails,
    getAllDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};
