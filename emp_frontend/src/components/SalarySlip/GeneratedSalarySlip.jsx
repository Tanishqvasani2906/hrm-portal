import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { StyleSheet, pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import SalarySlipDocument from "./SalarySlipDocument";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  greenText: {
    color: "#00796b",
  },
});

// Create Document Component
// const SalarySlipDocument = ({ employeeDetails, netSalary, convertNumberToWords }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.header}>
//         Salary Slip For The Month of {dayjs().format("MMMM")}
//       </Text>
//       <View style={styles.section}>
//         <Text style={styles.text}>
//           Name: <Text style={styles.bold}>{employeeDetails.name}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Employee ID: <Text style={styles.bold}>{employeeDetails.id}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Designation: <Text style={styles.bold}>{employeeDetails.designation}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Department: <Text style={styles.bold}>{employeeDetails.department}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Date Of Joining: <Text style={styles.bold}>{employeeDetails.dateOfJoining}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Basic Salary: <Text style={styles.bold}>₹ {employeeDetails.basicSalary}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Allowances: <Text style={styles.bold}>₹ {employeeDetails.allowances}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Deductions: <Text style={styles.bold}>₹ {employeeDetails.deductions}</Text>
//         </Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.text}>
//           Net Salary Amount: <Text style={[styles.bold, styles.greenText]}>₹ {netSalary}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Amount in Words: <Text style={[styles.bold, styles.greenText]}>
//             {convertNumberToWords(netSalary)} Only
//           </Text>
//         </Text>
//         <Text style={styles.text}>
//           Prepared By: <Text style={styles.bold}>{employeeDetails.preparedBy}</Text>
//         </Text>
//         <Text style={styles.text}>
//           Approved By: <Text style={styles.bold}>{employeeDetails.approvedBy}</Text>
//         </Text>
//       </View>
//     </Page>
//   </Document>
// );

const GeneratedSalarySlip = ({
  employeeDetails,
  netSalary,
  convertNumberToWords,
}) => {
  const [open, setOpen] = useState(false);

  const handleView = () => {
    setOpen(true);
  };

  const handleDownloadClick = async () => {
    try {
      const blob = await pdf(
        <SalarySlipDocument salarySlip={employeeDetails} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `salary_slip_${salarySlip.salary_slip_number}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex roboto-regular justify-center items-center h-screen bg-white p-4">
      <Card className="w-full max-w-2xl bg-white rounded-lg overflow-hidden">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-primary_color text-center">
            Salary Slip For The Month of {dayjs().format("MMMM")}
          </h2>
          <div className="p-6">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Name:{" "}
                  <span className="font-normal">{employeeDetails.name}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Employee ID:{" "}
                  <span className="font-normal">{employeeDetails.id}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Designation:{" "}
                  <span className="font-normal">
                    {employeeDetails.designation}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Department:{" "}
                  <span className="font-normal">
                    {employeeDetails.department}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Date Of Joining:{" "}
                  <span className="font-normal">
                    {employeeDetails.dateOfJoining}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Basic Salary:{" "}
                  <span className="font-normal">
                    ₹ {employeeDetails.basicSalary}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Allowances:{" "}
                  <span className="font-normal">
                    ₹ {employeeDetails.allowances}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Deductions:{" "}
                  <span className="font-normal">
                    ₹ {employeeDetails.deductions}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <div className="mt-6 border-t border-gray-300 pt-4">
              <Typography
                variant="subtitle1"
                className="text-gray-800 font-semibold"
              >
                Net Salary Amount:{" "}
                <span className="text-green-600">₹ {netSalary}</span>
              </Typography>
              <Typography
                variant="subtitle1"
                className="text-gray-800 font-semibold"
              >
                Amount in Words:{" "}
                <span className="text-green-600">
                  {convertNumberToWords(netSalary)} Only
                </span>
              </Typography>
            </div>
            <Grid container spacing={4} className="mt-6">
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Prepared By:{" "}
                  <span className="font-normal">
                    {employeeDetails.preparedBy}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Approved By:{" "}
                  <span className="font-normal">
                    {employeeDetails.approvedBy}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div className="mt-6 flex justify-between">
            <Button
              variant="contained"
              color="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleView}
            >
              View Slip
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDownloadClick}
            >
              Download Slip
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div className="p-6">
            <Typography
              variant="h5"
              component="div"
              className="text-center mb-6 font-bold text-gray-800"
            >
              Salary Slip For The Month of {dayjs().format("MMMM")}
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Name:{" "}
                  <span className="font-normal">{employeeDetails.name}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Employee ID:{" "}
                  <span className="font-normal">{employeeDetails.id}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Designation:{" "}
                  <span className="font-normal">
                    {employeeDetails.designation}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Department:{" "}
                  <span className="font-normal">
                    {employeeDetails.department}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Date Of Joining:{" "}
                  <span className="font-normal">
                    {employeeDetails.dateOfJoining}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Basic Salary:{" "}
                  <span className="font-normal">
                    ₹ {employeeDetails.basicSalary}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Allowances:{" "}
                  <span className="font-normal">
                    ₹ {employeeDetails.allowances}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Deductions:{" "}
                  <span className="font-normal">
                    ₹ {employeeDetails.deductions}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <div className="mt-6 border-t border-gray-300 pt-4">
              <Typography
                variant="subtitle1"
                className="text-gray-800 font-semibold"
              >
                Net Salary Amount:{" "}
                <span className="text-green-600">₹ {netSalary}</span>
              </Typography>
              <Typography
                variant="subtitle1"
                className="text-gray-800 font-semibold"
              >
                Amount in Words:{" "}
                <span className="text-green-600">
                  {convertNumberToWords(netSalary)} Only
                </span>
              </Typography>
            </div>
            <Grid container spacing={4} className="mt-6">
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Prepared By:{" "}
                  <span className="font-normal">
                    {employeeDetails.preparedBy}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className="text-gray-700 font-medium">
                  Approved By:{" "}
                  <span className="font-normal">
                    {employeeDetails.approvedBy}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

GeneratedSalarySlip.propTypes = {
  employeeDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired,
    dateOfJoining: PropTypes.string.isRequired,
    basicSalary: PropTypes.string.isRequired,
    allowances: PropTypes.string.isRequired,
    deductions: PropTypes.string.isRequired,
    preparedBy: PropTypes.string.isRequired,
    approvedBy: PropTypes.string.isRequired,
  }).isRequired,
  netSalary: PropTypes.number.isRequired,
  convertNumberToWords: PropTypes.func.isRequired,
};

export default GeneratedSalarySlip;
