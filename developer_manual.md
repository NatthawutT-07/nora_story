# คู่มือสำหรับนักพัฒนาโปรเจค Nora Story (Developer Manual)

ยินดีต้อนรับสู่โปรเจค Nora Story! เอกสารฉบับนี้จัดทำขึ้นเพื่อเป็นคู่มือเบื้องต้นสำหรับนักพัฒนาใหม่ (Developer) เพื่อทำความเข้าใจเกี่ยวกับโครงสร้างโปรเจค, สถาปัตยกรรมของระบบ, โครงสร้างฐานข้อมูล (Database) และรูปแบบการทำงานหลักๆ ของระบบครับ

---

## 1. ภาพรวมสถาปัตยกรรม (Architecture Overview)
โปรเจค Nora Story ถูกออกแบบด้วยสถาปัตยกรรมแบบ **Serverless Single Page Application (SPA)**
- **Frontend (หน้าบ้าน):** พัฒนาด้วย **React 19** ควบคู่กับ Build Tool อย่าง **Vite**
- **การจัดสไตล์ (Styling) & อนิเมชั่น:** เน้นใช้ **Tailwind CSS v4** และ **Framer Motion** เป็นหลัก
- **Backend / Services (หลังบ้าน):** โปรเจคนี้ **ไม่มีการเขียนโค้ด Backend แยกต่างหาก** (ไม่มีเครื่อง Server ที่รัน Node.js, Express หรือ Python) แต่จะใช้บริการจาก **Firebase (BaaS)** โดยตรง
  - **Firestore (Database):** เป็นฐานข้อมูลหลักแบบ NoSQL ใช้เก็บข้อมูลผู้ใช้, คำสั่งซื้อ (Orders), รูปแบบเทมเพลต และเนื้อหาเรื่องราว (Stories)
  - **Firebase Storage:** ใช้เก็บไฟล์รูปภาพ, วิดีโอ หรือไฟล์เสียง (Music) ที่อัปโหลดเข้ามา
  - **Firebase Authentication:** ใช้สำหรับระบบล็อกอินของแอดมิน (เข้าผ่านหน้า `/jimdev`)
  - **การนำขึ้นระบบ (Hosting):** จะนำไฟล์ Frontend ที่ผ่านการ Build แล้วໄປเสิร์ฟให้ผู้ใช้ตรงๆ

