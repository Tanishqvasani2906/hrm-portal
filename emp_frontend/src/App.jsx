import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { VscThreeBars } from "react-icons/vsc";
import { RxCross1 } from "react-icons/rx";
import "./App.css";
import { useNavigate, Outlet } from "react-router-dom";
import { removeToken } from "./services/LocalStorageServices";
import { jwtDecode } from "jwt-decode";
import { SnackbarProvider } from "notistack";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  useEffect(() => {
    if (isTokenExpired(token)) {
      removeToken("access_token", "refresh_token");
      navigate("/login");
    }
    const checkToken = () => {
      if (token) {
        if (isTokenExpired(token)) {
          removeToken("access_token", "refresh_token");
          localStorage.removeItem("username", "email");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    const intervalId = setInterval(checkToken, 1000);

    return () => clearInterval(intervalId);
  }, [token, navigate]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`fixed z-40 md:relative lg:relative md:z-auto w-64 ml-5`}>
        <SnackbarProvider maxSnack={3}>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </SnackbarProvider>
        {isOpen ? <RxCross1 /> : <VscThreeBars />}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />

        {/* Extra components */}
        <div className="mt-20 mx-3 p-4 w-auto md:mt-14 sm:will-change-contents">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
