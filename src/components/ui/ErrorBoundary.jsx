import React from 'react';

/**
 * ErrorBoundary Component
 * ป้องกันแอปพลิเคชันพังทั้งหน้าจอเมื่อเกิด Error ใน Component ลูก
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // อัปเดต state เพื่อให้การเรนเดอร์ครั้งต่อไปแสดง UI สำรอง
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // สามารถส่ง Log ไปยังบริการภายนอกได้ที่นี่ (เช่น Sentry)
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI สำรองเมื่อเกิด Error
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-playfair text-[#1A3C40] mb-3">
            อุ๊ปส์! เกิดข้อผิดพลาดบางอย่าง
          </h1>
          <p className="text-gray-500 max-w-md mb-8">
            ขออภัยในความไม่สะดวก ระบบขัดข้องชั่วคราว ทีมงานกำลังเร่งดำเนินการแก้ไข กรุณาลองใหม่อีกครั้งในภายหลัง
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1A3C40] text-white px-8 py-3 rounded-full hover:bg-[#2A5C60] transition-all font-medium"
          >
            โหลดหน้าเว็บใหม่
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-4 bg-red-50 rounded-lg text-left max-w-2xl overflow-auto border border-red-100">
              <p className="text-red-700 font-mono text-sm">
                Debug Info: {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
