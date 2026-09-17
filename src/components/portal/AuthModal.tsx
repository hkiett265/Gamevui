import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { X, User, Lock, Mail, Eye, EyeOff, Sparkles, LogIn, UserPlus } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const {
    isAuthModalOpen,
    authMode,
    closeAuthModal,
    setAuthMode,
    login,
    register
  } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form states
  const [identifier, setIdentifier] = useState(''); // username or email for login
  const [username, setUsername] = useState(''); // username for register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen || !mounted) return null;

  const handleSwitchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập hoặc email');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    const result = await login(identifier, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Đăng nhập thất bại');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || username.trim().length < 3) {
      setErrorMessage('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    const result = await register(username, password, email);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Đăng ký thất bại');
    }
  };

  return createPortal(
    <div
      onClick={closeAuthModal}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(2, 6, 23, 0.82)',
        backdropFilter: 'blur(10px)',
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 24,
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.25)',
          padding: '28px 24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title="Đóng"
        >
          <X size={18} />
        </button>

        {/* Brand Tag */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '11px',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={14} />
            <span>HỒ KIỆT – GAMEVUI 24H</span>
          </div>

          <h2
            style={{
              margin: '6px 0 0',
              fontSize: '24px',
              fontWeight: 900,
              color: '#ffffff'
            }}
          >
            {authMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: 4,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: 'none',
              background: authMode === 'login' ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'transparent',
              color: authMode === 'login' ? '#ffffff' : '#94a3b8',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={16} />
            <span>Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('register')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: 'none',
              background: authMode === 'register' ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'transparent',
              color: authMode === 'register' ? '#ffffff' : '#94a3b8',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={16} />
            <span>Đăng ký</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #f87171',
              color: '#fca5a5',
              fontSize: '13px',
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Forms */}
        {authMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Identifier */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Tên đăng nhập hoặc Email
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Nhập username hoặc email..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: 6,
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                border: '1px solid #bae6fd',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 900,
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Đang xác thực...' : 'ĐĂNG NHẬP NGAY'}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Tên đăng nhập <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Ví dụ: kietho24h"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Email (tùy chọn)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="email"
                  placeholder="Địa chỉ email để khôi phục..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Mật khẩu (tối thiểu 6 ký tự) <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tạo mật khẩu an toàn..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                Xác nhận lại mật khẩu <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu trên..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: 6,
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                border: '1px solid #fecdd3',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 900,
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'HOÀN TẤT ĐĂNG KÝ'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
