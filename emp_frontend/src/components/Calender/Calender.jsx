import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useFetchAttendanceMutation } from "../../services/Attendance";

const Calendar = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [monthName, setMonthName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [attendanceData, setAttendanceData] = useState([]);
  const [fetchAttendance] = useFetchAttendanceMutation();

  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    generateCalendar(selectedYear, selectedMonth);
    fetchAttendanceData();
  }, [selectedYear, selectedMonth]);

  const fetchAttendanceData = async () => {
    try {
      const data = await fetchAttendance(access_token).unwrap();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const generateCalendar = (year, month) => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const startDay = monthStart.getDay();
    const totalDays = monthEnd.getDate();

    const days = [
      ...Array(startDay).fill(null),
      ...Array.from(
        { length: totalDays },
        (_, i) => new Date(year, month, i + 1)
      ),
    ];

    setDaysInMonth(days);
    setMonthName(dayjs(monthStart).format("MMMM YYYY"));
  };

  const handleMonthChange = (e) => setSelectedMonth(Number(e.target.value));
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  const isToday = (date) => date && dayjs(date).isSame(dayjs(), "day");

  const getAttendanceStatus = (date) => {
    if (!date) return null;
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const attendance = attendanceData.find((att) =>
      dayjs(att.created_date).isSame(formattedDate, "day")
    );
    return attendance ? (attendance.is_present ? "present" : "absent") : null;
  };

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: dayjs().month(i).format("MMMM"),
  }));

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDayClass = (date, attendanceStatus) => {
    const baseClass =
      "relative aspect-square flex items-center justify-center border rounded-lg text-xs sm:text-base";
    const isPast = date && date < currentDate;

    if (attendanceStatus === "present")
      return `${baseClass} bg-green-500 text-white`;
    if (attendanceStatus === "absent")
      return `${baseClass} bg-red-500 text-white`;
    if (isToday(date))
      return `${baseClass} bg-primary_color text-white shadow-lg border-light_primary`;
    if (isPast) return `${baseClass} bg-elight_primary text-primary_color`;
    return `${baseClass} bg-white text-light_primary`;
  };

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto mt-4 sm:mt-10 p-2 sm:p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="w-full sm:w-auto p-2 text-base sm:text-lg bg-elight_primary text-primary_color rounded-md focus:outline-none"
        >
          {months.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <h2 className="text-xl sm:text-2xl font-semibold text-primary_color">
          {monthName}
        </h2>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="w-full sm:w-auto p-2 text-base sm:text-lg bg-elight_primary text-primary_color rounded-md focus:outline-none"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-semibold mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="uppercase text-light_primary text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysInMonth.map((date, index) => {
          const attendanceStatus = getAttendanceStatus(date);
          return (
            <div key={index} className={getDayClass(date, attendanceStatus)}>
              {date && (
                <div className="text-xl font-semibold">{date.getDate()}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
