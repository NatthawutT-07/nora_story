# Checkout Module

โครงสร้าง checkout แบบ modular สำหรับ Nora.dev

## โครงสร้างไฟล์

```
checkout/
├── index.jsx              # Entry point export
├── CheckoutModal.jsx      # Main modal shell + navigation
├── CheckoutContext.jsx    # Shared state context
├── TemplateSelector.jsx   # Template selection UI
├── README.md              # คู่มือนี้
├── steps/                 # Step components
│   ├── index.js
│   ├── BuyerInfoStep.jsx  # Step 1: ข้อมูลผู้ซื้อ
│   ├── TemplateStep.jsx   # Step 2: เลือกธีม
│   ├── ImagesStep.jsx     # Step 3: อัปโหลดรูป
│   ├── PaymentStep.jsx    # Step 4: ชำระเงิน
│   └── SuccessStep.jsx    # Step 5: สำเร็จ
└── forms/                 # Tier-specific forms
    ├── index.js
    └── tier1/
        └── Template1Fields.jsx
```

## วิธีใช้งาน

```jsx
import CheckoutModal from './components/checkout';

<CheckoutModal isOpen={isOpen} onClose={handleClose} tier={selectedTier} />
```

## การเพิ่ม Form ใหม่

1. สร้างไฟล์ใน `forms/tier{N}/`
2. Export ใน `forms/index.js`
3. Import และใช้ใน `steps/TemplateStep.jsx`

## Context API

ใช้ `useCheckout()` hook เพื่อเข้าถึง state:

```jsx
const { formData, updateFormData, step, setStep, tier } = useCheckout();
```
