/**
 * Payment API
 * Helper module สำหรับเรียก Cloud Functions ที่เกี่ยวกับ Omise Payment
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

/**
 * สร้าง Payment Session ใหม่ + Omise Charge
 * @param {object} data - { tierId, tierName, price, paymentMethod }
 * @returns {Promise<{ success, sessionId, expiresAt, qrCodeUrl? }>}
 */
export const createPaymentSession = async (data) => {
    const fn = httpsCallable(functions, 'createPaymentSession');
    const result = await fn(data);
    return result.data;
};

/**
 * สร้าง Charge ด้วยบัตรเครดิต (ส่ง Token จาก Omise.js)
 * @param {object} data - { sessionId, omiseToken }
 * @returns {Promise<{ success, status, chargeId }>}
 */
export const createCardCharge = async (data) => {
    const fn = httpsCallable(functions, 'createCardCharge');
    const result = await fn(data);
    return result.data;
};

/**
 * ส่ง Form Data + ยืนยันการสร้าง Order หลังชำระเงินสำเร็จ
 * @param {object} data - { sessionId, ...orderData fields }
 * @returns {Promise<{ success, orderId, storyUrl }>}
 */
export const submitOrderWithPayment = async (data) => {
    const fn = httpsCallable(functions, 'submitOrderWithPayment');
    const result = await fn(data);
    return result.data;
};
