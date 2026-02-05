import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const tierData = {
    t1: { name: 'Basic Memory', description: 'Simple, textual, and elegant.', demos: [1, 2, 3, 4, 5, 6, 7] },
    t2: { name: 'Standard Love', description: 'Music, Photos, and warmth.', demos: [1, 2, 3, 4, 5, 6] },
    t3: { name: 'Premium Valentine', description: 'Interactive, animated experiences.', demos: [1, 2, 3, 4, 5, 6] },
    t4: { name: 'Lifetime Archive', description: 'Cinematic, story-driven masterpieces.', demos: [1, 2, 3, 4, 5, 6] }
};

const TierGallery = ({ tierIdProp, onBack, onSelectDemo }) => {
    const { tierId: tierIdParam } = useParams();
    const navigate = useNavigate();

    // Use prop if available (Seamless mode), otherwise URL param (Direct link mode)
    const tierId = tierIdProp || tierIdParam;
    const tier = tierData[tierId];

    if (!tier) return <div>Tier not found</div>;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-[#1A3C40] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-[#1A3C40] mb-6 md:mb-8 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </button>

            <header className="mb-8 md:mb-12">
                <h1 className="text-2xl md:text-4xl font-playfair font-bold mb-2">{tier.name} <span className="text-[#E8A08A] italic">Examples</span></h1>
                <p className="text-gray-500 text-base md:text-lg">{tier.description}</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {tier.demos.map(id => (
                    <div
                        key={id}
                        onClick={() => onSelectDemo ? onSelectDemo(id) : navigate(`/demo/${tierId}/${id}`)}
                        className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                    >
                        {/* Preview Placeholder */}
                        <div className="h-48 md:h-64 bg-gray-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-5xl opacity-20">
                                {id}
                            </div>
                            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-[#1A3C40]">
                                Style 0{id}
                            </div>
                        </div>
                        <div className="p-6 bg-white">
                            <h3 className="text-xl font-bold mb-1">Style {id}</h3>
                            <p className="text-sm text-gray-400">Click to view full demo</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TierGallery;
