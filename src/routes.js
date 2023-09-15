// Hr Management Dashboard React layouts
import Attendence from "layouts/attendence";
import Leave from "layouts/leave";
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const routes = [
  {
    type: "collapse",
    name: "Attendence",
    key: "attendence",
    route: "/attendence",
    icon: <BackHandIcon sx={{width: '14px'}} />,
    component: <Attendence />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Notice Board",
    key: "notice",
    route: "/notice",
    icon: <AssignmentIcon sx={{width: '14px'}} />,
    component: <NoticeBoard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Holiday List",
    key: "holiday-list",
    route: "/holiday-list",
    icon: <Shop size="12px" />,
    component: <HolidayList />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Employee",
    key: "manageEmployee",
    route: "/manageEmployee",
    icon: <Office size="12px" />,
    component: <Employee />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Leave",
    key: "leave",
    route: "/leave",
    icon: <CalendarMonthIcon sx={{width: '16px'}} />,
    component: <Leave />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Salary Slip",
    key: "salary",
    route: "/salary-slip",
    icon: <AccountBalanceWalletIcon sx={{width: '14px'}}  />,
    component: <SalarySlip />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "hidden",
    name: "Register",
    key: "register",
    route: "/register",
    component: <Register />,
  },
  {
    type: "hidden",
    name: "Add-Notice",
    key: "add-notice",
    route: "/notice/add-notice",
    component: <AddNotice />,
  },
  {
    type: "hidden",
    name: "Employees/",
    key: "employee",
    route: "/manageEmployee/:id",
    component: <EmployeeDetail />,
  },
];

export default routes;
