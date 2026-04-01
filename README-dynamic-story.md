# ระบบ Dynamic Story URL - NoraStory

## ภาพรวมระบบ

ระบบนี้ช่วยให้ลูกค้าแต่ละคนมี "ลิงก์ส่วนตัว" เพื่อเข้าดูหน้าเว็บไซต์ที่สร้างขึ้นให้เฉพาะตัว พร้อมระบบจัดการและหลังบ้าน (Admin Dashboard)

### รูปแบบลิงก์ที่รองรับ

| แพ็คเกจ | รูปแบบลิงก์ | ตัวอย่าง |
|---------|------------|----------|
| Tier 1-3 | `norastory.com/<รหัส 10 ตัว>` | `norastory.com/AbC12xYz9Q` |
| Tier 4 (VIP) | `<ชื่อ>.norastory.com` | `joy.norastory.com` |

---

## โครงสร้างโปรเจกต์

ปัจจุบันโปรเจกต์แบ่งเป็น 2 ส่วนหลักคือ Frontend (React + Vite) และ Backend (Firebase Cloud Functions)

```
NoraStory/
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/         # ระบบหลังบ้าน (Admin Dashboard, Login)
│   │   │   ├── checkout/      # ระบบสั่งซื้อ (Checkout Modal, Context)
│   │   │   ├── templates/     # Template ทั้งหมด (Tier 1, 2, 3)
│   │   │   ├── StoryPage.jsx  # หน้าแสดงผลเรื่องราว (Dynamic Route)
│   │   │   └── ExtensionPage.jsx # หน้าต่ออายุ/แก้ไขเรื่องราว
│   │   ├── api/               # ฟังก์ชันเชื่อมต่อ Firebase Functions
│   │   ├── data/              # ข้อมูลคงที่ (Tier, Packages)
│   │   └── App.jsx            # Routing ทั้งหมด (รวมถึง Admin และ Dynamic Routes)
│   └── firebase.json          # ตั้งค่า Firebase Hosting, Storage, Functions
│
└── Backend/                   # Firebase Cloud Functions (v2)
    ├── src/
    │   ├── controllers/       # Logic จัดการ Order, Admin, Upload
    │   ├── middleware/        # Auth (Custom Claims), Rate Limiting
    │   ├── services/          # เชื่อมต่อ Firestore, Storage
    │   └── utils/             # Validation, Error Handling
    └── index.js               # Entry point ของ Cloud Functions
```

---

## การทำงานของระบบ

### 1. ลูกค้าสั่งซื้อ (Checkout Flow)
1. ลูกค้าเลือกแพ็คเกจ และกรอกข้อมูลใน `CheckoutModal.jsx`
2. อัปโหลดรูปสลิปและรูปภาพเนื้อหา (ถ้ามี) ไปยัง **Firebase Storage**
3. ระบบเรียก **Firebase Cloud Function** (`createOrder`)
4. Backend จะตรวจสอบความถูกต้อง (Validation), ตรวจสอบ Rate Limit
5. สร้างรหัสสุ่ม 10 ตัวอักษร (เช่น `AbC12xYz9Q`)
6. บันทึกข้อมูลลง **Firestore** (`orders` collection) และตั้งสถานะเป็น `pending`

### 2. แอดมินจัดการออเดอร์ (Admin Dashboard)
1. แอดมินล็อกอินเข้าสู่ระบบ `/jimdev` (ใช้ Firebase Auth + Custom Claims)
2. ดูรายการออเดอร์ที่เข้ามาใน `AdminDashboard.jsx`
3. ตรวจสอบสลิปการโอนเงิน
4. เลือก Template ที่เหมาะสม (เช่น `t2-1`), ตั้งค่าเพลง, และอนุมัติออเดอร์
5. ระบบ Cloud Function (`updateOrderStatus`) จะทำงานและส่งอีเมล/อัปเดตสถานะเป็น `approved` หรือ `completed`

### 3. ลูกค้าเข้าชมลิงก์ (StoryPage.jsx)
เมื่อมีคนเข้า `norastory.com/AbC12xYz9Q`:
1. ระบบดึงรหัส `AbC12xYz9Q` จาก URL
2. ค้นหาใน Firestore โดยใช้รหัสนั้นเป็น Document ID
3. ตรวจสอบ `status` (ต้องเป็น `approved` หรือ `completed`)
4. แสดงผล Template ตาม `template_id` ที่ Admin กำหนด พร้อมดึงข้อมูลรูปภาพและเพลงจาก Firebase Storage

