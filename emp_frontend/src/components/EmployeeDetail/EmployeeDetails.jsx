import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import StyledDateForEmployee from "../../materialUI/StyledDateForEmployee";
import {
  useAddEmployeeMutation,
  useFetchAllEmployeesMutation,
  useUpdateEmployeeMutation,
} from "../../services/Employee";
import { useRegisterUserMutation } from "../../services/UserAuthApi";
import { enqueueSnackbar } from "notistack";
import dayjs from "dayjs";
import Row from "./Row";
import { FaUserTie } from "react-icons/fa";

const CustomInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-md mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? "border-red-500" : ""
      }`}
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const CustomForm = ({ title, children, onClose, onSubmit, submitText }) => (
  <div className="fixed roboto-regular inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
    <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary_color text-center">
        {title}
      </h2>
      <form onSubmit={onSubmit}>
        {children}
        <div className="flex justify-end mt-6 space-x-4">
          <Button onClick={onClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {submitText}
          </Button>
        </div>
      </form>
    </div>
  </div>
);

const EmployeeFormModal = ({ open, onClose, employee, onSubmit }) => {
  const [employeeData, setEmployeeData] = useState(
    employee || {
      first_name: "",
      last_name: "",
      personal_mailid: "",
      working_designation: "",
      department: "",
      salary: "",
      phone_number: "",
      working_emailid: "",
      emp_id: "",
      date_of_birth: null,
      date_of_joining: null,
      address: "",
    }
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEmployeeData(
      employee || {
        first_name: "",
        last_name: "",
        personal_mailid: "",
        working_designation: "",
        department: "",
        salary: "",
        phone_number: "",
        working_emailid: "",
        emp_id: "",
        date_of_birth: null,
        date_of_joining: null,
        address: "",
      }
    );
    setErrors({});
  }, [employee]);

  const handleInputChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleDateChange = (name, date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setEmployeeData((prevDetails) => ({
      ...prevDetails,
      [name]: formattedDate,
    }));
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!employeeData.first_name)
      newErrors.first_name = "First name is required";
    if (!employeeData.last_name) newErrors.last_name = "Last name is required";
    if (
      !employeeData.personal_mailid ||
      !/\S+@\S+\.\S+/.test(employeeData.personal_mailid)
    )
      newErrors.personal_mailid = "Valid personal email is required";
    if (
      !employeeData.working_emailid ||
      !/\S+@\S+\.\S+/.test(employeeData.working_emailid)
    )
      newErrors.working_emailid = "Valid work email is required";
    if (!employeeData.working_designation)
      newErrors.working_designation = "Designation is required";
    if (!employeeData.department)
      newErrors.department = "Department is required";
    if (!employeeData.salary || isNaN(employeeData.salary))
      newErrors.salary = "Valid salary is required";
    if (
      !employeeData.phone_number ||
      !/^\d{10}$/.test(employeeData.phone_number)
    )
      newErrors.phone_number = "Valid 10-digit phone number is required";
    if (!employeeData.emp_id) newErrors.emp_id = "Employee ID is required";
    if (!employeeData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!employeeData.date_of_joining)
      newErrors.date_of_joining = "Date of joining is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(employeeData);
    }
  };

  if (!open) return null;

  return (
    <CustomForm
      title={employee ? "Edit Employee" : "Add New Employee"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={employee ? "Update Employee" : "Add Employee"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="First Name"
          name="first_name"
          value={employeeData.first_name}
          onChange={handleInputChange}
          error={errors.first_name}
        />
        <CustomInput
          label="Last Name"
          name="last_name"
          value={employeeData.last_name}
          onChange={handleInputChange}
          error={errors.last_name}
        />
        <CustomInput
          label="Personal Email ID"
          name="personal_mailid"
          type="email"
          value={employeeData.personal_mailid}
          onChange={handleInputChange}
          error={errors.personal_mailid}
        />
        <CustomInput
          label="Work Email ID"
          name="working_emailid"
          type="email"
          value={employeeData.working_emailid}
          onChange={handleInputChange}
          error={errors.working_emailid}
        />
        <CustomInput
          label="Work Designation"
          name="working_designation"
          value={employeeData.working_designation}
          onChange={handleInputChange}
          error={errors.working_designation}
        />
        <CustomInput
          label="Department"
          name="department"
          value={employeeData.department}
          onChange={handleInputChange}
          error={errors.department}
        />
        <CustomInput
          label="Salary"
          name="salary"
          type="number"
          value={employeeData.salary}
          onChange={handleInputChange}
          error={errors.salary}
        />
        <CustomInput
          label="Phone Number"
          name="phone_number"
          type="number"
          value={employeeData.phone_number}
          onChange={handleInputChange}
          error={errors.phone_number}
        />
        <CustomInput
          label="Employee ID"
          name="emp_id"
          type="number"
          value={employeeData.emp_id}
          onChange={handleInputChange}
          error={errors.emp_id}
        />
        <CustomInput
          label="Address"
          name="address"
          value={employeeData.address}
          onChange={handleInputChange}
        />
        <div>
          <label className="block roboto-regular text-gray-700 text-md mb-2">
            Date of Birth
          </label>
          <StyledDateForEmployee
            value={employeeData.date_of_birth}
            onChange={(date) => handleDateChange("date_of_birth", date)}
          />
          {errors.date_of_birth && (
            <p className="text-red-500 text-xs italic">
              {errors.date_of_birth}
            </p>
          )}
        </div>
        <div>
          <label className="block roboto-regular text-gray-700 text-md mb-2">
            Date of Joining
          </label>
          <StyledDateForEmployee
            value={employeeData.date_of_joining}
            onChange={(date) => handleDateChange("date_of_joining", date)}
          />
          {errors.date_of_joining && (
            <p className="text-red-500 text-xs italic">
              {errors.date_of_joining}
            </p>
          )}
        </div>
      </div>
    </CustomForm>
  );
};

const RegisterFormModal = ({ open, onClose, onSubmit }) => {
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!registerData.email || !/\S+@\S+\.\S+/.test(registerData.email))
      newErrors.email = "Valid email is required";
    if (!registerData.username) newErrors.username = "Username is required";
    if (!registerData.password) newErrors.password = "Password is required";
    else if (registerData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";
    else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        registerData.password
      )
    )
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    if (registerData.password !== registerData.password2)
      newErrors.password2 = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(registerData);
    }
  };

  if (!open) return null;

  return (
    <CustomForm
      title="Register New User"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Register"
    >
      <CustomInput
        label="Email"
        name="email"
        type="email"
        value={registerData.email}
        onChange={handleInputChange}
        error={errors.email}
      />
      <CustomInput
        label="Username"
        name="username"
        value={registerData.username}
        onChange={handleInputChange}
        error={errors.username}
      />
      <CustomInput
        label="Password"
        name="password"
        type="password"
        value={registerData.password}
        onChange={handleInputChange}
        error={errors.password}
      />
      <CustomInput
        label="Confirm Password"
        name="password2"
        type="password"
        value={registerData.password2}
        onChange={handleInputChange}
        error={errors.password2}
      />
    </CustomForm>
  );
};

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const [fetchAllEmployees] = useFetchAllEmployeesMutation();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [registerUser] = useRegisterUserMutation();
  const access_token = localStorage.getItem("access_token");

  const handleFetchEmployees = async () => {
    try {
      const response = await fetchAllEmployees(access_token).unwrap();
      setEmployees(response);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    handleFetchEmployees();
  }, []);

  const handleEmployeeSubmit = async (employeeData) => {
    try {
      if (currentEmployee) {
        // Use the original emp_id for updating
        const originalEmpId = currentEmployee.emp_id;
        await updateEmployee({
          emp_id: originalEmpId,
          employeeData: { ...employeeData },
          access_token,
        }).unwrap();
        enqueueSnackbar("Employee updated successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
      } else {
        await addEmployee({
          employeeData,
          access_token,
        }).unwrap();
        enqueueSnackbar("New employee added successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
      setIsEmployeeModalOpen(false);
      setCurrentEmployee(null);
      handleFetchEmployees();
    } catch (error) {
      const errorMessage =
        error?.data?.error ||
        error?.data?.emp_id[0] ||
        "Failed to save employee details";
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleRegisterSubmit = async (registerData) => {
    try {
      const response = await registerUser(registerData).unwrap();
      enqueueSnackbar(response.msg || "User registered successfully!", {
        variant: "success",
        autoHideDuration: 3000,
      });
      setIsRegisterModalOpen(false);
    } catch (error) {
      enqueueSnackbar("Failed to register user", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const openEditForm = (employee) => {
    setCurrentEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const openAddForm = () => {
    setCurrentEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-fit mt-8 md:pl-5 lg:pl-5 roboto-regular">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary_color flex items-center mb-6">
          <FaUserTie className="mr-2 text-form_base" size={28} />
          Employee Details
        </h2>

        <div className="mb-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={openAddForm}
            variant="contained"
            sx={{ background: "#00A189" }}
          >
            Add New Employee
          </Button>
          <Button
            onClick={() => setIsRegisterModalOpen(true)}
            variant="contained"
            sx={{ background: "#00A189" }}
          >
            Register New User
          </Button>
        </div>

        <TableContainer
          sx={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          className="mt-4 sm:mt-7 bg-white rounded-lg overflow-x-hidden"
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#00008af0", color: "white" }}>
                <TableCell />
                {!isMobile && (
                  <>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Employee ID
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Name
                    </TableCell>
                  </>
                )}
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  Work Email
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Department
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Designation
                    </TableCell>
                  </>
                )}
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <Row
                  key={employee.working_emailid}
                  row={employee}
                  openEditForm={openEditForm}
                  isMobile={isMobile}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <EmployeeFormModal
          open={isEmployeeModalOpen}
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setCurrentEmployee(null);
          }}
          employee={currentEmployee}
          onSubmit={handleEmployeeSubmit}
        />

        <RegisterFormModal
          open={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSubmit={handleRegisterSubmit}
        />
      </div>
    </LocalizationProvider>
  );
};

export default EmployeeDetails;
