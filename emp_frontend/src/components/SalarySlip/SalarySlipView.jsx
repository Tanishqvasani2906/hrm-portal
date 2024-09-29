import React, { useState, useEffect, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSnackbar } from "notistack";
import { useFetchSalarySlipsMutation } from "../../services/SalarySlip";
import dayjs from "dayjs";
import Row from "./Row";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import StyledDateForSalarySlipView from "../../materialUI/StyledDateForSalarySlipView";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";

const ROWS_PER_PAGE = 7;

const SalarySlipView = () => {
  const [reset, setReset] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const slipRef = useRef(null);

  const navigate = useNavigate();

  const [fetchSalarySlips] = useFetchSalarySlipsMutation();
  const [rows, setRows] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [serverError, setServerError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(0);
  const access_token = localStorage.getItem("access_token");

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue);

    if (!toDate || newValue.isAfter(toDate)) {
      setToDate(newValue.endOf("month"));
    }
  };

  const handleToDateChange = (newValue) => {
    setToDate(newValue);

    if (!fromDate || newValue.isBefore(fromDate)) {
      setFromDate(newValue.startOf("month"));
    }
  };

  // const token = localStorage.getItem("access_token");
  // const decodedToken = jwtDecode(token);
  // const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   if (decodedToken.is_admin && !isAdmin) {
  //     setIsAdmin(true);
  //     navigate("/salarySlip");
  //   } else if (!decodedToken.is_admin && isAdmin) {
  //     setIsAdmin(false);
  //   }
  // }, [decodedToken.is_admin, isAdmin, navigate]);

  const handleSearch = () => {
    const filtered = filteredData.filter((item) => {
      if (fromDate && toDate) {
        const itemDate = dayjs(`${item.month} ${item.year}`, "MMMM YYYY");
        const start = fromDate.startOf("month");
        const end = toDate.endOf("month");
        return itemDate.isBetween(start, end, null, "[]");
      }
      return true;
    });
    setRows(filtered);
  };

  const email = localStorage.getItem("email");

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setRowsPerPage(4);
      } else {
        setRowsPerPage(7);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSalarySlips({ email: email, access_token });
        if (response.error) {
          const errors = response.error.data?.errors || {};
          if (errors.non_field_errors) {
            enqueueSnackbar(errors.non_field_errors[0], {
              variant: "error",
              autoHideDuration: 3000,
            });
          } else if (errors.detail) {
            enqueueSnackbar(errors.detail, {
              variant: "error",
              autoHideDuration: 3000,
            });
          } else {
            setServerError(errors);
          }
        }
        if (response.data) {
          setRows(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error("Salary slip fetch error:", error);
        enqueueSnackbar("An error occurred while fetching data.", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    };
    fetchData();
  }, [access_token, reset]);

  const handleNextPage = () => {
    if ((currentPage + 1) * ROWS_PER_PAGE < rows.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownload = async (row) => {
    const slipElement = slipRef.current.querySelector(
      `[data-id="${row.salary_slip_number}"]`
    );
    if (slipElement) {
      const canvas = await html2canvas(slipElement);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${row.salary_slip_number}_salary_slip.pdf`);
    } else {
      enqueueSnackbar("Error: Salary slip element not found.", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setRows(filteredData);
    setReset(!reset);
  };

  const rowsToDisplay = rows.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <div className="md:ml-5 my-10 roboto-regular roboto-regular max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl overflow-hidden">
      <h2 className="text-3xl sm:text-4xl font-bold text-primary_color flex items-center mb-5">
        <FaFileAlt className="mr-2 text-form_base" size={28} />
        Salary Slips
      </h2>
      <div className="flex flex-col items-center w-full mb-3">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:text-base w-full space-y-4 mt-1.5 sm:space-y-0 sm:space-x-4">
          <StyledDateForSalarySlipView
            label={"From Month"}
            value={fromDate}
            onChange={handleFromDateChange}
            format="MM-YYYY"
            views={["year", "month"]}
            className="w-full sm:w-auto mb-4 sm:mb-0"
          />
          <StyledDateForSalarySlipView
            label={"To Month"}
            value={toDate}
            onChange={handleToDateChange}
            format="MM-YYYY"
            views={["year", "month"]}
            className="w-full sm:w-auto mb-4 sm:mb-0"
          />
          <button
            className="bg-primary_color text-white h-[35px] px-6 sm:px-10 rounded-md w-[180px] mb-4 sm:mb-0"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="border border-primary_color bg-[#F0F0FF] text-primary_color h-[35px] w-[180px] rounded-md mb-4 sm:mb-0"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="flex justify-center w-full sm:w-auto">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`border border-primary_color text-primary_color h-[35px] w-[43px] rounded-md mr-1 ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              &lt;
            </button>
            <span className="border border-primary_color text-primary_color h-[35px] w-[43px] flex items-center justify-center rounded-md mr-1">
              {currentPage + 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={(currentPage + 1) * rowsPerPage >= rows.length} // Use rowsPerPage here as well
              className={`border border-primary_color text-primary_color h-[35px] w-[43px] rounded-md ${
                (currentPage + 1) * rowsPerPage >= rows.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <div ref={slipRef}>
        <div>
          <div className="mt-5 max-w-[358px] md:max-w-screen-md lg:max-w-screen-xl overflow-x-hidden">
            <TableContainer
              component={Paper}
              className="overflow-x-auto mt-4 custom-scrollbar"
            >
              <Table className="min-w-full">
                <TableHead className="bg-primary_color">
                  <TableRow>
                    <TableCell style={{ width: "50px" }}></TableCell>
                    <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                      Slip Number
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                      Month
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                      Year
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                      Basic Salary
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                      Net Salary
                    </TableCell>
                    <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsToDisplay.map((rowData) => (
                    <Row
                      key={rowData.salary_slip_number}
                      data-id={rowData.salary_slip_number}
                      row={rowData}
                      handleDownload={() => handleDownload(rowData)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipView;
