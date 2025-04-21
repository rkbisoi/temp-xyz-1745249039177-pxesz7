import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import OTPVerification from './OTPVerification';
import { useAuth } from '../../contexts/AuthContext';
import { IntelQETextWhiteXL, IntelGraphics } from '../Icons';
import { API_URL } from '../../data';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const { signIn, verifyOTP, forgotPassword, verifyForgotPasswordOTP } = useAuth();
  const [sessnId, setSessnId] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            email: email,
            sessionId: sessnId
          }
        ),
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setSessnId(data.data.sessionId)
        toast.success("OTP Sent Successfully")
      } else {
        toast.error("Failed to Send OTP")
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {

      try {
        setLoading(true);
        const success = await forgotPassword(email);
        if (success) {
          setShowOTP(true);
        }
      } catch (error) {
        console.error('Failed to send OTP to Email. Please check your Email.');
      } finally {
        setLoading(false);
      }

    } else {

      try {
        setLoading(true);
        const { success, otpVerificationRequired, sessionId } = await signIn(email, password);

        if (success) {
          if (otpVerificationRequired) {
            setSessnId(sessionId);
            setShowOTP(true); // This should trigger the OTP modal
          } else {
            toast.success('Successfully logged in!');
          }
        }
      } catch (error) {
        toast.error('Failed to log in. Please check your credentials.');
      } finally {
        setLoading(false);
      }

    }


  };

  const handleOTPVerification = async (otp: string, isForgotPassword: boolean, password: string) => {
    try {

      if (isForgotPassword) {
        const response = await verifyForgotPasswordOTP(email, otp, password);
        if (response) {
          toast.success('OTP Verified & Password Reset Successfully');
          setIsForgotPassword(false)
          setShowOTP(false);
        } else {
          toast.error("OTP Verification & Password Reset Failed!")
        }
      } else {
        const response = await verifyOTP(email, otp, sessnId);
        if (response.success) {
          toast.success('OTP Verified Successfully');
          setShowOTP(false);
        } else {
          toast.error("OTP Verification Failed!")
        }
      }

    } catch (error) {
      toast.error('Failed to complete login.');
    }
  };

  return (
    <div className="relative min-h-screen bg-intelQEDarkBlue flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 right-0 z-0">
        <IntelGraphics className="w-20 h-20 sm:w-32 sm:h-32" />
      </div>
      <div className="flex flex-col items-center mt-12 mb-8 z-10">
        <div className=''>
          <IntelQETextWhiteXL />
        </div>
      </div>

      <div className="bg-sky-50 sm:w-96 w-full max-w-md py-8 px-4 sm:px-6 lg:px-8 border border-sky-400 rounded-lg z-10">
        <div className="w-full">
          <h2 className="text-center text-xl font-bold text-intelQEDarkBlue">
            Login
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {!isForgotPassword && <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>}
            </div>

            <div>
              {!isForgotPassword ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-intelQEDarkBlue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-gray-500"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-intelQEDarkBlue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-gray-500"
                >
                  {loading ? 'Sending OTP' : 'Send OTP'}
                </button>
              )}
            </div>
          </form>
          <div className="flex justify-center">
            {isForgotPassword ? (
              <button
              onClick={() => setIsForgotPassword(false)}
              className="flex justify-center items-center mt-4 text-sm text-intelQEDarkBlue font-medium"
            >
              <span>Login</span>
            </button>
            ) : (
              <button
              onClick={() => setIsForgotPassword(true)}
              className="flex justify-center items-center mt-4 text-sm text-intelQEDarkBlue font-medium"
            >
              <span>Forgot Password</span>
            </button>
            )}
          </div>
        </div>
      </div>

      {showOTP && (
        <OTPVerification
          email={email}
          isForgotPassword={isForgotPassword}
          onResendOTP={handleResendOTP}
          onVerify={handleOTPVerification}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}