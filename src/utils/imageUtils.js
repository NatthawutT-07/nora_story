import imageCompression from 'browser-image-compression';

/**
 * Image Compression Utility
 * บีบอัดรูปภาพก่อนอัปโหลดเพื่อประหยัดพื้นที่และเพิ่มความเร็ว
 */

const DEFAULT_OPTIONS = {
  maxSizeMB: 1,            // ขนาดไฟล์สูงสุด 1MB
  maxWidthOrHeight: 1920,  // ความกว้าง/ยาวสูงสุด 1920px
  useWebWorker: true,      // ใช้ Web Worker เพื่อไม่ให้ UI ค้าง
  initialQuality: 0.8,     // คุณภาพเริ่มต้น 80%
};

/**
 * Compress a single image file
 * @param {File} file - ไฟล์รูปภาพต้นฉบับ
 * @param {object} customOptions - ออปชันเพิ่มเติม
 * @returns {Promise<File>} ไฟล์ที่ถูกบีบอัดแล้ว
 */
export const compressImage = async (file, customOptions = {}) => {
  if (!file) return null;
  
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) -> (${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return file; // ถ้าบีบอัดไม่สำเร็จ ให้คืนค่าไฟล์เดิม
  }
};

/**
 * Compress multiple image files in parallel
 * @param {Array<File>} files - รายการไฟล์รูปภาพ
 * @returns {Promise<Array<File>>} รายการไฟล์ที่ถูกบีบอัดแล้ว
 */
export const compressImages = async (files) => {
  const validFiles = files.filter(f => f instanceof File);
  return Promise.all(validFiles.map(file => compressImage(file)));
};
