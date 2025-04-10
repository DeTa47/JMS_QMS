import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataTable({ columns, data, actions, route }) {
    const navigate = useNavigate();
    // const titleCase = (s) =>
    //     s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())

    // const columnTitles = column.map((col) => titleCase(col));

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
                        {actions && <th className="px-4 py-2 border-b text-left">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr 
                            onClick={() => {navigate(route, { state: { stateData: row } })}}
                            key={rowIndex} className="hover:bg-gray-100 cursor-pointer">
                            {columns.map((col, colIndex) => (
                                <td 
                                    key={colIndex} className="px-4 py-2 border-b text-left">
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
                            {actions && (
                                <td className="px-4 py-2 border-b text-left">
                                    {actions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
