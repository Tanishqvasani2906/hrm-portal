import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./app/Store.jsx";
import Login from "./components/Auth/Login.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import { SnackbarProvider } from "notistack";
import EmailSent from "./components/Auth/EmailSent.jsx";
import ApplyForLeave from "./components/ApplyForLeave/ApplyForLeave.jsx";
import ChangePassword from "./components/Auth/ChangePassword.jsx";
import DashboardHeader from "./components/Dashboard/DashBoardHeader.jsx";
import SalarySlip from "./components/SalarySlip/SalarySlip.jsx";
import SalarySlipView from "./components/SalarySlip/SalarySlipView.jsx";
import FOFPage from "./components/Auth/FOFPage.jsx";
import GoToLogin from "./components/Auth/GoToLogin.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Calendar from "./components/Calender/Calender.jsx";
import NoticeList from "./components/Notice/NoticeList.jsx";
import Holiday from "./components/Holiday/Hoilday.jsx";
import Library from "./components/Library/Library.jsx";
import VerifyEmail from "./components/Auth/VerifyEmail.jsx";
import EmployeeDetails from "./components/EmployeeDetail/EmployeeDetails.jsx";
import Attendance from "./components/Attendance/Attendance.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    ),
    children: [
      {
        path: "",
        element: <DashboardHeader />,
        children: [
          {
            path: "",
            element: (
              <SnackbarProvider maxSnack={3}>
                <Dashboard />
              </SnackbarProvider>
            ),
          },
        ],
      },
      {
        path: "applyForLeave",
        element: (
          <SnackbarProvider maxSnack={3}>
            <ApplyForLeave />
          </SnackbarProvider>
        ),
      },
      {
        path: "library",
        element: (
          <SnackbarProvider maxSnack={3}>
            <Library />
          </SnackbarProvider>
        ),
      },
      {
        path: "holiday",
        element: (
          <SnackbarProvider maxSnack={3}>
            <Holiday />
          </SnackbarProvider>
        ),
      },
      {
        path: "notice",
        element: (
          <SnackbarProvider maxSnack={3}>
            <NoticeList />
          </SnackbarProvider>
        ),
      },
      {
        path: "salarySlip",
        element: (
          <SnackbarProvider maxSnack={3}>
            <SalarySlip />
          </SnackbarProvider>
        ),
      },
      {
        path: "salarySlipView",
        element: (
          <SnackbarProvider maxSnack={3}>
            <SalarySlipView />
          </SnackbarProvider>
        ),
      },
      {
        path: "employeeDetail",
        element: (
          <SnackbarProvider maxSnack={3}>
            <EmployeeDetails />
          </SnackbarProvider>
        ),
      },
      {
        path: "calendar",
        element: (
          <SnackbarProvider maxSnack={3}>
            <Calendar />
          </SnackbarProvider>
        ),
      },
      {
        path: "attendance",
        element: (
          <SnackbarProvider maxSnack={3}>
            <Attendance />
          </SnackbarProvider>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <SnackbarProvider maxSnack={3}>
        <Login />
      </SnackbarProvider>
    ),
  },
  {
    path: "/verifyEmail/:uid/:token",
    element: (
      <SnackbarProvider maxSnack={3}>
        <VerifyEmail />
      </SnackbarProvider>
    ),
  },
  {
    path: "/forgotPassword",
    element: (
      <SnackbarProvider maxSnack={3}>
        <ForgotPassword />
      </SnackbarProvider>
    ),
  },
  {
    path: "/changePassword",
    element: (
      <SnackbarProvider maxSnack={3}>
        <ChangePassword />
      </SnackbarProvider>
    ),
  },
  {
    path: "/resetPassword/:id/:token",
    element: (
      <SnackbarProvider maxSnack={3}>
        <ResetPassword />
      </SnackbarProvider>
    ),
  },
  {
    path: "/emailSent",
    element: <EmailSent />,
  },
  {
    path: "/passwordChanged",
    element: <GoToLogin />,
  },
  {
    path: "*",
    element: <FOFPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
