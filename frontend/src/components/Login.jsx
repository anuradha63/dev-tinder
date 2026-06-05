import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL, USER_SIGNUP } from "../utils/constants";

const Login = () => {
  const location = useLocation();
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  // Clear login fields if redirected from account deletion
  useEffect(() => {
    if (location.state && location.state.resetLogin) {
      setEmailId("");
      setPassword("");
    }
  }, [location.state]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const result = await axios.post(
        USER_SIGNUP,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(result.data.data));
      alert("Profile created successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed.");
      console.error(err);
    }
  };

  const handleLogin = async () => {
    if (!emailId || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      const result = await axios.post(
        LOGIN_URL,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(result.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
      if (err?.response?.status !== 400) console.error(err);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10" />
      <div className="flex justify-center items-center h-full w-full px-4">
        <div className="bg-white/90 rounded-3xl shadow-2xl w-full max-w-md px-8 py-5 flex flex-col items-center border border-gray-100 backdrop-blur-lg overflow-y-auto max-h-full">
          <h2 className="text-3xl font-extrabold text-primary mb-2 text-center tracking-tight drop-shadow-sm">
            {isLoginForm ? "Welcome Back!" : "Create your account"}
          </h2>
          <p className="text-gray-500 mb-6 text-center text-base font-medium">
            {isLoginForm
              ? "Log in to connect and explore the dev community."
              : "Sign up to find and connect with amazing developers."}
          </p>

          <div className="w-full flex flex-col gap-5">
            {!isLoginForm && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input input-md bg-white border border-gray-400 text-gray-900 w-full pl-3 py-2 rounded-lg"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="input input-md bg-white border border-gray-400 text-gray-900 w-full pl-3 py-2 rounded-lg"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Email ID
              </label>
              <input
                type="email"
                className="input input-md bg-white border border-gray-400 text-gray-900 w-full pl-3 py-2 rounded-lg"
                placeholder="Email Address"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="input input-md bg-white border border-gray-400 text-gray-900 w-full pl-3 py-2 rounded-lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-center mt-2 animate-pulse">
                {error}
              </p>
            )}

            <div className="mt-2 w-full">
              <button
                className="btn btn-primary w-full text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-all"
                onClick={isLoginForm ? handleLogin : handleSignup}
              >
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>

            <div className="w-full flex justify-center">
              <button
                className="text-primary font-semibold hover:underline hover:text-primary-focus"
                onClick={() => setIsLoginForm((prev) => !prev)}
              >
                {isLoginForm
                  ? "New user? Sign up here"
                  : "Existing user? Login here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
