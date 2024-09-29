import React, { useRef, useState } from "react";
import StyledDateForLeave from "../../materialUI/StyledDateForLeave";

function CreateNewLeave({ handleClose, handleSubmit, serverError }) {
  const access_token = localStorage.getItem("access_token");
  const email = localStorage.getItem("email");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [errors, setErrors] = useState({});

  const leave_type = useRef();
  const reason = useRef();
  const pending_work_of_employee = useRef();

  const validateForm = () => {
    let formErrors = {};

    if (!leave_type.current.value.trim()) {
      formErrors.leave_type = "Leave type is required";
    }

    if (!fromDate) {
      formErrors.from_date = "From date is required";
    }

    if (!toDate) {
      formErrors.to_date = "To date is required";
    }

    if (fromDate && toDate && fromDate > toDate) {
      formErrors.date_range = "From date cannot be after To date";
    }

    if (!reason.current.value.trim()) {
      formErrors.reason = "Reason is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      handleSubmit({
        event,
        email,
        leave_type: leave_type.current.value,
        fromDate,
        toDate,
        reason: reason.current.value,
        pending_work_of_employee: pending_work_of_employee.current.value,
      });
    }
  };

  return (
    <div className="bg-white p-3 md:p-8 lg:p-8 mb-4 rounded-lg shadow-xl w-full max-w-lg mx-3 mt-12 sm:mt-24">
      <h2 className="text-2xl font-semibold mb-6 text-primary_color text-center">
        Create New Leave
      </h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="email" className="block roboto-regular text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="leave_type"
            className="block roboto-regular text-gray-700"
          >
            Leave Type
          </label>
          <input
            type="text"
            id="leave_type"
            ref={leave_type}
            className={`w-full px-4 py-2 pl-2 mt-2 border ${
              errors.leave_type ? "border-red-500" : "border-[#aaa]"
            } rounded-md focus:outline-none focus:ring-1 ${
              errors.leave_type ? "focus:ring-red-600" : "focus:ring-blue-600"
            }`}
          />
          {errors.leave_type && (
            <p className="text-red-500 text-sm mt-1">{errors.leave_type}</p>
          )}
        </div>
        <div className="flex justify-between w-full mb-5">
          <StyledDateForLeave
            label="From Date"
            onChange={(newValue) => setFromDate(newValue)}
            error={!!errors.from_date || !!errors.date_range}
            helperText={errors.from_date || errors.date_range}
            className="w-full sm:w-auto mb-4 sm:mb-0"
            format="YYYY-MM-DD"
          />
          <StyledDateForLeave
            label="To Date"
            onChange={(newValue) => setToDate(newValue)}
            error={!!errors.to_date || !!errors.date_range}
            helperText={errors.to_date || errors.date_range}
            className="w-full sm:w-auto mb-4 sm:mb-0"
            format="YYYY-MM-DD"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="reason"
            className="block roboto-regular text-gray-700"
          >
            Reason
          </label>
          <input
            type="text"
            id="reason"
            ref={reason}
            className={`w-full px-4 py-2 pl-2 mt-2 border ${
              errors.reason ? "border-red-500" : "border-[#aaa]"
            } rounded-md focus:outline-none focus:ring-1 ${
              errors.reason ? "focus:ring-red-600" : "focus:ring-blue-600"
            }`}
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="pending_work_of_employee"
            className="block roboto-regular text-gray-700"
          >
            Pending Work
          </label>
          <input
            type="text"
            id="pending_work_of_employee"
            ref={pending_work_of_employee}
            className="w-full px-4 py-2 pl-2 mt-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary_color text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewLeave;
