import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVerifyEmailMutation } from "../../services/UserAuthApi";
import { enqueueSnackbar } from "notistack";

const VerifyEmail = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const response = await verifyEmail({ uid, token }).unwrap();
        if (response) {
          setMessage(
            "Email verification successful! You will be redirected to Login..."
          );
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        setMessage(error.data.msg);
        enqueueSnackbar(error.data.msg, {
          variant: "error",
          autoHideDuration: 3000,
        });
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    verifyUserEmail();
  }, [uid, token, verifyEmail, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-primary_color text-center mb-4">
          Email Verification
        </h2>
        <p
          className={`text-center ${
            message.includes("successful") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
