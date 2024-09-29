import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

const StyledDateForSalarySlip = ({
  label,
  className,
  error,
  helperText,
  format = "YYYY-MM-DD", // Default format
  minDate = dayjs(), // Default minimum date
  width = "100%", // Default width
  height = "40px", // Default height
  borderColor = "#aaa", // Default border color
  focusBorderColor = "#2563eb", // Border color on focus (blue-500)
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        <label className="block roboto-regular text-gray-700 mb-2">
          {label}
        </label>
        <DatePicker
          {...props}
          format={format}
          minDate={minDate}
          slotProps={{
            textField: {
              variant: "outlined",
              error: error,
              helperText: helperText,
              sx: {
                width: width,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                  height: height,
                  color: "#000",
                  "& fieldset": {
                    borderColor: borderColor,
                  },
                  "&:hover fieldset": {
                    borderColor: borderColor,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: focusBorderColor,
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
                "& .MuiInputBase-input": {
                  padding: "10px",
                  fontSize: "16px",
                },
                "& .MuiFormHelperText-root": {
                  marginTop: "4px",
                },
              },
            },
          }}
        />
        {error && helperText && (
          <p className="text-red-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default StyledDateForSalarySlip;
