import auth_bg from "../../static/images/auth_bg.svg";
import auth_bg3 from "../../static/images/auth_bg3.svg";

const EmailSent = () => {
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
      <div className="relative bg-white -mt-52 overflow-hidden rounded-md shadow-lg max-w-sm w-80 md:top-0">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <p className="text-center text-gray-700">
            If your email exists in our database, you'll receive a password
            recovery link at your email address in a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
