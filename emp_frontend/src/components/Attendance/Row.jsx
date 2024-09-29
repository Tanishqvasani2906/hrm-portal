import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Row = ({ empId, name, status, onStatusChange, isEditable }) => {
  const [open, setOpen] = useState(false);

  // console.log(empId, name, status);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{empId}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          <select
            value={status}
            onChange={(e) => onStatusChange(empId, e.target.value)}
            disabled={!isEditable}
            className={`border border-primary_color text-center text-[#01008A] h-9 rounded-md w-fit md:w-24 lg:w-15 ${
              isEditable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
          </select>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="details">
              <TableBody>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderBottom: "none",
                      minWidth: "150px",
                      fontWeight: "600",
                    }}
                  >
                    Additional Info:
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    No additional information available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
