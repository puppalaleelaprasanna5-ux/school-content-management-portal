import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>

      {/* Logo */}

      <div className="mb-8 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl">
          <GraduationCap
            className="text-white"
            size={38}
          />
        </div>
      </div>

      {/* Heading */}

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Welcome Back
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          Login to continue
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleLogin}
        className="space-y-7"
      >
        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email Address
          </label>

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <div className="relative">
            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="pr-14"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Remember */}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

            Remember Me
          </label>

          <Link
            to="/activate"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Activate School
          </Link>
        </div>

        {/* Button */}

        <Button
          loading={loading}
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
}