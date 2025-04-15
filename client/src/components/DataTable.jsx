import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataTable({ columns, data, actions, route }) {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200">
                        {columns.map((col, index) => (
                            <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                {col.label}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            onClick={() => {navigate(route, { state: { stateData: row } })}}
                            key={rowIndex}
                            className={`hover:bg-gray-100 cursor-pointer ${
                                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 text-sm text-gray-700 border-b">
                                    {row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-4 py-2 text-sm text-gray-700 border-b">
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
