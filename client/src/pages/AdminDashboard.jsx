import { useState } from 'react';
import implant1 from '../assets/implant1.jpg';


export default function AdminDashboard({ classes }) {
    const [expandedArticle, setExpandedArticle] = useState(null);

    const toggleVerticalExpansion = (articleId) => {
        setExpandedArticle(expandedArticle === articleId ? null : articleId);
    };

    return (
        <>
            <section className={''}>
                <div aria-label="items container" className={`flex flex-col justify-center items-center ${classes}`}>
                    {[1, 2, 3].map((articleId) => (
                        <article
                            key={articleId}
                            className={`bg-blue-100 my-4 w-93 min-w-40 rounded-md shadow-xl px-4 py-2 transition-all duration-300 ${
                                expandedArticle === articleId ? 'min-h-100' : 'min-h-40'
                            }`}
                        >
                            <header aria-label="Case information header" className="flex flex-row items-center space-x-3">
                                <img src={implant1} alt="Cranial implant case photo" className="rounded-full h-10" />
                                <h2 aria-label="case name and ID" className="text-lg font-semibold">
                                    Cranial implant case ID: CNS-{articleId}
                                </h2>
                            </header>
                            <div aria-label="progress bar" className="flex justify-between items-center mt-4">
                                <div className="flex items-center w-full">
                                    <div className="relative">
                                        <div
                                            onClick={() => toggleVerticalExpansion(articleId)}
                                            className="w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center cursor-pointer"
                                        >
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                        {expandedArticle === articleId && (
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 items-center flex flex-col">
                                                <div className="w-1 bg-blue-500 h-6"></div>
                                                <div className='flex flex-row '>
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center">
                                                        <span className="text-white text-sm">✓</span>
                                                    </div>
                                                    
                                                </div>
                                                <div className="w-1 bg-blue-500 h-6"></div>
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center">
                                                    <span className="text-white text-sm">✓</span>
                                                </div>
                                                <div className="w-1 bg-blue-500 h-6"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 h-1 bg-blue-500"></div>
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <div className="flex-1 h-1 bg-blue-500"></div>
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm">x</span>
                                    </div>
                                    <div className="flex-1 h-1 bg-gray-300"></div>
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center">
                                        <span className="text-gray-500 text-sm">•</span>
                                    </div>
                                    <div className="flex-1 h-1 bg-gray-300"></div>
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center">
                                        <span className="text-gray-500 text-sm">•</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}