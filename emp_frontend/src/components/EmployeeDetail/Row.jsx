import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Row = ({ row, openEditForm, isMobile }) => {
  const [open, setOpen] = useState(false);

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
        {!isMobile && (
          <>
            <TableCell>{row.emp_id}</TableCell>
            <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
          </>
        )}
        <TableCell>{row.working_emailid}</TableCell>
        {!isMobile && (
          <>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.working_designation}</TableCell>
          </>
        )}
        <TableCell>
          <IconButton
            sx={{ fontSize: 18, color: "red" }}
            onClick={() => openEditForm(row)}
          >
            Edit
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="p-4">
              {isMobile && (
                <>
                  <Typography variant="h6" gutterBottom component="div">
                    {`${row.first_name} ${row.last_name}`}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Employee ID: {row.emp_id}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Department: {row.department}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Designation: {row.working_designation}
                  </Typography>
                </>
              )}
              <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      Personal Email:
                    </TableCell>
                    <TableCell>{row.personal_mailid || "None"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      Salary:
                    </TableCell>
                    <TableCell>{row.salary || "None"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      Phone Number:
                    </TableCell>
                    <TableCell>{row.phone_number || "None"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      Date of Birth:
                    </TableCell>
                    <TableCell>{row.date_of_birth || "None"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      Date of Joining:
                    </TableCell>
                    <TableCell>{row.date_of_joining || "None"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "600" }}
                    >
                      Address:
                    </TableCell>
                    <TableCell>{row.address || "None"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
