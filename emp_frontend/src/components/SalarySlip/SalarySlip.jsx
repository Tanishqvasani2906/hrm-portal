import { useEffect, useState } from "react";
import moment from "moment";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import GeneratedSalarySlip from "./GeneratedSalarySlip";
import StyledDateForSalarySlip from "../../materialUI/StyledDateForSalarySlip";
import dayjs from "dayjs";
import { useGenerateSalarySlipMutation } from "../../services/SalarySlip";
import { useFetchEmployeeMutation } from "../../services/Employee";
import { enqueueSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const SalarySlip = () => {
  const access_token = localStorage.getItem("access_token");

  const navigate = useNavigate();

  const preparedBy = localStorage.getItem("email");

  const token = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(token);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (decodedToken.is_admin) {
      setIsAdmin(true);
    } else if (!decodedToken.is_admin) {
      setIsAdmin(false);
      navigate("/salarySlipView");
    }
  }, [decodedToken.is_admin, isAdmin, navigate]);

  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    id: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    preparedBy: preparedBy,
    approvedBy: "",
  });

  const [isSlipGenerated, setIsSlipGenerated] = useState(false);
  const [serverError, setServerError] = useState(null);
  const currentMonthName = dayjs().format("MMMM");
  const currentYear = dayjs().format("YYYY");

  const handleChange = (e) => {
    setEmployeeDetails({
      ...employeeDetails,
      [e.target.name]: e.target.value,
    });
  };

  const calculateNetSalary = () => {
    const { basicSalary, allowances, deductions } = employeeDetails;
    return Number(basicSalary) + Number(allowances) - Number(deductions);
  };

  const netSalary = calculateNetSalary();

  const convertNumberToWords = (amount) => {
    const words = [
      "Zero", // 0
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (amount === 0) return "Zero";

    const getTens = (n) => {
      if (n < 20) return words[n];
      const tens = Math.floor(n / 10);
      const ones = n % 10;
      return `${words[18 + tens]}${ones ? ` ${words[ones]}` : ""}`;
    };

    const getHundreds = (n) => {
      const hundreds = Math.floor(n / 100);
      const remainder = n % 100;
      return hundreds
        ? `${words[hundreds]} Hundred${
            remainder ? ` and ${getTens(remainder)}` : ""
          }`
        : getTens(remainder);
    };

    const getThousands = (n) => {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      return thousands
        ? `${getHundreds(thousands)} Thousand${
            remainder ? ` ${getHundreds(remainder)}` : ""
          }`
        : getHundreds(remainder);
    };

    const getLakhs = (n) => {
      const lakhs = Math.floor(n / 100000);
      const remainder = n % 100000;
      return lakhs
        ? `${getThousands(lakhs)} Lakh${
            remainder ? ` ${getThousands(remainder)}` : ""
          }`
        : getThousands(remainder);
    };

    return getLakhs(amount).trim();
  };

  const [generateSalarySlip] = useGenerateSalarySlipMutation();
  const [fetchEmployee] = useFetchEmployeeMutation();

  const handleGenerateSlip = async (event) => {
    event.preventDefault();

    const data = {
      employee: employeeDetails.name,
      month: currentMonthName,
      year: currentYear,
      emp_id: employeeDetails.id,
      designation: employeeDetails.designation,
      department: employeeDetails.department,
      date_of_joining: employeeDetails.dateOfJoining,
      basic_salary: parseFloat(employeeDetails.basicSalary),
      allowances: parseFloat(employeeDetails.allowances),
      deductions: parseFloat(employeeDetails.deductions),
      net_pay: netSalary,
      prepared_by: employeeDetails.preparedBy,
      approved_by: employeeDetails.approvedBy,
    };

    try {
      const response = await generateSalarySlip({
        data,
        access_token,
      });
      setIsSlipGenerated(true);
    } catch (error) {
      console.error("Failed to generate salary slip:", error);
      setServerError(error.data);
    }
  };

  const handleDateChange = (newValue) => {
    const formattedDate = newValue ? moment(newValue).format("YYYY-MM-DD") : "";
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      dateOfJoining: formattedDate,
    }));
  };

  const [hasFetchedData, setHasFetchedData] = useState(false);

  const handleEmployeeIdTab = async (e) => {
    if (employeeDetails.id.length !== 4) {
    }
    if (e.key === "Tab" && employeeDetails.id.length === 4) {
      e.preventDefault();

      if (hasFetchedData) {
        return;
      }

      try {
        const response = await fetchEmployee({
          emp_id: employeeDetails.id,
          access_token,
        }).unwrap();

        setEmployeeDetails({
          ...employeeDetails,
          name: response.name,
          department: response.department,
          designation: response.working_designation,
          dateOfJoining: response.date_of_joining,
          basicSalary: response.salary,
        });

        setHasFetchedData(true);
      } catch (error) {
        console.log("Failed to fetch employee data:", error);

        if (error.data.detail) {
          enqueueSnackbar(error.data.detail, {
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
    }
  };

  return (
    <div className="flex roboto-regular justify-center items-center mt-[-30px] min-h-screen bg-white p-8">
      {!isSlipGenerated ? (
        <Card
          sx={{ boxShadow: "0px 4px 10px rgba(128, 128, 128, 0.3)" }}
          className="w-full max-w-2xl p-8 rounded-2xl bg-white"
        >
          <CardContent>
            <h2 className="text-2xl font-semibold mb-6 text-primary_color text-center">
              Salary Slip For The Month of {currentMonthName}
            </h2>
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="id"
                    className="block roboto-regular text-gray-700"
                  >
                    Employee ID
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={employeeDetails.id}
                    onChange={handleChange}
                    onKeyDown={handleEmployeeIdTab}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 ${
                      serverError
                        ? "border-red-500 focus:ring-red-600"
                        : "focus:ring-blue-600"
                    }`}
                  />
                  {serverError && (
                    <p className="text-red-500 text-sm mt-1">
                      {serverError.id}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="name"
                    className="block roboto-regular text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    disabled
                    value={employeeDetails.name}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="designation"
                    className="block roboto-regular text-gray-700"
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    disabled
                    value={employeeDetails.designation}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="department"
                    className="block roboto-regular text-gray-700"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    disabled
                    value={employeeDetails.department}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="dateOfJoining"
                    className="block roboto-regular text-gray-700"
                  >
                    Date Of Joining
                  </label>
                  <StyledDateForSalarySlip
                    value={
                      employeeDetails.dateOfJoining
                        ? dayjs(employeeDetails.dateOfJoining)
                        : null
                    }
                    onChange={handleDateChange}
                    className="w-full sm:w-auto sm:mb-0"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="basicSalary"
                    className="block roboto-regular text-gray-700"
                  >
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    id="basicSalary"
                    name="basicSalary"
                    value={employeeDetails.basicSalary}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="allowances"
                    className="block roboto-regular text-gray-700"
                  >
                    Allowances
                  </label>
                  <input
                    type="number"
                    id="allowances"
                    name="allowances"
                    value={employeeDetails.allowances}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="deductions"
                    className="block roboto-regular text-gray-700"
                  >
                    Deductions
                  </label>
                  <input
                    type="number"
                    id="deductions"
                    name="deductions"
                    value={employeeDetails.deductions}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
              </Grid>
              {netSalary > 0 && (
                <div className="mt-6 border-t border-gray-300 pt-4">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    className="mb-3 text-gray-700 font-semibold"
                  >
                    Net Salary Amount:{" "}
                    <span className="text-green-600">₹ {netSalary}</span>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    className="text-gray-700 font-semibold"
                  >
                    Amount in Words:{" "}
                    <span className="text-green-600">
                      {convertNumberToWords(netSalary)}
                    </span>{" "}
                    Only
                  </Typography>
                </div>
              )}
              <Grid container spacing={3} sx={{ marginTop: "0px" }}>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="id"
                    className="block roboto-regular text-gray-700"
                  >
                    Prepared By
                  </label>
                  <input
                    type="text"
                    id="preparedBy"
                    name="preparedBy"
                    disabled
                    value={employeeDetails.preparedBy}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label
                    htmlFor="id"
                    className="block roboto-regular text-gray-700"
                  >
                    Approved By
                  </label>
                  <input
                    type="text"
                    id="approvedBy"
                    name="approvedBy"
                    value={employeeDetails.approvedBy}
                    onChange={handleChange}
                    className={`w-full py-2 mt-2 pl-2 border border-[#aaa] rounded-md focus:outline-none focus:ring-1 `}
                  />
                </Grid>
              </Grid>
            </div>
            <div className="mt-5 flex">
              <Button
                sx={{ marginTop: 1, marginBottom: 0 }}
                variant="contained"
                color="primary"
                fullWidth
                className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md"
                onClick={handleGenerateSlip}
              >
                Generate Slip
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <GeneratedSalarySlip
          employeeDetails={employeeDetails}
          netSalary={netSalary}
          convertNumberToWords={convertNumberToWords}
        />
      )}
    </div>
  );
};

export default SalarySlip;
