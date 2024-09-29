import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useFetchNoticeMutation,
} from "../../services/Notice";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [refresh, setRefresh] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [newNotice, setNewNotice] = useState({
    employee: localStorage.getItem("username"),
    title: "",
    content: "",
    notice_priority: "LOW",
    end_date: null,
  });

  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const itemsPerPage = 6;

  const handleDateChange = (newValue) => {
    const formattedDate = newValue
      ? dayjs(newValue).format("YYYY-MM-DD")
      : null;
    setNewNotice((prevDetails) => ({
      ...prevDetails,
      end_date: formattedDate,
    }));
    validateField("end_date", formattedDate);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateField("title", e.target.value);
    }
  };

  const [fetchNotice, { isLoading, isError }] = useFetchNoticeMutation();
  const [createNotice, { isLoading: isCreating, isError: createError }] =
    useCreateNoticeMutation();
  const [deleteNotice, { isLoading: isDeleting, isError: deleteError }] =
    useDeleteNoticeMutation();

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const [isAdmin, setIsAdmin] = useState(decodedToken.is_admin);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await fetchNotice(access_token).unwrap();

        if (Array.isArray(response)) {
          setNotices(response);
        } else if (response.data && Array.isArray(response.data)) {
          setNotices(response.data);
        } else {
          console.error("Unexpected response format");
          enqueueSnackbar("Error fetching notices", { variant: "error" });
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
        enqueueSnackbar("Error fetching notices", { variant: "error" });
      }
    };

    fetchData();
  }, [fetchNotice, refresh]);

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };
    switch (fieldName) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else if (value.length > 100) {
          newErrors.title = "Title must be less than 100 characters";
        } else {
          delete newErrors.title;
        }
        break;
      case "content":
        if (!value.trim()) {
          newErrors.content = "Content is required";
        } else if (value.length > 500) {
          newErrors.content = "Content must be less than 500 characters";
        } else {
          delete newErrors.content;
        }
        break;
      case "end_date":
        if (!value) {
          newErrors.end_date = "Expiry date is required";
        } else if (dayjs(value).isBefore(dayjs(), "day")) {
          newErrors.end_date = "Expiry date cannot be in the past";
        } else {
          delete newErrors.end_date;
        }
        break;
      case "notice_priority":
        if (!["LOW", "MEDIUM", "HIGH"].includes(value)) {
          newErrors.notice_priority = "Invalid priority";
        } else {
          delete newErrors.notice_priority;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || notice.notice_priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const currentNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateForm = () => {
    validateField("title", newNotice.title);
    validateField("content", newNotice.content);
    validateField("end_date", newNotice.end_date);
    validateField("notice_priority", newNotice.notice_priority);
    return Object.keys(errors).length === 0;
  };

  const handleCreateNotice = async () => {
    if (validateForm()) {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await createNotice({
          data: newNotice,
          access_token,
        }).unwrap();
        enqueueSnackbar("Notice Created Successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
        setShowModal(false);
        setRefresh(response);
        fetchNotice(access_token);
      } catch (error) {
        console.error("Failed to create notice:", error);
        if (error.status === 400 && error.data && error.data.errors) {
          setBackendErrors(error.data.errors);
          enqueueSnackbar(
            "Failed to create notice. Please check the form for errors.",
            { variant: "error" }
          );
        } else {
          enqueueSnackbar("Failed to create notice. Please try again.", {
            variant: "error",
          });
        }
      }
    } else {
      enqueueSnackbar("Please fill in all required fields correctly.", {
        variant: "warning",
      });
    }
  };

  const handleDeleteNotice = async (id) => {
    setNoticeToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteNotice = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await deleteNotice({
        id: noticeToDelete,
        access_token,
      }).unwrap();

      if (response) {
        enqueueSnackbar("Notice Deleted Successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
        setRefresh(response);
      }
    } catch (error) {
      console.error("Delete Notice Error : ", error);
      enqueueSnackbar("Failed to delete notice", { variant: "error" });
    } finally {
      setShowDeleteConfirmation(false);
      setNoticeToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="bg-white roboto-regular p-4 sm:p-8 rounded-md w-full mt-3 mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary_color flex items-center mb-4 sm:mb-0">
          <FaBell className="mr-2 text-form_base" size={28} />
          Notices
        </h2>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {isAdmin && (
            <button
              className="bg-primary_color text-white py-2 px-4 rounded-md hover:bg-light_primary transition-colors w-full sm:w-auto"
              onClick={() => setShowModal(true)}
            >
              Create Notice
            </button>
          )}
          <input
            type="text"
            placeholder="Search by title"
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary_color focus:outline-none w-full sm:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary_color focus:outline-none w-full sm:w-auto"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-para">Loading notices...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error fetching notices.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {currentNotices.length > 0 ? (
            currentNotices.map((notice) => (
              <div
                key={notice.id}
                className={`p-4 sm:p-6 rounded-md shadow-lg border-l-4 ${
                  notice.notice_priority === "HIGH"
                    ? "bg-red-50 border-red-500"
                    : notice.notice_priority === "MEDIUM"
                    ? "bg-yellow-50 border-yellow-500"
                    : "bg-green-50 border-green-500"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-0">
                  <h3 className="font-bold text-xl sm:text-2xl text-primary_color mb-2 sm:mb-0">
                    {notice.title}
                  </h3>
                  {isAdmin && (
                    <button
                      className="bg-red-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-light_primary transition-colors text-sm sm:text-base"
                      onClick={() => handleDeleteNotice(notice.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm sm:text-base text-para mt-2 sm:mt-4">
                  {notice.content}
                </p>
                <p
                  className={`text-xs sm:text-sm font-semibold mt-2 ${
                    notice.notice_priority === "HIGH"
                      ? "text-red-600"
                      : notice.notice_priority === "MEDIUM"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Priority: {notice.notice_priority}
                </p>
              </div>
            ))
          ) : (
            <p className="text-para font-roboto-regular col-span-2 text-center">
              No notices found.
            </p>
          )}
        </div>
      )}

      <div className="flex roboto-regular justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-light_primary text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary_color transition-colors text-sm sm:text-base"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-para text-sm sm:text-base">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-primary_color text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light_primary transition-colors text-sm sm:text-base"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed roboto-regular inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary_color text-center">
              Create New Notice
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border ${
                    errors.title || backendErrors.title
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  value={newNotice.title}
                  onChange={(e) => {
                    setNewNotice((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                    validateField("title", e.target.value);
                    setBackendErrors((prev) => ({ ...prev, title: null }));
                  }}
                  onKeyDown={handleTitleKeyDown}
                />
                {(errors.title || backendErrors.title) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title || backendErrors.title?.[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  className={`w-full p-2 border ${
                    errors.content || backendErrors.content
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  rows="4"
                  value={newNotice.content}
                  onChange={(e) => {
                    setNewNotice((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }));
                    validateField("content", e.target.value);
                    setBackendErrors((prev) => ({ ...prev, content: null }));
                  }}
                ></textarea>
                {(errors.content || backendErrors.content) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.content || backendErrors.content?.[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={
                      newNotice.end_date ? dayjs(newNotice.end_date) : null
                    }
                    format="YYYY-MM-DD"
                    onChange={(newValue) => {
                      const formattedDate = newValue
                        ? dayjs(newValue).format("YYYY-MM-DD")
                        : null;
                      setNewNotice((prev) => ({
                        ...prev,
                        end_date: formattedDate,
                      }));
                      validateField("end_date", formattedDate);
                      setBackendErrors((prev) => ({ ...prev, end_date: null }));
                    }}
                    minDate={dayjs()}
                    renderInput={(params) => ({ ...params })}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            height: "40px",
                          },
                        },
                      },
                    }}
                    className="w-full mt-2"
                  />
                </LocalizationProvider>
                {(errors.end_date || backendErrors.end_date) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.end_date || backendErrors.end_date?.[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className={`w-full p-2 border ${
                    errors.notice_priority || backendErrors.notice_priority
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  value={newNotice.notice_priority}
                  onChange={(e) => {
                    setNewNotice((prev) => ({
                      ...prev,
                      notice_priority: e.target.value,
                    }));
                    validateField("notice_priority", e.target.value);
                    setBackendErrors((prev) => ({
                      ...prev,
                      notice_priority: null,
                    }));
                  }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {(errors.notice_priority || backendErrors.notice_priority) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.notice_priority ||
                      backendErrors.notice_priority?.[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
                onClick={() => {
                  setShowModal(false);
                  setErrors({});
                  setBackendErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm sm:text-base"
                onClick={handleCreateNotice}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-primary_color">
              Confirm Delete
            </h3>
            <p className="mb-6">Are you sure you want to delete this notice?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={confirmDeleteNotice}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeList;
