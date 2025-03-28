import { useState } from "react";

export default function ProgressBar({expandedarticle, setExpandedarticle, acase}) {


    const [columnExpansion, setColumnExpansion] = useState(null);

    const toggleColumnExpansion = (articleId, columnId) => {
        
        setColumnExpansion(columnExpansion === columnId ? null : columnId);
        setExpandedarticle(columnExpansion === null ? articleId : null);
    };

    return (
        <div aria-label="progress bar" className="flex justify-between items-center mt-4">
            <div className="flex items-center w-full">  
                <div className="relative">
                    <div
                        onClick={() => toggleColumnExpansion(acase.caseId, acase.caseId)}
                        className="w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
                    >
                        <span className="text-white text-sm">✓</span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 min-w-5xl items-center flex flex-col">
                        <p className="mt-1">Store</p>
                        {columnExpansion === acase.caseId && (
                            <>
                                <div className="w-1 bg-blue-500 h-6"></div>
                                <div className="flex flex-row">
                                    <div className="w-6 h-6 ml-55 bg-blue-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="ml-2 bg-blue-100 rounded shadow">
                                        <p className="text-sm text-blue-900">GNR Generated Approved by: XYZ</p>
                                    </div>
                                </div>
                                <div className="w-1 bg-blue-500 h-6"></div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <div className="w-6 h-6 ml-18 bg-blue-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="ml-2 bg-blue-00 rounded shadow">
                                        <p className="text-sm text-blue-900">Inwarded</p>
                                    </div>
                                </div>
                                
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 h-1 bg-blue-500"></div>
                <div className="relative">
                    <div
                        onClick={() => toggleColumnExpansion( acase.caseId, acase.caseId + '_2')}
                        className="w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
                    >
                        <span className="text-white text-sm">✓</span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 min-w-5xl items-center flex flex-col">
                        <p className="mt-1">Production</p>
                        {columnExpansion === acase.caseId + '_2' && (
                            <>
                                <div className="w-1 bg-blue-500 h-6"></div>
                                <div className="flex flex-row">
                                    <div className="w-6 h-6 ml-38 bg-blue-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="ml-2 bg-blue-100 rounded shadow">
                                        <p className="text-sm text-blue-900">Recieved from supplier</p>
                                    </div>
                                </div>
                                <div className="w-1 bg-blue-500 h-6"></div>
                                <div className="flex flex-row">
                                    <div className="w-6 h-6 ml-34 bg-blue-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="ml-2 bg-blue-100 rounded shadow">
                                        <p className="text-sm text-blue-900">Quality check passed</p>
                                    </div>
                                </div>
                                <div className="w-1 bg-blue-500 h-6"></div>
                                <div className="flex flex-row">
                                    <div className="w-6 h-6 ml-43 bg-blue-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="ml-2 bg-blue-100 rounded shadow">
                                        <p className="text-sm text-blue-900">Drum polishing completed</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 h-1 bg-blue-500"></div>
                <div className="relative">
                    <div
                        onClick={() => toggleColumnExpansion(acase.caseId, acase.caseId + '_3')}
                        className="w-6 h-6 bg-red-500 rounded-full flex justify-center items-center cursor-pointer"
                    >
                        <span className="text-white text-sm">x</span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 items-center flex flex-col">
                        <p className="mt-1">QC</p>
                        {columnExpansion === acase.caseId + '_3' && (
                            <>
                                {/* Add any additional expanded content here */}
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 h-1 bg-gray-300"></div>
                <div className="relative">
                    <div
                        onClick={() => toggleColumnExpansion(acase.caseId, acase.caseId + '_4')}
                        className="w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center cursor-pointer"
                    >
                        <span className="text-gray-500 text-sm">•</span>
                    </div>
                    {columnExpansion === acase.caseId + '_4' && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 items-center flex flex-col">
                            <>
                                {/* Add any additional expanded content here */}
                            </>
                        </div>
                    )}
                </div>
                <div className="flex-1 h-1 bg-gray-300"></div>
                <div className="relative">
                    <div
                        onClick={() => toggleColumnExpansion(acase.caseId, acase.caseId + '_5')}
                        className="w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center cursor-pointer"
                    >
                        <span className="text-gray-500 text-sm">•</span>
                    </div>
                    {columnExpansion === acase.caseId + '_5' && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 items-center flex flex-col">
                            <>
                                {/* Add any additional expanded content here */}
                            </>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}