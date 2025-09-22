import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, HandHeart } from "lucide-react";
import { loginUser } from "@/api/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const InputField = ({
  type,
  placeholder,
  icon,
  value,
  onChange,
  children,
}: {
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-100 border-2 border-gray-200 rounded-full pl-12 pr-4 py-3 focus:border-[#9188f1] focus:ring-2 focus:ring-[#9188f1]/50 outline-none transition"
      />
      {children && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {children}
        </div>
      )}
    </div>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { fetchUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msg = await loginUser(email, password);
      toast(msg);
      await fetchUser();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/practice");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data?.message);
      } else {
        console.error("Login failed");
      }
      toast("Login failed");
    }
  };

  return (
    <div className="bg-[#9188f1] min-h-screen flex flex-col items-center justify-center p-6">
      <header className="absolute top-6 left-6 text-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-4xl font-extrabold text-black hover:text-white transition-colors duration-200"
        >
          <HandHeart className="h-8 w-8" />
          Linkasa
        </Link>
      </header>

      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <img
            src="caddyshack.png"
            alt="Linkasa Mascot Waving"
            className="mx-auto mb-6 w-28 h-28 rounded-full"
          />

          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Welcome Back!
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <InputField
              type="email"
              placeholder="Email"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              icon={<Lock size={20} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputField>

            <button
              type="submit"
              className="my-4 w-full bg-[#dbf881] text-black font-bold py-3 rounded-full shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-none"
            >
              Login
            </button>
            <div className="text-center mt-2">
              <p className="text-[#9188f1]">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
