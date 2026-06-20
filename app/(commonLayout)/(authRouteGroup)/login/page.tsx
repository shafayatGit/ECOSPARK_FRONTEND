import LoginForm from "@/components/modules/Auth/LoginForm";
import React, { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="text-center p-4">Loading Login Form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;

