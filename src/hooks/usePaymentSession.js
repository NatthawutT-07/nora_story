/**
 * usePaymentSession Hook
 * จัดการ Firestore onSnapshot listener และ Countdown Timer
 * สำหรับ Omise Payment Session
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PAYMENT_SESSION_STATUS = {
    PENDING: 'pending_payment',
    PAID: 'paid',
    COMPLETED: 'completed',
    EXPIRED: 'expired',
};

/**
 * @param {string|null} sessionId - Firestore payment_sessions document ID
 * @param {string|null} expiresAt - ISO string ของเวลาหมดอายุ
 * @returns {object} { status, secondsLeft, isExpired, isPaid }
 */
const usePaymentSession = (sessionId, expiresAt) => {
    const [status, setStatus] = useState(PAYMENT_SESSION_STATUS.PENDING);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const countdownRef = useRef(null);
    const unsubscribeRef = useRef(null);

    // คำนวณเวลาที่เหลือจาก expiresAt (timestamp-based เพื่อความแม่นยำ)
    const calcSecondsLeft = useCallback(() => {
        if (!expiresAt) return 0;
        const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
        return Math.max(0, diff);
    }, [expiresAt]);

    // เริ่ม Countdown Timer
    useEffect(() => {
        if (!expiresAt || status === PAYMENT_SESSION_STATUS.PAID || status === PAYMENT_SESSION_STATUS.COMPLETED) {
            return;
        }

        setSecondsLeft(calcSecondsLeft());

        countdownRef.current = setInterval(() => {
            const left = calcSecondsLeft();
            setSecondsLeft(left);
            if (left <= 0) {
                clearInterval(countdownRef.current);
                setStatus(PAYMENT_SESSION_STATUS.EXPIRED);
            }
        }, 1000);

        return () => clearInterval(countdownRef.current);
    }, [expiresAt, status, calcSecondsLeft]);

    // Firestore onSnapshot listener
    useEffect(() => {
        if (!sessionId) return;

        const sessionRef = doc(db, 'payment_sessions', sessionId);
        unsubscribeRef.current = onSnapshot(
            sessionRef,
            (docSnap) => {
                if (!docSnap.exists()) return;
                const data = docSnap.data();
                const newStatus = data.status;

                setStatus(newStatus);

                if (
                    newStatus === PAYMENT_SESSION_STATUS.PAID ||
                    newStatus === PAYMENT_SESSION_STATUS.COMPLETED
                ) {
                    clearInterval(countdownRef.current);
                }
            },
            (error) => {
                console.error('usePaymentSession: onSnapshot error', error);
            }
        );

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [sessionId]);

    return {
        status,
        secondsLeft,
        isExpired: status === PAYMENT_SESSION_STATUS.EXPIRED || (secondsLeft !== null && secondsLeft <= 0),
        isPaid: status === PAYMENT_SESSION_STATUS.PAID || status === PAYMENT_SESSION_STATUS.COMPLETED,
    };
};

export { PAYMENT_SESSION_STATUS };
export default usePaymentSession;
