import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

const StyledDateForEmployee = ({
  label,
  className,
  value,
  error,
  helperText,
  format = "YYYY-MM-DD",
  minDate = dayjs(),
  width = "100%",
  height = "40px",
  borderColor = "#aaa",
  focusBorderColor = "#2563eb",
  onChange,
  ...props
}) => {
  const dateValue = value ? dayjs(value) : null;
  const handleDateChange = (newValue) => {
    onChange(newValue ? newValue.format(format) : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        <label className="block roboto-regular text-gray-700 mb-2">
          {label}
        </label>
        <DatePicker
          {...props}
          format={format}
          value={dateValue}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
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

export default StyledDateForEmployee;
