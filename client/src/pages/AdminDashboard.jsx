import { useState } from 'react';
import implant1 from '../assets/implant1.jpg';
import implant2 from '../assets/implant2.jpg';
import ProgressBar from '../components/ProgressBar';

export default function AdminDashboard({ classes }) {
    const [expandedArticle, setExpandedArticle] = useState(null);

    const arr = [
        {
            img: implant1,
            Name: "Cranial Implant",
            caseId: 123,
        },
        {
            img: implant2,
            Name: "Hip implant",
            caseId: 456,
        }
    ]

    return (
        <>
            <section className={''}>
                <div aria-label="items container" className={`flex flex-col justify-center items-center ${classes}`}>
                    {arr.map((cases) => (
                        <article
                            key={cases.caseId}
                            className={`bg-blue-100 my-4 min-w-40 rounded-lg shadow-xl px-4 py-2 transition-all duration-300 ${
                                expandedArticle === cases.caseId ? 'min-h-100' : 'min-h-40'
                            }`}
                        >
                            <header aria-label="Case information header" className="flex flex-row items-center space-x-3">
                                <img src={cases.img} alt="Implant case photo" className="rounded-full h-10 max-w-12" />
                                <h2 aria-label="case name and ID" className="text-lg font-semibold">
                                    {cases.Name} case ID: CNS-{cases.caseId}
                                </h2>
                            </header>
                            <ProgressBar expandedarticle={expandedArticle} setExpandedarticle={setExpandedArticle} acase={cases}>
                            </ProgressBar>
                        </article>

                    ))}
                </div>
            </section>
        </>
    );
}