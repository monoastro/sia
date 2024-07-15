"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  const handleSubmit = (e) => 
  {
    e.preventDefault();
    
	//Bibek's register api here
    if (password === confirmPassword) {
      setShouldRedirect(true);
    } else {
      alert("Passwords don't match!");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-blue-100">
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-3xl">Welcome!</CardTitle>
        <CardTitle>Register for SIA</CardTitle>
      </CardHeader>
      <CardContent>
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
              placeholder="Create a password" 
              className="mt-1 block w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              required 
              placeholder="Confirm password" 
              className="mt-1 block w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600">
            REGISTER
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="font-semibold text-sm text-blue-600 hover:underline">
          <a href="/login">Already have an account? Log in</a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegisterPage;