### 4. ระบบ Subdomain (VIP - Tier 4)
สำหรับลูกค้า Tier 4 ที่ต้องการลิงก์แบบ `name.norastory.com`:
1. ระบบตรวจสอบความซ้ำซ้อนของ Domain ตั้งแต่ขั้นตอน Checkout (ผ่าน Cloud Function `checkDomainAvailability`)
2. Admin ต้องไปเพิ่ม Subdomain ใน Firebase Hosting หรือ Cloudflare
3. ระบบหน้าบ้านจะตรวจสอบ `window.location.hostname` และค้นหาข้อมูลด้วย `customDomain` field

### 5. การต่ออายุและแก้ไข (Extension / Edit)
1. ลูกค้าสามารถเข้าลิงก์ `/extend/<orderId>` เพื่อขอต่ออายุระยะเวลาใช้งาน หรือขอแก้ไขเนื้อหา
2. อัปโหลดสลิปหรือรูปภาพใหม่ (อัปโหลดไปที่ `extension_slips/`, `edit_slips/`, `edit_images/`)
3. ระบบเรียก Cloud Function ให้ Admin อนุมัติ

---

## Database Schema (Firestore: `orders` collection)

| Field | Type | Description |
|-------|------|-------------|
| `tierId` | string | รหัสแพ็คเกจ (t1, t2, t3, t4) |
| `tierName` | string | ชื่อแพ็คเกจ |
| `price` | number | ราคา |
| `buyerName` | string | ชื่อผู้ซื้อ |
| `buyerEmail` | string | อีเมลผู้ซื้อ |
| `buyerPhone` | string | เบอร์โทรศัพท์ |
| `targetName` | string | ชื่อคนรับ |
| `message` | string | ข้อความที่จะแสดง |
| `signOff` | string | คำลงท้าย |
| `pin` | string | รหัส PIN 4 หลัก (สำหรับปลดล็อค - ตัวเลือกเสริม) |
| `customDomain` | string/null | ชื่อ Subdomain (เฉพาะ Tier 4) |
| `templateId` | string/null | ID ของ Template เช่น `t1-1` (Admin ตั้งค่า) |
| `contentUrls` | array | URL รูปภาพเนื้อหาที่อัปโหลด |
| `slipUrl` | string | URL สลิปโอนเงิน |
| `status` | string | สถานะ: `pending`, `approved`, `completed`, `rejected`, `expired` |
| `expiresAt` | timestamp | วันหมดอายุของลิงก์ |
| `createdAt` | timestamp | วันที่สร้าง |

---

## การ Deploy

โปรเจกต์นี้ใช้ **Firebase** ครบวงจร (Hosting, Functions, Firestore, Storage, Auth)

1. **ตั้งค่า Environment Variables**:
   ในโฟลเดอร์ `frontend/.env`:
   ```
   VITE_FIREBASE_API_KEY=xxx
   VITE_FIREBASE_AUTH_DOMAIN=xxx
   VITE_FIREBASE_PROJECT_ID=xxx
   VITE_FIREBASE_STORAGE_BUCKET=xxx
   VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
   VITE_FIREBASE_APP_ID=xxx
   VITE_FIREBASE_MEASUREMENT_ID=xxx
   ```

2. **Deploy ทั้งโปรเจกต์ (Frontend + Backend + Rules)**:
   ```bash
   firebase deploy
   ```

3. **Deploy แยกส่วน**:
   - `firebase deploy --only hosting` (เฉพาะหน้าเว็บ Frontend)
   - `firebase deploy --only functions` (เฉพาะ Backend Functions)
   - `firebase deploy --only firestore:rules` (เฉพาะ Security Rules ของ DB)
   - `firebase deploy --only storage` (เฉพาะ Security Rules ของไฟล์)

---

## ความปลอดภัย (Security)

- **Firebase Storage Rules**: อนุญาตให้อัปโหลดไฟล์ชั่วคราว (`temp_*`) หรือเข้าไปในโฟลเดอร์ที่กำหนดเท่านั้น (เช่น `slips/`) ป้องกันการอัปโหลดไฟล์ไม่พึงประสงค์
- **Firestore Rules**: 
  - ลูกค้าทั่วไปสามารถ *สร้าง* ออเดอร์ใหม่ได้ผ่าน Cloud Function เท่านั้น (ป้องกันการยิง API ตรง)
  - เข้าถึงเพื่อ *อ่าน* เรื่องราวที่ได้รับอนุมัติแล้วเท่านั้น
- **Admin Access**: ใช้ระบบ Firebase Custom Claims ยืนยันสิทธิ์ใน Cloud Functions ระดับ Backend ป้องกันการปลอมแปลงสิทธิ์จากหน้าบ้าน
