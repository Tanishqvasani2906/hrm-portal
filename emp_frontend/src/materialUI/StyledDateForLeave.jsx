import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const StyledDateForLeave = ({
  label,
  className,
  error,
  helperText,
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
          format="YYYY-MM-DD"
          minDate={dayjs()}
          slotProps={{
            textField: {
              variant: "outlined",
              sx: {
                width: "180px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "5px",
                  // width: 160,
                  height: "35px",
                  color: "#000",
                  "& fieldset": {
                    borderColor: "#aaa",
                  },
                  "&:hover fieldset": {
                    borderColor: "#000",
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: "#000",
                },
              },
            },
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              fullWidth
              error={error}
              helperText={helperText}
            />
          )}
        />
        {error && helperText && (
          <p className="text-red-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default StyledDateForLeave;
