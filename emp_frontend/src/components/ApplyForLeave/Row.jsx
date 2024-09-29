import React, { useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

const Row = (props) => {
  const { row } = props;
  const { is_admin } = props;
  const { handleSelect } = props;
  const select = useRef();
  const [open, setOpen] = useState(false);

  const handleChildSelect = (event) => {
    const newStatus = event.target.value;
    console.log(row);
    console.log("Selected status:", newStatus);
    handleSelect(row.ID, newStatus); // Pass row ID and new status
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {is_admin ? (
          <TableCell>{row.emp_id}</TableCell>
        ) : (
          <TableCell>{row.is_admin ? "Admin" : "Employee"}</TableCell>
        )}
        <TableCell>{row.leave_type}</TableCell>
        <TableCell>{row.from_date}</TableCell>
        <TableCell>{row.to_date}</TableCell>
        {is_admin ? (
          <TableCell>
            <select
              className="border border-primary_color text-[#01008A] rounded-md px-4 h-[35px] w-[150px] sm:mb-0"
              onChange={handleChildSelect}
              value={props.selectedStatus || "Select"}
            >
              <option value="Select">Select</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PENDING">PENDING</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </TableCell>
        ) : (
          <TableCell>
            <span
              style={{
                background:
                  row.status === "APPROVED"
                    ? "#0094E7"
                    : row.status === "PENDING"
                    ? "#FF9600"
                    : row.status === "REJECTED"
                    ? "#FF0743"
                    : "transparent",
                padding: "9px 20px",
                fontSize: ".8rem",
                borderRadius: "20px",
                color: "white",
              }}
            >
              {row.status}
            </span>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* <div className="p-4"> */}
            <Table size="small" aria-label="details">
              <TableBody>
                <TableRow>
                  <div className="felx justify-start">
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        borderBottom: "none",
                        minWidth: "150px",
                        fontWeight: "600",
                      }}
                    >
                      Reason :
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.reason ? row.reason : "None"}
                    </TableCell>
                  </div>
                </TableRow>
                <TableRow>
                  <div className="felx justify-start">
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        borderBottom: "none",
                        minWidth: "150px",
                        fontWeight: "600",
                      }}
                    >
                      Pending Work :
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.pending_work_of_employee
                        ? row.pending_work_of_employee
                        : "None"}
                    </TableCell>
                  </div>
                </TableRow>
                {is_admin ? (
                  <TableRow>
                    <div className="felx justify-start">
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderBottom: "none",
                          minWidth: "150px",
                          fontWeight: "600",
                        }}
                      >
                        Status :
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {row.status ? row.status : "None"}
                      </TableCell>
                    </div>
                  </TableRow>
                ) : (
                  ""
                )}
              </TableBody>
            </Table>
            {/* </div> */}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
