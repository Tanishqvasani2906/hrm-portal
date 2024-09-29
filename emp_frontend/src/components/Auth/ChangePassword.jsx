import { useEffect, useRef, useState } from "react";
import auth_bg from "../../static/images/change_pass_bg.svg";
import auth_bg3 from "../../static/images/auth_bg3.svg";
import { useNavigate } from "react-router-dom";
import { useChangepasswordMutation } from "../../services/UserAuthApi";
import { useSnackbar } from "notistack";
import { removeToken } from "../../services/LocalStorageServices";

const ChangePassword = () => {
  const [changepassword] = useChangepasswordMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const currentpassword = useRef();
  const password = useRef();
  const password2 = useRef();
  const access_token = localStorage.getItem("access_token");
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    let errors = {};
    const currentPass = currentpassword.current.value;
    const newPass = password.current.value;
    const confirmPass = password2.current.value;

    if (!currentPass) {
      errors.currentpassword = "Current password is required";
    }

    if (!newPass) {
      errors.password = "New password is required";
    } else if (newPass.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        newPass
      )
    ) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (!confirmPass) {
      errors.password2 = "Please confirm your new password";
    } else if (confirmPass !== newPass) {
      errors.password2 = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const data = {
      currentpassword: currentpassword.current.value,
      newpassword: password.current.value,
      cnewpassword: password2.current.value,
    };

    try {
      const response = await changepassword({ data, access_token });

      if (response.error) {
        if (response.error.data.errors.non_field_errors) {
          enqueueSnackbar(response.error.data.errors.non_field_errors[0], {
            variant: "error",
            autoHideDuration: 3000,
          });
        } else if (response.error.data.errors.messages[0].message) {
          enqueueSnackbar(response.error.data.errors.messages[0].message, {
            variant: "error",
            autoHideDuration: 3000,
          });
          const interval = setInterval(() => {
            removeToken("access_token", "refresh_token");
            navigate("/login");
            clearInterval(interval);
          }, 2000);
        } else {
          setServerError(response.error.data.errors);
        }
      }

      if (response.data) {
        enqueueSnackbar("Password changed successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
        const interval = setInterval(() => {
          removeToken("access_token", "refresh_token");
          navigate("/passwordChanged");
          clearInterval(interval);
        }, 1000);
      }
    } catch (error) {
      console.error("Change password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex h-screen items-center justify-center">
        <img
          src={auth_bg3}
          alt="auth background"
          className="hidden mb-96 md:fixed lg:fixed md:block lg:block md:w-4/6 lg:w-3/6 h-auto md:ml-20 lg:ml-32 md:mb-0 lg:mb-0 right-0"
        />
        <div className="absolute bottom-0 left-0 w-full">
          <img
            src={auth_bg}
            alt="auth background"
            className="md:w-2/6 lg:w-2/6 h-auto md:ml-20 lg:ml-32"
          />
        </div>
        <div className="relative bg-[#FFFFFF] -mt-52 overflow-hidden rounded-md shadow-lg max-w-sm w-full md:top-0">
          <div className="w-auto">
            <h2 className="text-2xl text-left pl-6 bg-form_base text-white py-4 arimo-regular">
              Change Password
            </h2>
          </div>
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="currpassword"
                className="block arimo-regular text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currpassword"
                ref={currentpassword}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${
                  serverError || formErrors.currentpassword
                    ? "border-red-500 focus:ring-red-600"
                    : "focus:ring-blue-600"
                }`}
              />
              {(serverError?.currentpassword || formErrors.currentpassword) && (
                <p className="text-red-500 text-sm mt-1">
                  {serverError?.currentpassword || formErrors.currentpassword}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block arimo-regular text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                ref={password}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${
                  serverError || formErrors.password
                    ? "border-red-500 focus:ring-red-600"
                    : "focus:ring-blue-600"
                }`}
              />
              {(serverError?.password || formErrors.password) && (
                <p className="text-red-500 text-sm mt-1">
                  {serverError?.password || formErrors.password}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password2"
                className="block arimo-regular text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="password2"
                ref={password2}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 ${
                  serverError || formErrors.password2
                    ? "border-red-500 focus:ring-red-600"
                    : "focus:ring-blue-600"
                }`}
              />
              {(serverError?.password2 || formErrors.password2) && (
                <p className="text-red-500 text-sm mt-1">
                  {serverError?.password2 || formErrors.password2}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-form_base w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
