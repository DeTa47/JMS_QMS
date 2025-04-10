import React from 'react';

export default function IIRDataTable() {
    const columns = [
        { label: 'IIR Number', key: 'iirNumber' },
        { label: 'Test', key: 'test' },
        { label: 'Specification', key: 'specification' },
        { label: 'Checked By', key: 'checkedBy' },
        { label: 'Approved By', key: 'approvedBy' },
        { label: 'Observation 1', key: 'observation1', type: 'checkbox' },
        { label: 'Observation 2', key: 'observation2', type: 'checkbox' },
        { label: 'Observation 3', key: 'observation3', type: 'checkbox' },
        { label: 'Observation 4', key: 'observation4', type: 'checkbox' },
        { label: 'Observation 5', key: 'observation5', type: 'checkbox' },
        { label: 'Observation 6', key: 'observation6', type: 'checkbox' },
    ];

    const data = [
        {
            iirNumber: 6,
            test: '',
            specification: '',
            checkedBy: 'XYZ',
            approvedBy: 'ABC',
            observation1: 0,
            observation2: 0,
            observation3: 0,
            observation4: 0,
            observation5: 0,
            observation6: 0,
        },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="px-4 py-2 border-b text-left">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-100">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 border-b text-left">
                                    {col.type === 'checkbox' ? (
                                        <input
                                            type="checkbox"
                                            checked={row[col.key] === 1}
                                            readOnly
                                        />
                                    ) : (
                                        row[col.key]
                                    )}
                                </td>
                            ))}
                            <td className="px-4 py-2 border-b text-left">
                                <button className="text-blue-500 hover:underline">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
