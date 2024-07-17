"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import axios from 'axios';
import { setCookie } from 'cookies-next';




const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.stringify({
      email,
      password
    });

    const config = {
      method: 'post',
      url: 'https://electrocord.onrender.com/api/v1/auth/signin/',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: userData
    };

    try
	{
      const response = await axios.request(config);

	  console.log('Login successful:', response.data.data.token);
	  console.log(atob(response.data.data.token.split('.')[1]));

      setCookie('auth_token', response.data.data.token, {
        maxAge:  response.data.data.expiresIn,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      router.push('/application/dashboard');
    } 
	catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-9xl p-6 bg-blue-100">
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-3xl">Welcome back!</CardTitle>
        <CardTitle>Login to SIA</CardTitle>
      </CardHeader>

      <CardContent className="justify-center w-1/2 mx-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your college email"
              className="mt-1 block w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Password"
              className="mt-1 block w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="font-semibold text-sm text-blue-600 hover:underline">
            <Link href="/forgotPassword">Forgot your password?</Link>
          </p>

          <div className="w-full flex justify-center mx-auto">
            <Button type="submit" className="bg-blue-600 font-semibold hover:bg-indigo-600">
              LOG IN
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="justify-left w-1/2 mx-auto">
        <p className="font-semibold text-sm text-blue-600 hover:underline">
          <Link href="/register">Register your college id?</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;

