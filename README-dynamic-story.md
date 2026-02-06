# ระบบ Dynamic Story URL - NoraStory

## ภาพรวมระบบ

ระบบนี้ช่วยให้ลูกค้าแต่ละคนมี "ลิงก์ส่วนตัว" เพื่อเข้าดูหน้าเว็บไซต์ที่สร้างขึ้นให้เฉพาะตัว

### รูปแบบลิงก์ที่รองรับ

| แพ็คเกจ | รูปแบบลิงก์ | ตัวอย่าง |
|---------|------------|----------|
| Tier 1-3 | `norastory.com/<รหัส 10 ตัว>` | `norastory.com/AbC12xYz9Q` |
| Tier 4 (VIP) | `<ชื่อ>.norastory.com` | `joy.norastory.com` |

---

## โครงสร้างไฟล์

```
frontend/src/
├── components/
│   ├── StoryPage.jsx          # หน้าแสดงผลเรื่องราว (Dynamic)
│   ├── CheckoutModal.jsx      # แก้ไขให้สร้าง Story ID และบันทึก template_id
│   └── templates/             # Template ทั้งหมด
└── App.jsx                    # เพิ่ม Route /:id ไว้ล่างสุด
```

---

## การทำงานของระบบ

### 1. ลูกค้าสั่งซื้อ (CheckoutModal.jsx)
เมื่อลูกค้ากดยืนยันการชำระเงิน ระบบจะ:
1. สร้างรหัสสุ่ม 10 ตัวอักษร (เช่น `AbC12xYz9Q`)
2. บันทึกข้อมูลลง Firestore (`orders` collection) โดยใช้รหัสนั้นเป็น Document ID
3. เก็บ `story_url` ไว้ใน Database สำหรับอ้างอิง

### 2. ลูกค้าเข้าชมลิงก์ (StoryPage.jsx)
เมื่อมีคนเข้า `norastory.com/AbC12xYz9Q`:
1. ระบบดึงรหัส `AbC12xYz9Q` จาก URL
2. ค้นหาใน Firestore โดยใช้รหัสนั้นเป็น Document ID
3. ตรวจสอบ `status` (ต้องเป็น `approved` หรือ `completed`)
4. แสดงผล Template ตาม `template_id` ที่ Admin กำหนด

### 3. ระบบ Subdomain (VIP - Tier 4)
สำหรับลูกค้า Tier 4 ที่ต้องการลิงก์แบบ `name.norastory.com`:
1. Admin ต้องไปเพิ่ม Subdomain ใน Cloudflare Pages ด้วยตนเอง
2. ระบบจะตรวจสอบ Hostname และค้นหาด้วย `custom_domain` field แทน

---

## Database Schema (Firestore: `orders` collection)

| Field | Type | Description |
|-------|------|-------------|
| `tier_id` | number | รหัสแพ็คเกจ (1-4) |
| `tier_name` | string | ชื่อแพ็คเกจ |
| `price` | number | ราคา |
| `customer_name` | string | ชื่อลูกค้า |
| `customer_contact` | string | Line ID |
| `message` | string | ข้อความที่จะแสดงในเว็บ |
| `custom_domain` | string/null | ชื่อ Subdomain (เฉพาะ Tier 4) |
| `template_id` | string/null | ID ของ Template เช่น `t1-6` (Admin ตั้งค่า) |
| `content_images` | array | URL รูปภาพที่อัปโหลด |
| `slip_url` | string | URL สลิปโอนเงิน |
| `status` | string | สถานะ: `pending`, `approved`, `completed` |
| `story_url` | string | URL เต็มสำหรับเข้าชม |
| `created_at` | timestamp | วันที่สร้าง |

---

## สิ่งที่ Admin ต้องทำหลังได้รับออเดอร์

1. **ตรวจสอบสลิป** ใน Admin Dashboard
2. **เลือก Template** ที่เหมาะสมให้ลูกค้า
3. **อัปเดต `template_id`** ใน Firestore (เช่น `t1-6`)
4. **เปลี่ยน `status`** เป็น `approved`
5. **ส่งลิงก์ให้ลูกค้า** (ดูจาก `story_url` field)

### สำหรับ Tier 4 (Subdomain):
6. ไปที่ **Cloudflare Pages > Custom Domains** > เพิ่ม `<ชื่อ>.norastory.com`

---

## การ Deploy

1. **ตั้งค่า Environment Variables** ใน Cloudflare Pages Settings:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`

---

## หมายเหตุ

- รหัส 10 ตัวอักษรมีความเป็นไปได้ ~839 ล้านล้านแบบ (62^10) จึงแทบไม่มีโอกาสซ้ำ
- ถ้าต้องการเพิ่มความปลอดภัย สามารถเพิ่ม Logic ตรวจสอบว่า ID ซ้ำหรือไม่ก่อนบันทึก
- Template ต้องรับ props ที่ชื่อ `customTitle`, `customMessage`, `customSignOff`, `images`
