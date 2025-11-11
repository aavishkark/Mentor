import React from 'react';
import { SignIn } from "@clerk/nextjs";
import './login.css';
const Login = () => {
  return (
    <main className="login">
        <SignIn />;
    </main>
  );
};

export default Login;