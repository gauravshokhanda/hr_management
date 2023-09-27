import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  section: {
    margin: 5,
    flexGrow: 1,
    border: "1px solid #b7b7b7",
    borderRadius: 6,
    maxHeight: 300,
  },
  heading: {
    padding: 15,
    fontSize: 24,
    color: "#222222",
    borderBottom: "1px solid #b7b7b7",
    fontWeight: "700",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#c6f1ff",
    padding: 15,
  },
  amountText: {
    fontSize: 14,
    fontFamily: "Helvetica",
  },
  paymentContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalPaymentContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#b1b1b1",
  },
  paymentName: {
    fontWeight: 500,
    fontSize: 16,
    color: "#222222",
  },
  paymentAmount: {
    fontWeight: 500,
    fontSize: 16,
    color: "#777",
  },
});

export default function SalarySlip({ salaryData }) {
  console.log(salaryData, "salary Data");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Earnings</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>Amount in (Rupees)</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentName}>Basic</Text>
            <Text style={styles.paymentAmount}>{salaryData.basicSalary}</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentName}>HRA</Text>
            <Text style={styles.paymentAmount}>{salaryData.hraSalary}</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentName}>Conveyance</Text>
            <Text style={styles.paymentAmount}>{salaryData.conveyance}</Text>
          </View>
          <View style={styles.totalPaymentContainer}>
            <Text style={styles.paymentName}>Total</Text>
            <Text style={styles.paymentName}>{salaryData.totalSalary}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Deductions</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>Amount in (Rupees)</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentName}>PF</Text>
            <Text style={styles.paymentAmount}>{salaryData.pfSalary}</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentName}> </Text>
            <Text style={styles.paymentAmount}> </Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentName}> </Text>
            <Text style={styles.paymentAmount}> </Text>
          </View>
          <View style={styles.totalPaymentContainer}>
            <Text style={styles.paymentName}>Total</Text>
            <Text style={styles.paymentName}>{salaryData.pfSalary}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
