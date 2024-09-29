import { useEffect, useRef, useState } from "react";
import auth_bg from "../../static/images/auth_bg.svg";
import auth_bg3 from "../../static/images/auth_bg3.svg";
import { useForgotpasswordMutation } from "../../services/UserAuthApi";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const ForgotPassword = () => {
  const [forgotPassword] = useForgotpasswordMutation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const email = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: email.current.value,
    };

    try {
      const response = await forgotPassword(data);

      if (response.error) {
        if (response.error.data.errors.non_field_errors) {
          enqueueSnackbar(response.error.data.errors.non_field_errors[0], {
            variant: "error",
            autoHideDuration: 3000,
          });
        } else {
          setServerError(response.error.data.errors);
        }
      }

      if (response.data) {
        navigate("/emailSent");
      }
    } catch (error) {
      console.error("Email sent error:", error);
    }
  };

  return (
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
            Forget Password
          </h2>
        </div>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block arimo-regular text-gray-700 "
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
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-form_base w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
