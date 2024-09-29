import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Attendance = createApi({
  reducerPath: "Attendance",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/attendance/",
  }),
  endpoints: (builder) => ({
    fetchAttendance: builder.mutation({
      query: (access_token) => ({
        url: "attendance/user/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    submitAttendance: builder.mutation({
      query: ({ access_token, attendanceData }) => ({
        url: "employeAttendance/add/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: attendanceData,
      }),
    }),
    submitDateAttendance: builder.mutation({
      query: ({ access_token, attendanceData, date }) => ({
        url: `employeAttendance/add/${date}/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: attendanceData,
      }),
    }),
    fetchDateAttendance: builder.query({
      query: ({ access_token, date }) => ({
        url: `employeAttendance/add/${date}/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    fetchTodayAttendance: builder.query({
      query: ({ access_token }) => ({
        url: `attendance/current/`, // Updated this line
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),
  }),
});

export const {
  useFetchAttendanceMutation,
  useSubmitAttendanceMutation,
  useFetchDateAttendanceQuery,
  useSubmitDateAttendanceMutation,
  useFetchTodayAttendanceQuery,
} = Attendance;
