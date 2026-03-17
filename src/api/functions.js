/**
 * Firebase Cloud Functions API
 * Helper module สำหรับเรียกใช้ Cloud Functions จาก Frontend
 */
import { httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { functions } from '../firebase';

// Connect to emulator in development (uncomment when testing locally)
// if (import.meta.env.DEV) {
//     connectFunctionsEmulator(functions, 'localhost', 5001);
// }

// ============================================
// PUBLIC FUNCTIONS
// ============================================

/**
 * Create a new order
 * @param {object} orderData - Order data
 * @returns {Promise<object>} { success, orderId, storyUrl }
 */
export const createOrder = async (orderData) => {
    const fn = httpsCallable(functions, 'createOrder');
    const result = await fn(orderData);
    return result.data;
};

/**
 * Get order (public view)
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const getOrder = async (orderId) => {
    const fn = httpsCallable(functions, 'getOrder');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Get order for extension page
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const getOrderForExtension = async (orderId) => {
    const fn = httpsCallable(functions, 'getOrderForExtension');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Check domain availability
 * @param {string} domain 
 * @returns {Promise<object>} { success, available }
 */
export const checkDomain = async (domain) => {
    const fn = httpsCallable(functions, 'checkDomain');
    const result = await fn({ domain });
    return result.data;
};

/**
 * Request link extension
 * @param {object} data - Extension request data
 * @returns {Promise<object>}
 */
export const requestExtension = async (data) => {
    const fn = httpsCallable(functions, 'requestExtension');
    const result = await fn(data);
    return result.data;
};

/**
 * Save text edit (free)
 * @param {object} data - Edit data
 * @returns {Promise<object>}
 */
export const saveTextEdit = async (data) => {
    const fn = httpsCallable(functions, 'saveTextEdit');
    const result = await fn(data);
    return result.data;
};

/**
 * Save image edit (free)
 * @param {object} data - Edit data with image URLs
 * @returns {Promise<object>}
 */
export const saveImageEdit = async (data) => {
    const fn = httpsCallable(functions, 'saveImageEdit');
    const result = await fn(data);
    return result.data;
};

/**
 * Submit edit payment
 * @param {object} data - Payment data
 * @returns {Promise<object>}
 */
export const submitEditPayment = async (data) => {
    const fn = httpsCallable(functions, 'submitEditPayment');
    const result = await fn(data);
    return result.data;
};

/**
 * Get edit configuration
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const getEditConfig = async (orderId) => {
    const fn = httpsCallable(functions, 'getEditConfig');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Get all music tracks
 * @returns {Promise<object>}
 */
export const getAllMusic = async () => {
    const fn = httpsCallable(functions, 'getAllMusic');
    const result = await fn();
    return result.data;
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Get all orders (admin)
 * @param {object} options - Query options
 * @returns {Promise<object>}
 */
export const adminGetAllOrders = async (options = {}) => {
    const fn = httpsCallable(functions, 'adminGetAllOrders');
    const result = await fn(options);
    return result.data;
};

/**
 * Get order details (admin)
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const adminGetOrderDetails = async (orderId) => {
    const fn = httpsCallable(functions, 'adminGetOrderDetails');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Approve order (admin)
 * @param {object} data - { orderId, templateId }
 * @returns {Promise<object>}
 */
export const adminApproveOrder = async (data) => {
    const fn = httpsCallable(functions, 'adminApproveOrder');
    const result = await fn(data);
    return result.data;
};

/**
 * Reject order (admin)
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const adminRejectOrder = async (orderId) => {
    const fn = httpsCallable(functions, 'adminRejectOrder');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Delete order (admin)
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const adminDeleteOrder = async (orderId) => {
    const fn = httpsCallable(functions, 'adminDeleteOrder');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Update order content (admin)
 * @param {object} data - { orderId, ...fields }
 * @returns {Promise<object>}
 */
export const adminUpdateOrderContent = async (data) => {
    const fn = httpsCallable(functions, 'adminUpdateOrderContent');
    const result = await fn(data);
    return result.data;
};

/**
 * Update order link (admin)
 * @param {object} data - { orderId, customDomain, linkType }
 * @returns {Promise<object>}
 */
export const adminUpdateOrderLink = async (data) => {
    const fn = httpsCallable(functions, 'adminUpdateOrderLink');
    const result = await fn(data);
    return result.data;
};

/**
 * Update order expiry (admin)
 * @param {object} data - { orderId, newExpiresAt }
 * @returns {Promise<object>}
 */
export const adminUpdateExpiry = async (data) => {
    const fn = httpsCallable(functions, 'adminUpdateExpiry');
    const result = await fn(data);
    return result.data;
};

/**
 * Approve extension (admin)
 * @param {object} data - { orderId, requestedDays }
 * @returns {Promise<object>}
 */
export const adminApproveExtension = async (data) => {
    const fn = httpsCallable(functions, 'adminApproveExtension');
    const result = await fn(data);
    return result.data;
};

/**
 * Reject extension (admin)
 * @param {string} orderId 
 * @returns {Promise<object>}
 */
export const adminRejectExtension = async (orderId) => {
    const fn = httpsCallable(functions, 'adminRejectExtension');
    const result = await fn({ orderId });
    return result.data;
};

/**
 * Approve edit payment (admin)
 * @param {object} data - { orderId, editType }
 * @returns {Promise<object>}
 */
export const adminApproveEditPayment = async (data) => {
    const fn = httpsCallable(functions, 'adminApproveEditPayment');
    const result = await fn(data);
    return result.data;
};

/**
 * Reject edit payment (admin)
 * @param {object} data - { orderId, editType }
 * @returns {Promise<object>}
 */
export const adminRejectEditPayment = async (data) => {
    const fn = httpsCallable(functions, 'adminRejectEditPayment');
    const result = await fn(data);
    return result.data;
};

/**
 * Add music (admin)
 * @param {object} data - { name, number, url, fileName }
 * @returns {Promise<object>}
 */
export const adminAddMusic = async (data) => {
    const fn = httpsCallable(functions, 'adminAddMusic');
    const result = await fn(data);
    return result.data;
};

/**
 * Update music (admin)
 * @param {object} data - { id, name, number }
 * @returns {Promise<object>}
 */
export const adminUpdateMusic = async (data) => {
    const fn = httpsCallable(functions, 'adminUpdateMusic');
    const result = await fn(data);
    return result.data;
};

/**
 * Delete music (admin)
 * @param {object} data - { id, fileName }
 * @returns {Promise<object>}
 */
export const adminDeleteMusic = async (data) => {
    const fn = httpsCallable(functions, 'adminDeleteMusic');
    const result = await fn(data);
    return result.data;
};

/**
 * Grant admin access (super admin)
 * @param {string} email 
 * @returns {Promise<object>}
 */
export const adminGrantAccess = async (email) => {
    const fn = httpsCallable(functions, 'adminGrantAccess');
    const result = await fn({ email });
    return result.data;
};

/**
 * Revoke admin access (super admin)
 * @param {string} email 
 * @returns {Promise<object>}
 */
export const adminRevokeAccess = async (email) => {
    const fn = httpsCallable(functions, 'adminRevokeAccess');
    const result = await fn({ email });
    return result.data;
};
