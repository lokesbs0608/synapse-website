"use client";
import Link from "next/link.js";
import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { login } from "@/services/auth";
import { authenticate } from "@/network/helper";
import Loader from "../loader";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setFormError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!email.trim()) {
      setFormError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setFormError("Please enter your password");
      return;
    }

    setFormError("");

    try {
      setLoading(true)
      const response = await login({ email, password });

      // Call authenticate and pass a next callback
      await authenticate(response, () => {
        toast.success(response.message || "Login successful!");
        router.push("/home");
      });

    } catch (err) {
      // Toast already handled inside login()
      console.error("Login error", err);
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  };


  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      {loading && <Loader />}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#195B48] mt-8 mb-2">Enter your Email Id</h1>
      <p className="text-base md:text-lg font-normal text-center text-[#195B48] mb-8">Access your Synapse dashboard and tools</p>
      <div className="w-full max-w-md bg-white border border-[#195B48]/30 rounded-xl p-8 md:p-10 flex flex-col items-center shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-[#195B48] mb-1 w-full text-left">Enter your Email Id</h2>
        <p className="text-base font-normal text-[#195B48] mb-6 w-full text-left">Enter your credentials to access your account</p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label className="frm-label" htmlFor="email">
              Email
            </label>
            <input
              className="w-full frm-input focus:outline-none"
              type="email"
              id="email"
              placeholder="example@synapse.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="frm-label" htmlFor="password">
              Password
            </label>
            <input
              className="w-full frm-input focus:outline-none"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button className="w-full bg-[#195B48] text-white font-semibold rounded-md py-2.5 text-base mt-2 mb-2 hover:bg-[#174a3a] transition-colors" type="submit">
            Sign In
          </button>
        </form>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-2 w-full">
          <p className="font-semibold text-base text-[#195B48] text-center sm:text-left mb-2 sm:mb-0">Don&apos;t have an account?</p>
          <Link
            href="/signup"
            className="font-semibold text-base text-[#195B48] hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
