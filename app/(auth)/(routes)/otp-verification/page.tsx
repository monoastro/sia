//done
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('registrationEmail');
    if (storedEmail)
	{
      setEmail(storedEmail);
    }
	else 
	{
      router.push('/register');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verificationData = JSON.stringify({
      email,
      otp_code: otp,
      request_type: "signup"
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://electrocord.onrender.com/api/v1/auth/activate/',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: verificationData
    };

    try
	{
      const response = await axios.request(config);
      //console.log(JSON.stringify(response.data));
      if (response.data.statusCode === 200) 
	{
        console.log('Account activated successfully');
        localStorage.removeItem('registrationEmail');
        router.push('/login');
      } else {
        alert('Account activation failed!');
      }
    } catch (error) {
      console.error('Error during account activation:', error);
      alert(`An error occurred during account activation: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-blue-100">
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-3xl">Activate Your Account</CardTitle>
        <CardTitle>Enter the OTP sent to your email</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              id="otp"
              name="otp"
              required
              placeholder="Enter OTP"
              className="mt-1 block w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600">
            ACTIVATE ACCOUNT
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="font-semibold text-sm text-blue-600 hover:underline">
          <a href="/register">Didn't receive OTP? Register again</a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default OtpVerificationPage;
