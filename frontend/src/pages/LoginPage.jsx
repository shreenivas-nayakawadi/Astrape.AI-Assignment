import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
      const { setToken } = useContext(AuthContext);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const location = useLocation();
      const from = location.state?.from?.pathname || "/";

      const submit = async (e) => {
            e.preventDefault();
            if (!email || !password) {
                  toast.error("Please fill in email and password.");
                  return;
            }
            try {
                  setLoading(true);
                  const res = await api.post("/auth/login", {
                        email,
                        password,
                  });
                  const tok = res?.data?.token;
                  if (!tok) throw new Error("No token returned");
                  setToken(tok);
                  toast.success("Welcome back!");
                  navigate(from, { replace: true });
            } catch (err) {
                  // interceptor shows error; optional local message:
                  // toast.error('Login failed');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <main className="container py-10">
                  <div className="mx-auto max-w-md card p-6">
                        <h1 className="text-2xl font-bold mb-1">Log in</h1>
                        <p className="text-sm text-gray-600 mb-6">
                              Access your account to continue.
                        </p>

                        <form onSubmit={submit} className="space-y-4">
                              <div>
                                    <label className="block text-sm mb-1">
                                          Email
                                    </label>
                                    <input
                                          className="input"
                                          type="email"
                                          value={email}
                                          onChange={(e) =>
                                                setEmail(e.target.value)
                                          }
                                          placeholder="you@example.com"
                                          autoComplete="email"
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm mb-1">
                                          Password
                                    </label>
                                    <input
                                          className="input"
                                          type="password"
                                          value={password}
                                          onChange={(e) =>
                                                setPassword(e.target.value)
                                          }
                                          placeholder="••••••••"
                                          autoComplete="current-password"
                                    />
                              </div>
                              <button
                                    className="btn btn-primary w-full"
                                    disabled={loading}
                              >
                                    {loading ? "Logging in…" : "Log in"}
                              </button>
                        </form>

                        <p className="mt-4 text-sm">
                              Don’t have an account?{" "}
                              <Link to="/signup" className="underline">
                                    Sign up
                              </Link>
                        </p>
                  </div>
            </main>
      );
}
