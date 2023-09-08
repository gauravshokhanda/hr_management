
/** 
  All of the routes for the Hr Management Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Hr Management Dashboard React layouts
import Attendence from "layouts/attendence";
import Leave from "layouts/leave";
import SalarySlip from "layouts/salary";
import NoticeBoard from "layouts/noticeBoard";
import HolidayList from "layouts/holidayList";
import Employee from "layouts/manageEmployee";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import Register from "layouts/authentication/register";

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
];

export default routes;
