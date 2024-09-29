import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../static/images/login.svg";
import { useLoginUserMutation } from "../../services/UserAuthApi";
import { storeToken } from "../../services/LocalStorageServices";
import { useSnackbar } from "notistack";

const Login = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    }
  }, []);

  const email = useRef();
  const password = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const response = await loginUser(data);

      if (response.error) {
        console.log(response.error);
        if (response.error.data.errors.non_field_errors) {
          console.log(response.error.data.errors.non_field_errors);
          enqueueSnackbar(response.error.data.errors.non_field_errors[0], {
            variant: "error",
            autoHideDuration: 3000,
          });
        } else {
          setServerError(response.error.data.errors);
        }
      }

      if (response.data) {
        storeToken(response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#E5E5E5]">
      {/* Left side with image */}
      <div className="sm:hidden md:flex-1 md:flex md:items-center md:justify-center lg:flex-1 lg:flex lg:items-center lg:justify-center">
        <img
          src={loginImage}
          alt="Login"
          className=" max-w-screen-sm h-auto hidden lg:block md:block"
        />
      </div>

      {/* Right side with form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="mx-3 md:w-full lg:w-full max-w-lg bg-[#FFFFFF] px-10 py-20 rounded-lg">
          <h2 className="text-4xl roboto-bold font-bold mb-4">Get Started</h2>
          <p className="text-gray-500 mb-10 mt-[20px]">
            Welcome to the Employee Governance Portal. Please log in to access
            your dashboard.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block roboto-regular text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                ref={email}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${
                  serverError
                    ? "border-red-500 focus:ring-red-600"
                    : "focus:ring-blue-600"
                }`}
              />
              {serverError && (
                <p className="text-red-500 text-sm mt-1">{serverError.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block roboto-regular text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                ref={password}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${
                  serverError
                    ? "border-red-500 focus:ring-red-600"
                    : "focus:ring-blue-600"
                }`}
              />
              {serverError && (
                <p className="text-red-500 text-sm mt-1">
                  {serverError.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-gray-700 roboto-regular text-sm">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgotPassword"
                className="text-gray-600 roboto-regular text-sm text-decoration-none"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-form_base text-white roboto-regular text-xl rounded-md hover:bg-green-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
