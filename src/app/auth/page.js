"use client";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the AuthPage with ssr: false
const AuthPage = dynamic(() => import("../../components/AuthPage"), {
  ssr: false,
});

const Auth = () => {
  return (
    <AuthPage />
  );
};

export default Auth;
