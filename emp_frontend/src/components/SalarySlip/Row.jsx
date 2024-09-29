import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { FiDownload } from "react-icons/fi";
import { pdf } from "@react-pdf/renderer";
import SalarySlipDocument from "./SalarySlipDocument";

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const handleDownloadClick = async () => {
    try {
      const blob = await pdf(<SalarySlipDocument salarySlip={row} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${row.salary_slip_number}_salary_slip.pdf`;
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
        <TableCell>{row.salary_slip_number}</TableCell>
        <TableCell>{row.month}</TableCell>
        <TableCell>{row.year}</TableCell>
        <TableCell>{row.basic_salary}</TableCell>
        <TableCell>{row.net_pay}</TableCell>
        <TableCell>
          <IconButton onClick={handleDownloadClick}>
            <FiDownload />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
                    Prepared By:
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {row.prepared_by ? row.prepared_by : "None"}
                  </TableCell>
                </TableRow>
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
                    Approved By:
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {row.approved_by ? row.approved_by : "None"}
                  </TableCell>
                </TableRow>
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
                    Deductions:
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {row.deductions ? row.deductions : "None"}
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
