import React from "react";
import { Link, useNavigate } from "react-router-dom";
import change_pass_bg from "../../static/images/change_pass_bg.svg";
import auth_bg3 from "../../static/images/auth_bg3.svg";
import PassChange from "../../static/images/PassChange.svg";

const GoToLogin = () => {
  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-50 overflow-hidden">
      <img
        src={auth_bg3}
        alt="auth background"
        className="hidden md:block fixed right-0 top-0 w-2/5 h-auto"
      />
      <div className="absolute bottom-0 left-16 w-full">
        <img
          src={change_pass_bg}
          alt="auth background"
          className="w-1/3 h-auto"
        />
      </div>
      <img
        src={auth_bg3}
        alt="auth background"
        className="hidden md:block fixed right-0 top-0 w-2/4 h-auto"
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mb-20">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <img src={PassChange} alt="auth background" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-2">
            Your password successfully updated 🎉
          </h2>

          <Link
            to="/login"
            className="text-center mt-6 w-full bg-form_base text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-200"
          >
            Login now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoToLogin;
