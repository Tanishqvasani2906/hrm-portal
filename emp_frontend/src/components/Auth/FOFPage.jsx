import FOF_bg from "../../static/images/FOFPage.svg";
import auth_bg3 from "../../static/images/auth_bg3.svg";
import { Link } from "react-router-dom";

const FOFPage = () => {
  return (
    <div className="relative flex h-screen items-center justify-center">
      {/* Background image (auth_bg3) */}
      <img
        src={auth_bg3}
        alt="auth background"
        className="absolute hidden lg:block right-0 bottom-0 lg:w-3/6 h-auto z-0"
      />

      {/* Content and image container */}
      <div className="relative flex flex-row items-center justify-between w-11/12 lg:w-9/12 z-10">
        {/* Left side: Text */}
        <div className="flex flex-col gap-10 items-start lg:w-1/2 space-y-4">
          <h1 className="text-9xl roboto-bold text-form_base">Oops!</h1>
          <div className="">
            <h2 className="text-5xl mb-8 roboto-bold text-black">
              Not Enough Data
            </h2>
            <p className="text-lg text-black font-metrophobic max-w-80">
              You are seeing this page because this URL does not exist. Please
              report to us if you think this is an error.
            </p>
          </div>
        </div>

        {/* Right side: Image (FOF_bg) */}
        <div className="md:fixed lg:fixed md:w-3/6 md:mt-[-150px] md:ml-[500px] lg:w-3/6 lg:mt-[-150px] lg:ml-[500px]">
          <img
            src={FOF_bg}
            alt="FOF background"
            className="hidden md:block lg:block w-full h-auto"
          />
        </div>
      </div>

      {/* Button positioned at the bottom-center */}
      <Link
        to="/"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <button className="px-10 py-3 font-metrophobic bg-form_base mb-20 text-white text-lg rounded-lg hover:bg-teal-700">
          Back to home
        </button>
      </Link>
    </div>
  );
};

export default FOFPage;

// import React from "react";
// import FOF_bg from "../../static/images/FOFPage.svg";
// import auth_bg3 from "../../static/images/auth_bg3.svg";
// import { Link } from "react-router-dom";

// const FOFPage = () => {
//   return (
//     <div className="flex items-center justify-center h-screen bg-white">
//       {/* Background image with the robot */}
//       <div className="relative flex justify-end w-3/6">
//         <img
//           src={FOF_bg}
//           alt="FOF background"
//           className="w-full h-auto object-cover"
//         />
//       </div>

//       {/* Content Section */}
//       <div className="flex flex-col items-start justify-center w-2/6">
//         <h1 className="text-6xl font-bold text-teal-600">Oops!</h1>
//         <h2 className="text-3xl font-semibold text-black mt-2">
//           Not Enough Data
//         </h2>
//         <p className="text-gray-700 mt-4">
//           You are seeing this page because this URL does not exist. Please
//           report to us if you think this is an error.
//         </p>

//         <Link to="/" className="mt-8">
//           <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
//             Back to home
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default FOFPage;
