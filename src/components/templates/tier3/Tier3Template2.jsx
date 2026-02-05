import { motion } from 'framer-motion';

const events = [
    { year: '2020', title: 'First Met', desc: 'At the coffee shop on the corner.' },
    { year: '2021', title: 'First Trip', desc: 'That weekend in Chiang Mai.' },
    { year: '2022', title: 'Moved In', desc: 'Building our little home together.' },
    { year: '2023', title: 'The Proposal', desc: 'Under the stars, you said yes.' },
];

const Tier3Template2 = ({ customTitle }) => {
    return (
        <div className="min-h-screen bg-[#111] text-white py-20 px-4 font-sans">
            <h1 className="text-4xl text-center font-playfair mb-20 text-[#E8A08A]">{customTitle || "Our Journey"}</h1>

            <div className="max-w-2xl mx-auto relative">
                {/* Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-800 -translate-x-1/2"></div>

                {events.map((evt, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className={`flex flex-col md:flex-row items-center mb-16 relative ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Dot */}
                        <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#E8A08A] -translate-x-1/2 border-4 border-[#111] z-10"></div>

                        <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 md:text-right">
                            {/* Flip content for even items on desktop if needed, logic handled by flex-row-reverse */}
                            <div className={`p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-[#E8A08A]/50 transition-colors ${idx % 2 === 0 ? 'md:text-left md:ml-12' : 'md:text-right md:mr-12'}`}>
                                <span className="text-[#E8A08A] font-bold text-xl block mb-2">{evt.year}</span>
                                <h3 className="text-2xl font-bold mb-2">{evt.title}</h3>
                                <p className="text-gray-400">{evt.desc}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2"></div> {/* Spacer */}
                    </motion.div>
                ))}

                <div className="text-center mt-20 text-gray-500">
                    To be continued...
                </div>
            </div>
        </div>
    );
};

export default Tier3Template2;
