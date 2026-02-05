import { motion } from 'framer-motion';

const Tier4Template2 = () => {
    return (
        <div className="min-h-screen bg-[#EAEAEA] py-20 px-4 md:px-0 font-serif text-[#111]">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl min-h-[120vh] relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-end p-8 md:p-12 border-b-2 border-black">
                    <h1 className="text-8xl font-black tracking-tighter leading-none">VOGUE<br /><span className="text-2xl font-normal tracking-wide italic">Couple Edition</span></h1>
                    <div className="text-right hidden md:block">
                        <p className="font-bold">Vol. 1</p>
                        <p>Feb 2026</p>
                        <p>$ Priceless</p>
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2670&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Couple"
                    />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent w-full text-white">
                        <h2 className="text-6xl md:text-7xl font-playfair italic">Timeless</h2>
                        <p className="text-xl mt-4 max-w-md">"How they turned a simple coffee date into a lifetime of adventure."</p>
                    </div>
                </div>

                {/* Content Cols */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12">
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold mb-4 uppercase">The Beginning</h3>
                        <p className="text-justify text-gray-600 leading-relaxed font-sans text-sm">
                            It started with a swipe right, but ended up being the rightest swipe of their lives.
                            From late night talks to early morning walks, every moment builds up to this very second.
                        </p>
                    </div>
                    <div className="md:col-span-1">
                        <div className="h-40 bg-gray-200 mb-4 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=400" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-lg">"She said Yes"</h4>
                    </div>
                    <div className="md:col-span-1 border-l pl-8 border-black hidden md:block">
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
                            <li>01. The Date</li>
                            <li>02. The Trip</li>
                            <li>03. The Ring</li>
                            <li>04. The Vows</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tier4Template2;
