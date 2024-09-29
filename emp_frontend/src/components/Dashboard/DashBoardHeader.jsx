import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useFetchprofileMutation } from "../../services/UserAuthApi";
import { storeUserProfile } from "../../services/LocalStorageServices";
import Dh1_img from "../../static/images/Dashboardheader1.svg";
import Dh2_img from "../../static/images/Dashboardheader2.svg";

const DashboardHeader = () => {
  const [fetchprofile] = useFetchprofileMutation();
  const username = localStorage.getItem("username");
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchprofile(access_token);
        if (response.data) {
          storeUserProfile(response.data);
        }
      } catch (error) {
        console.error("Dashboard Profile fetch error:", error);
      }
    };

    fetchData();
  }, [access_token, fetchprofile]);

  return (
    <>
      <div className="mt-6 bg-elight_primary rounded-xl p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary_color">
              Hello {username} 👋
            </h1>
            <p className="text-primary_color text-lg mt-5 md:mt-1 lg:mt-1">
              You can manage your things from here
            </p>
          </div>
          <div className="hidden md:flex lg:flex items-center">
            <img src={Dh1_img} className="h-28 w-auto mr-2" alt="Decorative" />
            <h2 className="text-4xl font-bold text-primary_color mx-2">
              Welcome
            </h2>
            <img src={Dh2_img} className="h-28 w-auto ml-2" alt="Decorative" />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default DashboardHeader;
