import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { UserAuthApi } from "../services/UserAuthApi";
import { LeaveManagement } from "../services/LeaveManagement";
import { SalarySlip } from "..//services/SalarySlip";
import { Employee } from "../services/Employee";
import { Dashboard } from "../services/Dashboard";
import { Attendance } from "../services/Attendance";
import { Notice } from "../services/Notice";

export const store = configureStore({
  reducer: {
    [UserAuthApi.reducerPath]: UserAuthApi.reducer,
    [LeaveManagement.reducerPath]: LeaveManagement.reducer,
    [SalarySlip.reducerPath]: SalarySlip.reducer,
    [Employee.reducerPath]: Employee.reducer,
    [Dashboard.reducerPath]: Dashboard.reducer,
    [Attendance.reducerPath]: Attendance.reducer,
    [Notice.reducerPath]: Notice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      UserAuthApi.middleware,
      LeaveManagement.middleware,
      SalarySlip.middleware,
      Employee.middleware,
      Dashboard.middleware,
      Attendance.middleware,
      Notice.middleware
    ),
});

setupListeners(store.dispatch);
