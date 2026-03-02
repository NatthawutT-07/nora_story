import { createContext, useContext, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

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
            { label: '', desc: '' },
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
    // Both T1-1 and T2 templates use the same detail fields (PIN, target name, message, sign off)
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

    // Check if this template needs image upload
    const needsImageStep = () => {
        if (!tier) return false;
        if (String(tier?.id) === '1' && selectedTemplate === 't1-1') return false;
        return true;
    };

    // Always 5 visual steps (details + images for all, or just details for t1-1)
    const getTotalSteps = () => 5;

    // Step labels  
    const getStepLabels = () => {
        return ['ข้อมูล', 'เลือกธีม', 'รายละเอียด', 'รูปภาพ', 'ชำระเงิน'];
    };

    // Progress step mapping
    const getProgressStep = () => {
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
