import { createContext, useContext, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getPalettesForTier } from '../../lib/colorPalettes';

const CheckoutContext = createContext(null);

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within CheckoutProvider');
    }
    return context;
};

export const CheckoutProvider = ({ children, tier, onClose }) => {
    // Steps: 1=Buyer Info, 2=Template Selection, 3=Template Details, 4=Images, 5=Payment, 6=Success
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedColorTheme, setSelectedColorTheme] = useState(() => {
        const palettes = getPalettesForTier(tier?.id);
        // For Tier 2, use a bright color instead of the dark default
        if (String(tier?.id) === '2') {
            return {
                id: 'bright-rose',
                name: 'Bright Rose',
                colors: {
                    bg: '#fdf2f8', bgAlt: '#fff1f2',
                    primary: '#f43f5e', secondary: '#fb7185', accent: '#fda4af',
                    text: '#881337', textLight: '#9f1239',
                    gradient: ['#4c1d95', '#be185d', '#f43f5e'],
                    confetti: ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'],
                }
            };
        }
        return palettes[0] || null;
    });
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [contentFiles, setContentFiles] = useState([]);
    const [contentPreviews, setContentPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(null);
    const [storyId, setStoryId] = useState(null);
    const [isDomainAvailable, setIsDomainAvailable] = useState(null);
    const [qrExpired, setQrExpired] = useState(false);

    const [formData, setFormData] = useState({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        pin: '',
        targetName: '',
        signOff: '',
        message: '',
        customDomain: '',
        // Tier 3 timeline fields (5 slots)
        timelines: [
            { label: '', desc: '' },
            { label: '', desc: '' },
            { label: '', desc: '' },
            { label: 'Memories', desc: 'All our moments...' },
            { label: '', desc: '' },
        ],
        finaleMessage: '',
        finaleSignOff: '',
        musicUrl: '',
    });

    // Check template tier type
    const isTier1Template1 = String(tier?.id) === '1' && selectedTemplate === 't1-1';
    const isTier2 = String(tier?.id) === '2';
    const isTier3 = String(tier?.id) === '3';
    // Tier 1 uses Template1Fields (for t1-1) or no extra details if we removed t1-4.
    // T2 templates use Template1Fields as well.
    const needsDetailFields = isTier1Template1 || isTier2;
    // Tier 3 uses timeline fields
    const needsTimelineFields = isTier3;

    // Max images per tier
    const getMaxImages = () => {
        if (!tier) return 0;
        if (String(tier?.id) === '1') {
            if (selectedTemplate === 't1-2' || selectedTemplate === 't1-3') return 1;
            return 0;
        }
        if (String(tier?.id) === '2') return 5;
        if (String(tier?.id) === '3') return 10;
        return 0;
    };

    // Max file size per image (in bytes)
    const getMaxFileSize = () => {
        return 4 * 1024 * 1024; // 4MB
    };

    // Step calculation based on whether images are needed
    const needsImageStep = () => {
        return getMaxImages() > 0;
    };

    // Dynamic total steps: 4 if no images, 5 if images needed
    const getTotalSteps = () => needsImageStep() ? 5 : 4;

    // Step labels - skip 'รูปภาพ' if not needed
    const getStepLabels = () => {
        if (needsImageStep()) {
            return ['เลือกธีม', 'ข้อมูล', 'รายละเอียด', 'รูปภาพ', 'ชำระเงิน'];
        }
        return ['เลือกธีม', 'ข้อมูล', 'รายละเอียด', 'ชำระเงิน'];
    };

    // Progress step mapping - adjusts when skipping image step
    const getProgressStep = () => {
        if (!needsImageStep() && step >= 4) {
            return step - 1; // Shift step numbers when skipping image step
        }
        return step;
    };

    const checkDomainAvailability = async (domain) => {
        if (!domain) return false;
        try {
            const docRef = doc(db, 'orders', domain);
            const docSnap = await getDoc(docRef);
            const available = !docSnap.exists();
            setIsDomainAvailable(available);
            return available;
        } catch (err) {
            console.error("Error checking domain:", err);
            return false;
        }
    };

    const updateFormData = (fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
        if (error) setError('');
    };

    const resetAll = () => {
        setStep(1);
        setSlipFile(null);
        setSlipPreview(null);
        setContentFiles([]);
        setContentPreviews([]);
        setLoading(false);
        setError('');
        setFormData({
            buyerName: '', buyerEmail: '', buyerPhone: '',
            pin: '', targetName: '', signOff: '', message: '',
            customDomain: '',
            timelines: [
                { label: '', desc: '' },
                { label: '', desc: '' },
                { label: '', desc: '' },
                { label: '', desc: '' },
                { label: '', desc: '' },
            ],
            finaleMessage: '',
            finaleSignOff: '',
        });
        setSelectedTemplate(null);
        const palettes = getPalettesForTier(tier?.id);
        setSelectedColorTheme(palettes[0] || null);
        setStoryId(null);
        setQrExpired(false);
    };

    const handleClose = () => {
        resetAll();
        onClose();
    };

    const value = {
        // State
        tier,
        step,
        setStep,
        formData,
        updateFormData,
        selectedTemplate,
        setSelectedTemplate,
        selectedColorTheme,
        setSelectedColorTheme,
        slipFile,
        setSlipFile,
        slipPreview,
        setSlipPreview,
        contentFiles,
        setContentFiles,
        contentPreviews,
        setContentPreviews,
        loading,
        setLoading,
        error,
        setError,
        showPreview,
        setShowPreview,
        storyId,
        setStoryId,
        isDomainAvailable,
        setIsDomainAvailable,
        checkDomainAvailability,
        qrExpired,
        setQrExpired,

        // Computed
        isTier1Template1,
        isTier2,
        isTier3,
        needsDetailFields,
        needsTimelineFields,
        getMaxImages,
        getMaxFileSize,
        needsImageStep,
        getTotalSteps,
        getStepLabels,
        getProgressStep,

        // Actions
        handleClose,
        resetAll,
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
};

export default CheckoutContext;
