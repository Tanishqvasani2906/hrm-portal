import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cell: {
    width: "50%",
    fontSize: 12,
    padding: 5,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
  },
});

// Create Document Component
const SalarySlipDocument = ({ salarySlip }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Salary Slip</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.cell}>Slip Number:</Text>
          <Text style={styles.cell}>{salarySlip.salary_slip_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Month:</Text>
          <Text style={styles.cell}>{salarySlip.month}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Year:</Text>
          <Text style={styles.cell}>{salarySlip.year}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Basic Salary:</Text>
          <Text style={styles.cell}>{salarySlip.basic_salary}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Net Pay:</Text>
          <Text style={styles.cell}>{salarySlip.net_pay}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Prepared By:</Text>
          <Text style={styles.cell}>{salarySlip.prepared_by || "None"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Approved By:</Text>
          <Text style={styles.cell}>{salarySlip.approved_by || "None"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Deductions:</Text>
          <Text style={styles.cell}>{salarySlip.deductions || "None"}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>Company XYZ</Text>
      </View>
    </Page>
  </Document>
);

export default SalarySlipDocument;
