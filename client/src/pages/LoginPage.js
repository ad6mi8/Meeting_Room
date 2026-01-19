import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.sendOTP(email);
      if (response.success || response.message) {
        setStep('otp');
      } else {
        setError(response.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.verifyOTP(email, otp);
      if (response.success && response.token) {
        login(response.token);
        navigate('/');
      } else {
        setError(response.error || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome</h1>
            <p className="login-subtitle">
              Enter your email to receive a one-time password
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="login-form">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                disabled={loading}
                required
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={loading || !email}
                className="login-button"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="login-form">
              <div className="otp-info">
                <p>We've sent a 6-digit code to</p>
                <p className="otp-email">{email}</p>
              </div>
              <Input
                type="text"
                label="Enter OTP"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={error}
                disabled={loading}
                required
                autoFocus
                maxLength={6}
              />
              <div className="login-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Change Email
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={loading || otp.length !== 6}
                  className="login-button"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
