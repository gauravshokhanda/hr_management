import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import imageBrand from "assets/images/curved-images/curved-6.png";
import poppinsRegular from "../../assets/font/Poppins-Regular.ttf";
import poppinsBold from "../../assets/font/Poppins-Bold.ttf";
import poppinsSemi from "../../assets/font/Poppins-SemiBold.ttf";
import moment from "moment";

Font.register({
  family: "Poppins",
  fonts: [{ src: poppinsRegular, fontStyle: "normal", fontWeight: 500 }],
});
Font.register({
  family: "Poppins",
  fonts: [{ src: poppinsBold, fontStyle: "normal", fontWeight: "bold" }],
});
Font.register({
  family: "Poppins",
  fonts: [{ src: poppinsSemi, fontStyle: "normal", fontWeight: 600 }],
});

console.log(Font.getRegisteredFonts(), "font"); // Log the registered fonts

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "22px",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "14px",
    borderBottom: "2px solid #ddd",
  },
  brandContaier: {
    flexDirection: "column",
    gap: "6px",
  },
  brandName: {
    fontWeight: 600,
    fontSize: 18,
    color: "#222222",
    fontFamily: "Poppins",
  },
  address: {
    fontSize: 12,
    fontWeight: 500,
    color: "#808080",
    fontFamily: "Poppins",
  },
  brandLogo: {
    width: "100px",
    height: "auto",
  },
  brandImage: {
    width: "100%",
    objectFit: "cover",
  },
  aboutSection: {
    padding: "20px 0",
  },
  paddingTop: {
    paddingTop: "16px",
  },
  employeeName: {
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "Poppins",
  },
  employeeId: {
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    color: "#606060",
  },
  smallFont: {
    fontSize: "12px",
  },
  netContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  netPay: {
    flexDirection: "column",
    gap: "6px",
  },
  netPayAmount: {
    fontSize: "20px",
  },
  expensisContainer: {
    paddingBottom: "20px",
  },
  tableRrow: {
    borderBottom: "1px solid #ddd",
    padding: "12px 8px",
    flexDirection: "row",
    gap: "100px",
  },
  tableHeader: {
    backgroundColor: "#bdf0ff",
    borderBottom: "0px!important",
  },
  tableHeading: {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Poppins",
  },
  tableHeadingBottom: {
    fontSize: "14px",
  },
  tableHeadingConatiner: {
    width: "calc(50% - 50px)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accountSection: {
    flexDirection: "row",
    gap: "30px",
    alignItems: "center",
  },
});

export default function SalarySlip({ salaryData }) {
  console.log(salaryData, "salary Data");

  return (
    <Document>
      <Page size="A3" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandContaier}>
            <Text style={styles.brandName}>Leavecode Technologies Private Limited</Text>
            <Text style={styles.address}>Bijnor</Text>
          </View>
          <View style={styles.brandLogo}>
            <Image style={styles.brandImage} src={imageBrand} />
          </View>
        </View>
        <View style={styles.aboutSection}>
          <Text style={styles.brandName}>Payslip for the month of {moment(salaryData.creditMonth).format('MMMM YYYY')}</Text>
          <View style={[styles.brandContaier, styles.paddingTop]}>
            <Text style={styles.employeeName}>
              {salaryData.employeeName},{" "}
              <Text style={styles.employeeId}>{salaryData.employeeId}</Text>
            </Text>
            <Text style={styles.employeeId}>
              Fullstack Developer | Date of joining :{" "}
              {moment(salaryData.dateOfJoining).format("LL")}
            </Text>
          </View>
        </View>
        <View style={[styles.aboutSection, styles.netContainer]}>
          <View style={styles.accountSection}>
            <View style={styles.brandContaier}>
              <Text style={[styles.employeeId]}>Bank A/C Number</Text>
              <Text style={[styles.employeeName, styles.smallFont]}>
                {salaryData.accountNumber}
              </Text>
            </View>
            <View style={styles.brandContaier}>
              <Text style={[styles.employeeId]}>IFSC Cde</Text>
              <Text style={[styles.employeeName, styles.smallFont]}>{salaryData.ifscCode}</Text>
            </View>
            <View style={styles.brandContaier}>
              <Text style={[styles.employeeId]}>Credit Month</Text>
              <Text style={[styles.employeeName, styles.smallFont]}>
                {moment(salaryData.creditMonth).format("LL")}
              </Text>
            </View>
          </View>
          <View style={styles.netPay}>
            <Text style={styles.employeeId}>Employee Net Pay</Text>
            <Text style={styles.netPayAmount}>${salaryData.basicSalary}</Text>
            <Text style={styles.employeeId}>Paid Days : {salaryData.totalWorkingDays}</Text>
          </View>
        </View>
        <View style={styles.expensisContainer}>
          <View style={[styles.tableHeader, styles.tableRrow]}>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeading}>EARNINGS</Text>
              <Text style={styles.tableHeading}>AMOUNT</Text>
            </View>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeading}>DEDUCTIONS</Text>
              <Text style={styles.tableHeading}>AMOUNT</Text>
            </View>
          </View>
          <View style={styles.tableRrow}>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeadingBottom}>Bonus</Text>
              <Text style={styles.tableHeadingBottom}>$ {salaryData.bonus}</Text>
            </View>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeadingBottom}>P.F</Text>
              <Text style={styles.tableHeadingBottom}>$ {salaryData.pfSalary}</Text>
            </View>
          </View>
          <View style={styles.tableRrow}>
            <View style={styles.tableHeadingConatiner}></View>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeadingBottom}>HRA</Text>
              <Text style={styles.tableHeadingBottom}>$ {salaryData.hraSalary}</Text>
            </View>
          </View>
          <View style={styles.tableRrow}>
            <View style={styles.tableHeadingConatiner}>
              {/* <Text style={styles.tableHeadingBottom}>Over Time Pay</Text>
              <Text style={styles.tableHeadingBottom}>$ 2,500.00</Text> */}
            </View>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeadingBottom}>Conveyance</Text>
              <Text style={styles.tableHeadingBottom}>{salaryData.conveyance}</Text>
            </View>
          </View>
          <View style={[styles.tableHeader, styles.tableRrow]}>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeading}>TOTAL EARNINGS</Text>
              <Text style={styles.tableHeading}>{salaryData.bonus}</Text>
            </View>
            <View style={styles.tableHeadingConatiner}>
              <Text style={styles.tableHeading}>TOTAL DEDUCTIONS</Text>
              <Text style={styles.tableHeading}>
                $ {salaryData.hraSalary + salaryData.conveyance + salaryData.pfSalary}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
