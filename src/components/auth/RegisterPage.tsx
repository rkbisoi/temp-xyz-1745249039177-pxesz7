import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { API_URL } from '../../data';
import { IntelQETextWhiteXL, IntelGraphics } from '../Icons';
import CryptoJS from 'crypto-js';
import {jwtDecode} from "jwt-decode";


export default function RegisterPage() {
    
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false,
    password: '',
    orgId: 0,
    confirmPassword: '',
    token: '',
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
    console.log(urlToken)
  }, [location.search]);


  useEffect(() => {
    if (token && typeof token === 'string') {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded) {
          setFormData({
            ...formData,
            email: decoded.email,
            isAdmin: decoded.admin,
            orgId: decoded.org_id,
            token: token,
          });
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFirstName = (firstName: string) => {
    if (!firstName.trim()) {
      toast.error("First name cannot be empty.");
      return false;
    }
    return true;
  };

  const validatePassword = (password: string, confirmPassword?: string) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFirstName(formData.firstName) || !validatePassword(formData.password, formData.confirmPassword)) {
      return;
    }

    setLoading(true);

    try {
        const encryptedPassword = encryptPassword(formData.password);
      
        const response = await fetch(`${API_URL}/registerUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: encryptedPassword,
            isAdmin: formData.isAdmin,
            orgId: formData.orgId,
            token: token
          }),
        });

        const data = await response.json();

      if (data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
  

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: false,
        password: '',
        orgId: 0,
        confirmPassword: '',
        token: '',
      });

    //setShowDialog(true);
    } catch (error) {
      let errorMessage = 'Failed to create user. Please try again later.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const encryptPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
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
          <h2 className="text-center text-xl font-bold text-intelQEDarkBlue mb-6">
            Create Account
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                disabled
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                // onBlur={handlePasswordBlur}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                // onBlur={handlePasswordBlur}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-intelQEDarkBlue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-sky-400"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="font-medium text-intelQEDarkBlue hover:text-sky-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}