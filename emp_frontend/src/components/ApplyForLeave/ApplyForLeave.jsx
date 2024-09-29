import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import CreateNewLeave from "../ApplyForLeave/CreateNewLeave";

import StyledDatePicker from "../../materialUI/StyledDatePicker";
import {
  useCreateleaveMutation,
  useFetchAdminleaveMutation,
  useFetchleaveMutation,
  useUpdateLeaveStatusMutation,
} from "../../services/LeaveManagement";

import { SnackbarProvider, useSnackbar } from "notistack";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import Row from "./Row";
import { FaRegCalendarAlt } from "react-icons/fa";

const ROWS_PER_PAGE = 7;

const ApplyForLeave = () => {
  const [openModal, setOpenModal] = useState(false);
  const [reset, setReset] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const select = useRef(null);

  const [createleave] = useCreateleaveMutation();
  const [fetchleave] = useFetchleaveMutation();
  const [fetchAdminleave] = useFetchAdminleaveMutation();
  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();

  const [row, setRow] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [serverError, setServerError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const [currentPage, setCurrentPage] = useState(0);

  const [statuses, setStatuses] = useState({});

  const access_token = localStorage.getItem("access_token");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const [isAdmin, setIsAdmin] = useState(false);

  if (decodedToken.is_admin && !isAdmin) {
    setIsAdmin(true);
  } else if (!decodedToken.is_admin && isAdmin) {
    setIsAdmin(false);
  }

  const handleSearch = () => {
    const selectedStatus = select.current.value;

    const filtered = filteredData.filter((item) => {
      let dateOverlaps = true;

      if (fromDate && toDate) {
        const formattedFromDate = dayjs(fromDate).startOf("day");
        const formattedToDate = dayjs(toDate).endOf("day");

        const itemFromDate = dayjs(item.from_date).startOf("day");
        const itemToDate = dayjs(item.to_date).endOf("day");

        dateOverlaps =
          (itemFromDate.isSame(formattedFromDate) ||
            itemFromDate.isAfter(formattedFromDate)) &&
          (itemToDate.isSame(formattedToDate) ||
            itemToDate.isBefore(formattedToDate));
      }

      const statusMatches =
        selectedStatus === "Select" || item.status === selectedStatus;

      return dateOverlaps && statusMatches;
    });

    setRow(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (isAdmin) {
          response = await fetchAdminleave(access_token);
        } else {
          response = await fetchleave(access_token);
        }

        if (response.error) {
          console.log("Error response:", response.error);

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
          setRow(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error("Leave fetch error:", error);
        enqueueSnackbar("An error occurred while fetching data.", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    };

    fetchData();

    setFromDate(null);
    setToDate(null);
    select.current.value = "Select";
  }, [access_token, isAdmin, reset]);

  const handleNextPage = () => {
    if ((currentPage + 1) * ROWS_PER_PAGE < row.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const rowsToDisplay = row.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  const handleSubmit = async ({
    event,
    email,
    leave_type,
    fromDate,
    toDate,
    reason,
    pending_work_of_employee,
  }) => {
    event.preventDefault();

    const data = {
      email: email,
      leave_type: leave_type.current.value,
      from_date: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null,
      to_date: toDate ? dayjs(toDate).format("YYYY-MM-DD") : null,
      reason: reason.current.value,
      pending_work_of_employee: pending_work_of_employee.current.value,
    };

    try {
      const response = await createleave({ data, access_token });

      if (response.error) {
        if (response.error.data.errors.non_field_errors) {
          console.log(response.error.data.errors.non_field_errors);
          enqueueSnackbar(response.error.data.errors.non_field_errors[0], {
            variant: "error",
            autoHideDuration: 3000,
          });
        } else {
          setServerError(response.error.data.errors);
        }
      }
      if (response.data) {
        enqueueSnackbar(response.data.msg, {
          variant: "success",
          autoHideDuration: 3000,
        });
        handleCloseModal();
      }
    } catch (error) {
      console.error("Create Leave error:", error);
    }
  };

  const handleSelect = async (id, newStatus) => {
    try {
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [id]: newStatus,
      }));

      const response = await updateLeaveStatus({
        status: newStatus,
        leave_id: id,
        access_token,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to update status");
      }

      enqueueSnackbar("Status updated successfully", { variant: "success" });
      setRow(
        row.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Update status error:", error);

      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [id]: oldStatus,
      }));

      enqueueSnackbar(error.message || "Failed to update status", {
        variant: "error",
      });
    }
  };
  return (
    <div className="md:ml-5 my-10 roboto-regular max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl overflow-hidden">
      <div className="flex flex-col items-center w-full mb-3">
        <div className="flex justify-center md:justify-end lg:justify-between w-full mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary_color flex items-center">
            <FaRegCalendarAlt className="mr-2 text-form_base" size={28} />
            Apply For Leave
          </h2>
          <button
            onClick={handleOpenModal}
            className="bg-primary_color text-white h-[35px] px-4 sm:px-7 rounded-md sm:text-base"
          >
            Create New
          </button>
        </div>
        {row && (
          <div className="flex flex-col sm:flex-row justify-between items-center sm:text-base w-full space-y-4 sm:space-y-0 sm:space-x-4">
            <StyledDatePicker
              label={"From Date"}
              className="w-full sm:w-auto mb-4 sm:mb-0"
              value={fromDate}
              onChange={(newValue) => {
                setFromDate(newValue);
              }}
            />

            <StyledDatePicker
              label={"To Date"}
              className="w-full sm:w-auto mb-4 sm:mb-0"
              value={toDate}
              onChange={(newValue) => {
                setToDate(newValue);
              }}
            />
            <select
              className="border border-primary_color text-[#01008A] rounded-md px-4 h-[35px] w-[180px] mb-4 sm:mb-0"
              ref={select}
            >
              <option>Select</option>
              <option>APPROVED</option>
              <option>PENDING</option>
              <option>REJECTED</option>
            </select>
            <button
              className="bg-primary_color text-white h-[35px] px-6 sm:px-10 rounded-md w-[180px] mb-4 sm:mb-0"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="border border-primary_color bg-[#F0F0FF] text-primary_color h-[35px] w-[180px] rounded-md mb-4 sm:mb-0"
              onClick={() => setReset(!reset)}
            >
              Reset
            </button>
            <div className="flex justify-center w-full sm:w-auto">
              {/* Previous Button */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`border border-primary_color text-primary_color h-[35px] w-[43px] rounded-md mr-1 ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                &lt;
              </button>

              {/* Display current page number */}
              <span className="border border-primary_color text-primary_color h-[35px] w-[43px] flex items-center justify-center rounded-md mr-1">
                {currentPage + 1}
              </span>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * ROWS_PER_PAGE >= row.length}
                className={`border border-primary_color text-primary_color h-[35px] w-[43px] rounded-md ${
                  (currentPage + 1) * ROWS_PER_PAGE >= row.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
      {row && (
        <div className="mt-5 max-w-[320px] md:max-w-screen-md lg:max-w-screen-xl overflow-x-hidden">
          <TableContainer
            component={Paper}
            className="overflow-x-auto mt-4 custom-scrollbar"
          >
            <Table className="min-w-full">
              <TableHead className="bg-primary_color">
                <TableRow>
                  <TableCell style={{ width: "50px" }}></TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    Leave Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    From Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    To Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: "1.1rem",
                      paddingLeft: "35px",
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsToDisplay.map((rowData) => (
                  <Row
                    key={rowData.ID}
                    row={rowData}
                    is_admin={isAdmin}
                    handleSelect={handleSelect}
                    selectedStatus={statuses[rowData.ID] || rowData.status}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <SnackbarProvider maxSnack={3}>
            <CreateNewLeave
              handleClose={handleCloseModal}
              handleOpen={handleCloseModal}
              handleSubmit={handleSubmit}
              serverError={serverError}
            />
          </SnackbarProvider>
        </div>
      )}
    </div>
  );
};

export default ApplyForLeave;
