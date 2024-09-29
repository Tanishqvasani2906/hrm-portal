import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Employee = createApi({
  reducerPath: "Employee",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/employee/",
  }),
  endpoints: (builder) => ({
    fetchEmployee: builder.mutation({
      query: ({ emp_id, access_token }) => ({
        url: `fetchEmployee/${emp_id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    fetchAttendance: builder.mutation({
      query: (access_token) => ({
        url: "attendance/user/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    addEmployee: builder.mutation({
      query: ({ employeeData, access_token }) => ({
        url: "addEmployee/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: employeeData,
      }),
    }),
    fetchAllEmployees: builder.mutation({
      query: (access_token) => ({
        url: "fetchAllEmployees/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    updateEmployee: builder.mutation({
      query: ({ emp_id, employeeData, access_token }) => ({
        url: `updateEmployee/${emp_id}/`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: employeeData,
      }),
    }),
  }),
});

export const {
  useFetchEmployeeMutation,
  useAddEmployeeMutation,
  useFetchAllEmployeesMutation,
  useUpdateEmployeeMutation,
} = Employee;
