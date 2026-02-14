import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext(null);

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within CheckoutProvider');
    }
    return context;
};

export const CheckoutProvider = ({ children, tier, onClose }) => {
    // Steps: 1=Buyer Info, 2=Template Selection, 3=Images (Tier 2-4 & Tier 1 t1-2/t1-3), 4=Payment, 5=Success
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [contentFiles, setContentFiles] = useState([]);
    const [contentPreviews, setContentPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(null);
    const [storyId, setStoryId] = useState(null);

    const [formData, setFormData] = useState({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        pin: '',
        targetName: '',
        signOff: '',
        message: '',
        customDomain: '',
    });

    // Check if Tier 1 Template 1
    const isTier1Template1 = tier?.id === 1 && selectedTemplate === 't1-1';

    // Check if Tier 1 Template 2 or 3 (Requires 1 Image)
    const isTier1ImageTemplate = tier?.id === 1 && (selectedTemplate === 't1-2' || selectedTemplate === 't1-3');

    // Max images per tier
    const getMaxImages = () => {
        if (!tier) return 0;
        if (tier.id === 1) {
            // Tier 1 Templates 2 & 3 allow 1 image
            if (selectedTemplate === 't1-2' || selectedTemplate === 't1-3') return 1;
            return 0;
        }
        if (tier.id === 2) return 5;
        if (tier.id === 3) return 10;
        if (tier.id === 4) return 30;
        return 0;
    };

    // Total steps (Tier 1 t1-1 has 3 steps, others have 4)
    const getTotalSteps = () => {
        if (tier?.id === 1) {
            // If Tier 1 and Template 2 or 3, we have 4 steps (incl. Images)
            if (selectedTemplate === 't1-2' || selectedTemplate === 't1-3') return 4;
            return 3;
        }
        return 4;
    };

    // Step labels
    const getStepLabels = () => {
        if (tier?.id === 1) {
            if (selectedTemplate === 't1-2' || selectedTemplate === 't1-3') {
                return ['ข้อมูลผู้ซื้อ', 'เลือกธีม', 'รูปภาพ', 'ชำระเงิน'];
            }
            return ['ข้อมูลผู้ซื้อ', 'เลือกธีม', 'ชำระเงิน'];
        }
        return ['ข้อมูลผู้ซื้อ', 'เลือกธีม', 'รูปภาพ', 'ชำระเงิน'];
    };

    // Progress step (for Tier 1 t1-1, step 4 = 3rd visual step)
    const getProgressStep = () => {
        if (tier?.id === 1 && selectedTemplate === 't1-1' && step === 4) return 3;
        // For t1-2/t1-3, step 4 is actually step 4
        return step;
    };

    const updateFormData = (fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
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
            customDomain: ''
        });
        setSelectedTemplate(null);
        setStoryId(null);
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

        // Computed
        isTier1Template1,
        isTier1ImageTemplate,
        getMaxImages,
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
