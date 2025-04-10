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

module.exports = { getDocumentDetails };
