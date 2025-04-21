import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OTPVerificationProps {
  email: string;
  isForgotPassword: boolean;
  onVerify: (otp: string, isForgotPassword: boolean, password: string) => void;
  onResendOTP: () => void;
  onClose: () => void;
}


export default function OTPVerification({ email, isForgotPassword, onVerify, onResendOTP, onClose }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return false;
    }

    if ((confirmPassword !== undefined) && (password !== confirmPassword)) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleVerify = () => {

    if(isForgotPassword && !validatePassword()){
      toast.error("Password Mistmatch!")
      return
    }

    const enteredOTP = otp.join('');

    if (enteredOTP !== '') {

      if (isForgotPassword && password !== '') {

        if (password !== '') {
          onVerify(enteredOTP, isForgotPassword, password);
        } else {
          toast.error('Please fill the password and try again.');
        }

      } else {
        onVerify(enteredOTP, isForgotPassword, password);
      }

    } else {
      toast.error('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
        <p className="text-gray-600 text-center mb-4">
          We've sent a verification code to<br />
          <span className="font-medium">{email}</span>
        </p>
        {/* <p className='items-center text-center mb-2 font-bold text-rose-600'>Enter 123456</p> */}
        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-intelQEDarkBlue focus:ring-2 focus:ring-intelQELightBlue outline-none"
            />
          ))}
        </div>

        {isForgotPassword && (
          <div className='mb-4'>
            <div className='mb-2'>
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
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirnPassword"
                name="confirnPassword"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

        )}

        <button
          onClick={handleVerify}
          disabled={otp.some(digit => !digit)}
          className="w-full bg-intelQEDarkBlue text-white py-3 rounded-lg font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
        >
          Verify
        </button>

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-gray-600">
              Resend code in <span className="font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={() => {
                setTimer(60)
                onResendOTP()
              }}
              className="text-intelQEDarkBlue hover:text-sky-700 font-medium"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}