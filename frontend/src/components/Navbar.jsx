import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const NavItem = ({ to, children }) => (
      <NavLink
            to={to}
            className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                  }`
            }
      >
            {children}
      </NavLink>
);

export default function Navbar() {
      const { token, setToken, cart } = useContext(AuthContext);
      const [open, setOpen] = useState(false);
      const navigate = useNavigate();

      const logout = () => {
            setToken("");
            toast.success("Logged out");
            navigate("/login");
      };

      const cartCount = cart.reduce((n, i) => n + (i.qty || 1), 0);

      return (
            <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
                  <div className="container flex h-16 items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-xl bg-gray-900 text-white grid place-content-center font-bold">
                                    A
                              </div>
                              <span className="font-semibold">Astrape</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-2">
                              <NavItem to="/">Items</NavItem>
                              <NavItem to="/cart">Cart ({cartCount})</NavItem>
                              {token ? (
                                    <button
                                          onClick={logout}
                                          className="btn btn-ghost"
                                    >
                                          Logout
                                    </button>
                              ) : (
                                    <>
                                          <NavItem to="/login">Login</NavItem>
                                          <NavItem to="/signup">Signup</NavItem>
                                    </>
                              )}
                        </nav>

                        <button
                              className="md:hidden btn btn-ghost"
                              onClick={() => setOpen((v) => !v)}
                              aria-label="Toggle Menu"
                        >
                              ☰
                        </button>
                  </div>

                  {open && (
                        <div className="md:hidden border-t bg-white">
                              <div className="container py-3 flex flex-col gap-2">
                                    <NavItem
                                          to="/"
                                          onClick={() => setOpen(false)}
                                    >
                                          Items
                                    </NavItem>
                                    <NavItem
                                          to="/cart"
                                          onClick={() => setOpen(false)}
                                    >
                                          Cart ({cartCount})
                                    </NavItem>
                                    {token ? (
                                          <button
                                                onClick={() => {
                                                      setOpen(false);
                                                      logout();
                                                }}
                                                className="btn btn-ghost w-fit"
                                          >
                                                Logout
                                          </button>
                                    ) : (
                                          <>
                                                <NavItem
                                                      to="/login"
                                                      onClick={() =>
                                                            setOpen(false)
                                                      }
                                                >
                                                      Login
                                                </NavItem>
                                                <NavItem
                                                      to="/signup"
                                                      onClick={() =>
                                                            setOpen(false)
                                                      }
                                                >
                                                      Signup
                                                </NavItem>
                                          </>
                                    )}
                              </div>
                        </div>
                  )}
            </header>
      );
}
