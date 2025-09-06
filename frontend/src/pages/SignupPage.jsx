import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function SignupPage() {
      const { setToken } = useContext(AuthContext);
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();

      const submit = async (e) => {
            e.preventDefault();
            if (!name || !email || !password) {
                  toast.error("Please fill all fields.");
                  return;
            }
            try {
                  setLoading(true);
                  const res = await api.post("/auth/signup", {
                        name,
                        email,
                        password,
                  });
                  const tok = res?.data?.token;
                  if (!tok) throw new Error("No token returned");
                  setToken(tok);
                  toast.success("Account created!");
                  navigate("/");
            } catch (err) {
                  // interceptor already shows error
            } finally {
                  setLoading(false);
            }
      };

      return (
            <main className="container py-10">
                  <div className="mx-auto max-w-md card p-6">
                        <h1 className="text-2xl font-bold mb-1">
                              Create your account
                        </h1>
                        <p className="text-sm text-gray-600 mb-6">
                              Join us and start shopping.
                        </p>

                        <form onSubmit={submit} className="space-y-4">
                              <div>
                                    <label className="block text-sm mb-1">
                                          Name
                                    </label>
                                    <input
                                          className="input"
                                          value={name}
                                          onChange={(e) =>
                                                setName(e.target.value)
                                          }
                                          placeholder="Your name"
                                    />
                              </div>
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
                                          placeholder="Create a strong password"
                                          autoComplete="new-password"
                                    />
                              </div>
                              <button
                                    className="btn btn-primary w-full"
                                    disabled={loading}
                              >
                                    {loading ? "Creating…" : "Sign up"}
                              </button>
                        </form>

                        <p className="mt-4 text-sm">
                              Already have an account?{" "}
                              <Link to="/login" className="underline">
                                    Log in
                              </Link>
                        </p>
                  </div>
            </main>
      );
}