ความปลอดภัยของข้อมูลทั้งหมดจะถูกควบคุมด้วย **Firebase Security Rules** ([firestore.rules](file:///c:/BrightMindRetail/nora_story/firestore.rules) และ [storage.rules](file:///c:/BrightMindRetail/nora_story/storage.rules)) เพื่อจำกัดสิทธิ์การเข้าถึงข้อมูลต่างๆ จากฝั่งแอพ React

---

## 2. โครงสร้างโฟลเดอร์ (Folder Structure)

ตัวโปรเจคจะประกอบไปด้วยไฟล์ตั้งค่าของ Firebase ที่ Folder นอกสุด และตัวโปรเจค React จะอยู่ด้านในโฟลเดอร์ `frontend/`

```text
c:\BrightMindRetail\nora_story\
├── firestore.rules          # กฎความปลอดภัยสำหรับ ฐานข้อมูล Firestore
├── storage.rules            # กฎความปลอดภัยสำหรับ ไฟล์บน Firebase Storage
├── firebase.json            # ไฟล์ตั้งค่าเวลา deploy ขึ้น Firebase
├── firestore.indexes.json   # ตั้งค่า Index สำหรับการคิวรี่ข้อมูลใน Firestore
└── frontend/                # โฟลเดอร์หลักของตัวแอปพลิเคชัน React
    ├── .env                 # ไฟล์เก็บตัวแปรระบบ (Secrets เช่น VITE_FIREBASE_...)
    ├── index.html           # ไฟล์ HTML หลัก (Entry point ของโปรเจค Vite)
    ├── package.json         # กำหนด Library และคำสั่งรันโปรเจค (npm run dev)
    ├── vite.config.js       # ตั้งค่าการ Build ของ Vite
    └── src/                 # ซอร์สโค้ดหลักทั้งหมดของเว็บไซต์อยู่ที่นี่
        ├── main.jsx         # ไฟล์แรกสุดที่ React ถูกโหลด ควบคุมระบบ Routing ด้วย BrowserRouter
        ├── App.jsx          # กำหนดเส้นทาง URL (Routing) ไปยังหน้าต่างๆ
        ├── firebase.js      # โค้ดสำหรับตั้งค่าและเชื่อมต่อกับ Firebase SDK
        ├── index.css        # นำเข้า Tailwind CSS และสไตล์ระดับ Global
        ├── components/      # ส่วนประกอบย่อย (UI Components) ของ React
        │   ├── admin/       # หน้า Dashboard และระบบ Login ของแอดมิน (`/jimdev`)
        │   ├── checkout/    # ส่วนของการกดสั่งซื้อ และตะกร้าสินค้า
        │   ├── templates/   # เตรียมหน้าตาชิ้นงานเทมเพลตเรื่องราว (แยกตาม Tiers 1-3)
        │   └── ...          # Components จิปาถะ (หน้า Hero, Pricing, Galleries ฯลฯ)
        ├── lib/             # รวมฟังก์ชันช่วยเหลือ (Helper/Utility functions) (ถ้ามี)
        └── data/            # ข้อมูล Static Data แบบคงที่ (เช่น tierData.js)
```

---

## 3. โครงสร้าง API และ Backend (API & Backend Structure)

เนื่องจากเปลี่ยนเป้าหมายเป็น Serverless App โปรเจคนี้จึงไม่ได้เรียกใช้ API Endpoint (เช่น `GET /api/users`) แต่จะ **ต่อตรงเข้าสู่ Firebase Firestore** 

โดยทุกอย่างจะเริ่มต้นที่ไฟล์ [frontend/src/firebase.js](file:///c:/BrightMindRetail/nora_story/frontend/src/firebase.js):
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// ...
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```
**ตัวอย่างการดึงข้อมูล:**
โค้ดใน Components ต่างๆ (เช่น ในหน้า Admin หรือหน้า Checkout) จะเรียกใช้งานผ่าน Firebase SDK โดยตรง
```javascript
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

const collectionRef = collection(db, "orders");
const snapshot = await getDocs(query(collectionRef)); // อ่านข้อมูลจาก DB
```

---

## 4. โครงสร้างฐานข้อมูล (Database Models)

โปรเจคนี้ใช้ฐานข้อมูล Firestore (NoSQL) ซึ่งเก็บข้อมูลเป็น Document อยู่ภายใต้ Collections ต่างๆ ซึ่งอ้างอิงจากโค้ด น่าจะมี Collection หลักประมาณนี้:

### `orders` (รายการสั่งซื้อ)
ใช้เก็บข้อมูลการสั่งทำเทมเพลตเรื่องราว (Story Templates) จากลูกค้า
- `id` (Document ID) - รหัสคำสั่งซื้อ
- `customerName` (String) - ชื่อลูกค้า
- `contactEmail` / `contactLine` (String) - ข้อมูลติดต่อลูกค้า
- `tierId` (String) - รหัสเทมเพลตที่สั่ง เช่น `t1-1`, `t2-1`
- `status` (String) - สถานะคำสั่งซื้อ เช่น "pending" (รอดำเนินการ), "paid" (จ่ายแล้ว)
- `paymentSlipUrl` (String) - ลิงก์เก็บรูปภาพสลิปที่ลูกค้าแนบมา (อัปโหลดไป Firebase Storage)
- `createdAt` (Timestamp) - วันเวลาที่สร้างคำสั่งซื้อ

### `music` (เสียงดนตรี)
ระบบคลังเพลงประกอบที่เลือกใช้ในเทมเพลตและ Demo
- `id` (Document ID)
- `name` (String) - ชื่อเพลง
- `url` (String) - ลิงก์ไฟล์เสียง (mp3) ใน Firebase Storage
- `createdAt` (Timestamp)

### `stories` / `extensions` (ผลงานที่เสร็จแล้ว)
เก็บข้อมูลส่วนตัวของคู่รัก/ลูกค้า ที่ถูกนำไปใส่ในเทมเพลตเพื่อแสดงผลจริง
- `id` (Document ID) - **(สำคัญ)** นี่คือรหัสที่จะไปโผล่ใน URL ตอนลูกค้าเข้าดู (เช่น `/:id` หรือ `/extend/:id`)
- `tier` (String) - อ้างอิงว่าใช้เทมเพลต Tier ไหน
- `title` (String) - หัวเรื่อง เช่น "Happy Anniversary!"
- `content` (Object/JSON) - เก็บชุดข้อความ หรือวันที่ต่างๆ สำหรับใส่ในจุดที่เทมเพลตเตรียมไว้ (Placeholder)
- `mediaUrls` (Array of Strings) - ลิงก์รูปภาพของลูกค้าที่อัปโหลดไว้ใช้งานในหน้าเทมเพลต
- `isPublished` (Boolean) - สถานะการเปิดใช้งาน (ลูกค้าจะเห็นไหม)

---

## 5. Flow การทำงานหลัก (Core Workflows)

### 5.1 Journey ของผู้ใช้งานทั่วไป (เข้าชมเว็บไซต์และสั่งซื้อ)
1. **หน้า Landing Page (หน้าบ้าน):** ผู้ใช้โหลดเข้าเว็บ (Path `/`) ระบบจะแสดงหน้าข้อมูลโปรเจค, แพ็กเกจราคา รวมผลงาน ฯลฯ ผ่าน `<MainPage />`
2. **กดดูตัวอย่าง (Demos):** ผู้ใช้งานกดดูตัวอย่างชิ้นงาน State ภายใน (`showGallery`, `showDemo`) จะเปลี่ยน ทำให้หน้าจอแสดง Layout ของเทมเพลทนั้นๆ พร้อมเปิดเพลงประกอบขึ้นมา
3. **การสั่งซื้อ (Checkout):** ลูกค้าเลือกกดซื้อแพ็กเกจ (Tier) จะมี Popup `<CheckoutModal />` เด้งขึ้นมา ลูกค้ากรอกรายละเอียดและอัปโหลดรูปสลิป ข้อมูลจะถูกบันทึกลง Firestore (Collection: `orders`)

### 5.2 Workflow ของผู้ดูแลระบบ (Admin Flow)
1. **การ Login:** แอดมินเข้าทาง URL `/jimdev` และทำการล็อกอิน (`<AdminLogin />`) ด้วยอีเมล/รหัสผ่านที่ตั้งในระบบ Firebase Auth
2. **จัดการ Dashboard:** ถ้ารหัสผ่านถูก จะพาไปสู่ส่วนทำงานคือ `/jimdev/dashboard` (`<AdminDashboard />`)
3. **ตรวจสอบคำสั่งซื้อ:** แอดมินอ่านดึงข้อมูลจาก `orders` เลื่อนดูออเดอร์ใหม่ เช็คสลิปโอนเงิน แล้วกดยืนยันออเดอร์
4. **นำเข้าเนื้อหา/สร้างเรื่องราว:** แอดมินนำรูปภาพ ข้อความ และไฟล์ที่ลูกค้าส่งมา ทำการอัปโหลดไฟล์/ข้อความ เข้าไปใน collection `stories` จนพร้อมใช้งาน

### 5.3 Flow การส่งมอบให้ลูกค้าเข้าดู (Output Viewer)
1. **ลูกค้าเปิดลิงก์:** ลูกค้าได้รับลิงก์ URL พิเศษที่มี ID เช่น `https://norastory.com/our-love-story-1001` (เส้นทางในโค้ดคือ Route: `/:id`)
2. **Render เรื่องราว:** component `<StoryPage />` จะเริ่มทำงาน
3. **ดึงข้อมูล (Fetch):** ตัวหน้าเว็บจะทำการคิวรี่เอาข้อมูลภายใต้ ID (`our-love-story-1001`) จากตาราง `stories` ใน Firestore 
4. **แสดงผลบนจอ:** นำข้อความ รูปภาพ และเพลงประกอบสวมเข้าไปในรหัสเทมเพลตที่ลูกค้าระบุไว้ตอนสั่งซื้อ ออกมาเป็นเพจที่สวยงาม มีลูกเล่นขยับได้ด้วย Framer Motion แบบหน้าปัจจุบัน

---

**🔥 ทริคสรุปสุดท้าย (Summary Tips):**
- **ห้ามเอา Secrets ขึ้น Git:** ค่าสำคัญต่างๆ (API keys) ให้เก็บในไฟล์ [.env](file:///c:/BrightMindRetail/nora_story/frontend/.env) เสมอ
- **การรันโปรเจคพัฒนา (ถ้าต้องการรันเครื่องตัวเอง):** 
  - เข้าโฟลเดอร์รันคำสั่ง: `cd frontend` 
  - ติดตั้ง Library: `npm install` 
  - เปิดเซิร์ฟเวอร์จำลอง: `npm run dev`
- **การแก้หน้าตา / UI:** ล้วงหาโค้ดใน `frontend/src/components/` และแก้ไข Tailwind css class ได้เลย
- **การจัดการกับ Database:** ศึกษาผ่านการใช้ตัวแปร `db` ที่ถูก Import มาจากตระกูล Firebase ([frontend/src/firebase.js](file:///c:/BrightMindRetail/nora_story/frontend/src/firebase.js))
