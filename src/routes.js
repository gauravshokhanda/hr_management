// Hr Management Dashboard React layouts
import React from "react";
import Attendence from "layouts/attendence";
import SalarySlip from "layouts/salary";
import NoticeBoard from "layouts/noticeBoard";
import AddNotice from "layouts/noticeBoard/addnotice";
import HolidayList from "layouts/holidayList";
import Employee from "layouts/manageEmployee";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import Register from "layouts/authentication/register";
import EmployeeDetail from "layouts/manageEmployee/employeeDetail";

// Hr Management Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Document from "examples/Icons/Document";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import BackHandIcon from '@mui/icons-material/BackHand';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const routes = [
  {
    type: "collapse",
    name: "Attendence",
    key: "attendence",
    route: "/attendence",
    icon: <BackHandIcon sx={{width: '14px'}} />,
    component: <Attendence />,
    adminOnly: false,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Notice Board",
    key: "notice",
    route: "/notice",
    icon: <AssignmentIcon sx={{width: '14px'}} />,
    component: <NoticeBoard />,
    adminOnly: false,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Holiday List",
    key: "holiday-list",
    route: "/holiday-list",
    icon: <Shop size="12px" />,
    component: <HolidayList />,
    adminOnly: false,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Employee",
    key: "manageEmployee",
    route: "/manageEmployee",
    icon: <Office size="12px" />,
    component: <Employee />,
    adminOnly: true,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    adminOnly: false,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Salary Slip",
    key: "salary",
    route: "/salary-slip",
    icon: <AccountBalanceWalletIcon sx={{width: '14px'}}  />,
    component: <SalarySlip />,
    adminOnly: false,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    adminOnly: false,
    noCollapse: true,
  },
  {
    type: "hidden",
    name: "Sign In",
    key: "sign-in",
    route: "/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    adminOnly: false,
  },
  {
    type: "hidden",
    name: "Register",
    key: "register",
    route: "/register/:id?",
    component: <Register />,
    adminOnly: false,
  },
  {
    type: "hidden",
    name: "Add-Notice",
    key: "add-notice",
    route: "/notice/add-notice",
    component: <AddNotice />,
    adminOnly: false,
  },
  {
    type: "hidden",
    name: "Employees/",
    key: "employee",
    route: "/attendence/:id",
    component: <EmployeeDetail />,
    adminOnly: false,
  },
];

export default routes;
