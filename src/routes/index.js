import { lazy } from "react";

const Login = lazy(() => import("../views/Login"));
const Dashboard = lazy(() => import("../views/Dashboard"));
const BudgetHeads = lazy(() => import("../views/budget/heads/BudgetHeads"));
const SubBudgetHeads = lazy(() =>
  import("../views/budget/heads/SubBudgetHeads")
);
const Funds = lazy(() => import("../views/budget/heads/Funds"));
const Expenditures = lazy(() => import("../views/budget/flow/Expenditures"));
const Batches = lazy(() => import("../views/budget/flow/Batches"));
const Payments = lazy(() => import("../views/budget/flow/Payments"));
const Approvals = lazy(() => import("../views/budget/payments/Approvals"));
const TouringAdvance = lazy(() =>
  import("../views/budget/cash-advance/TouringAdvance")
);
const ReversePayments = lazy(() =>
  import("../views/budget/payments/ReversePayments")
);
const RequestRefund = lazy(() =>
  import("../views/budget/refunds/RequestRefund")
);
const LogisticsRefunds = lazy(() =>
  import("../views/budget/refunds/LogisticsRefunds")
);
const Breakdown = lazy(() => import("../views/budget/Breakdown"));
const ExpenditureBreakdown = lazy(() =>
  import("../views/budget/ExpenditureBreakdown")
);

const Pages = lazy(() => import("../views/Pages"));
const Modules = lazy(() => import("../views/modules/Modules"));
const Roles = lazy(() => import("../views/modules/Roles"));
const Workflow = lazy(() => import("../views/modules/Workflow"));
const Processes = lazy(() => import("../views/modules/Processes"));

const Grades = lazy(() => import("../views/hr/Grades"));
const Departments = lazy(() => import("../views/hr/Departments"));
const Remunerations = lazy(() => import("../views/hr/Remunerations"));
const Settlements = lazy(() => import("../views/hr/Settlements"));
const Staff = lazy(() => import("../views/hr/Staff"));
const ManageStaff = lazy(() => import("../views/hr/ManageStaff"));

const Brands = lazy(() => import("../views/inventory/Brands"));
const Classifications = lazy(() =>
  import("../views/inventory/Classifications")
);
const Categories = lazy(() => import("../views/inventory/Categories"));
const Products = lazy(() => import("../views/inventory/Products"));
const Requisitions = lazy(() => import("../views/inventory/Requisitions"));
const CreateRequisition = lazy(() =>
  import("../views/pages/CreateRequisition")
);
const Orders = lazy(() => import("../views/inventory/Orders"));
const ApproveRequisition = lazy(() =>
  import("../views/modals/ApproveRequisition")
);
const Distributions = lazy(() => import("../views/inventory/Distributions"));

const Courses = lazy(() => import("../views/hr/Courses"));
const Qualifications = lazy(() => import("../views/hr/Qualifications"));
const Plan = lazy(() => import("../views/learning/Plan"));
const Trainings = lazy(() => import("../views/learning/Trainings"));
const VerifyTrainings = lazy(() => import("../views/learning/VerifyTrainings"));

const Commitments = lazy(() => import("../views/appraisal/Commitments"));
const TasksAndTargets = lazy(() =>
  import("../views/appraisal/TasksAndTargets")
);
const Claims = lazy(() => import("../views/services/Claims"));
const Retirement = lazy(() => import("../views/services/Retirement"));
const Expenses = lazy(() => import("../views/services/Expenses"));
const ClaimExport = lazy(() => import("../views/exports/ClaimExport"));
const BatchExport = lazy(() => import("../views/exports/BatchExport"));

const BatchPayments = lazy(() => import("../views/tracking/BatchPayments"));
const Entries = lazy(() => import("../views/tracking/Entries"));
const Exports = lazy(() => import("../views/modules/Exports"));
const Imports = lazy(() => import("../views/modules/Imports"));
const Settings = lazy(() => import("../views/modules/Settings"));
const Configuration = lazy(() => import("../views/modules/Configuration"));

export const routes = {
  guest: [
    {
      name: "Login",
      element: <Login />,
      url: "/auth/login",
    },
  ],
  protected: [
    {
      name: "Insights",
      element: <Dashboard />,
      url: "/",
    },
    {
      name: "Learning",
      element: <Pages />,
      url: "/learning",
    },
    {
      name: "Plans",
      element: <Plan />,
      url: "/learning/plan",
    },
    {
      name: "Trainings",
      element: <Trainings />,
      url: "/learning/trainings",
    },
    {
      name: "Verify Trainings",
      element: <VerifyTrainings />,
      url: "/learning/verify/trainings",
    },
    {
      name: "Budget",
      element: <Pages />,
      url: "/budget",
    },
    {
      name: "Assessment",
      element: <Pages />,
      url: "/assessment",
    },
    {
      name: "Commitments",
      element: <Commitments />,
      url: "/assessment/commitment",
    },
    {
      name: "Tasks & Targets",
      element: <TasksAndTargets />,
      url: "/assessment/commitment/tasks-and-target",
    },
    {
      name: "Staff Services",
      element: <Pages />,
      url: "/services",
    },
    {
      name: "Claims",
      element: <Claims />,
      url: "/services/claims",
    },
    {
      name: "Retirement",
      element: <Retirement />,
      url: "/services/retirements",
    },
    {
      name: "Claim Export",
      element: <ClaimExport />,
      url: "/services/claims/print",
    },
    {
      name: "Batch Export",
      element: <BatchExport />,
      url: "/budget/batch/print",
    },
    {
      name: "Budget Breakdown",
      element: <Breakdown />,
      url: "/budget/expenses/breakdown",
    },
    {
      name: "Expenditure Breakdown",
      element: <ExpenditureBreakdown />,
      url: "/budget/expenditures/breakdown",
    },
    {
      name: "Approve Payment",
      element: <Approvals />,
      url: "/budget/clear/batch",
    },
    {
      name: "Claim Expenses",
      element: <Expenses />,
      url: "/services/claims/details",
    },
    {
      name: "Retirement Expenses",
      element: <Expenses />,
      url: "/services/retirement/details",
    },
    {
      name: "Tracking",
      element: <Pages />,
      url: "/tracking",
    },
    {
      name: "Grade Levels",
      element: <Grades />,
      url: "/admin/grade-levels",
    },
    {
      name: "Staff",
      element: <Staff />,
      url: "/admin/staff",
    },
    {
      name: "Manage Staff",
      element: <ManageStaff />,
      url: "/admin/manage/staff/profile",
    },
    {
      name: "Departments",
      element: <Departments />,
      url: "/admin/departments",
    },
    {
      name: "Remunerations",
      element: <Remunerations />,
      url: "/admin/remunerations",
    },
    {
      name: "Settlements",
      element: <Settlements />,
      url: "/admin/settlements",
    },
    {
      name: "Exports",
      element: <Exports />,
      url: "/admin/exports",
    },
    {
      name: "Courses",
      element: <Courses />,
      url: "/admin/courses",
    },
    {
      name: "Qualifications",
      element: <Qualifications />,
      url: "/admin/qualifications",
    },
    {
      name: "Inventory",
      element: <Pages />,
      url: "/inventory",
    },
    {
      name: "Brands",
      element: <Brands />,
      url: "/inventory/brands",
    },
    {
      name: "Classifications",
      element: <Classifications />,
      url: "/inventory/classifications",
    },
    {
      name: "Sortings",
      element: <Categories />,
      url: "/inventory/categories",
    },
    {
      name: "Products",
      element: <Products />,
      url: "/inventory/products",
    },
    {
      name: "Requisitions",
      element: <Requisitions />,
      url: "/inventory/requisitions",
    },
    {
      name: "Create Requisition",
      element: <CreateRequisition />,
      url: "/inventory/requisitions/create",
    },
    {
      name: "Orders",
      element: <Orders />,
      url: "/inventory/approve/requisitions",
    },
    {
      name: "Second Requisition Request",
      element: <ApproveRequisition />,
      url: "/inventory/requistion/request",
    },
    {
      name: "Distributions",
      element: <Distributions />,
      url: "/inventory/distributions",
    },
    {
      name: "Administration",
      element: <Pages />,
      url: "/admin",
    },
    {
      name: "Import Dependencies",
      element: <Imports />,
      url: "/admin/import",
    },
    {
      name: "Settings",
      element: <Settings />,
      url: "/admin/settings",
    },
    {
      name: "Portal Configuration",
      element: <Configuration />,
      url: "/admin/configuration",
    },
    {
      name: "Workflows",
      element: <Workflow />,
      url: "/admin/processes",
    },
    {
      name: "Processes",
      element: <Processes />,
      url: "/admin/workflow/process",
    },
    {
      name: "Budget Heads",
      element: <BudgetHeads />,
      url: "/budget/budget-heads",
    },
    {
      name: "Sub-Budget Heads",
      element: <SubBudgetHeads />,
      url: "/budget/sub-budget-heads",
    },
    {
      name: "Funds",
      element: <Funds />,
      url: "/budget/funds",
    },
    {
      name: "Request Refunds",
      element: <RequestRefund />,
      url: "/budget/logistics/refund/request",
    },
    {
      name: "Expenditures",
      element: <Expenditures />,
      url: "/budget/expenditures",
    },
    {
      name: "Batch Payments",
      element: <Batches />,
      url: "/budget/batch",
    },
    {
      name: "Payments",
      element: <Payments />,
      url: "/budget/payments",
    },
    {
      name: "Touring Adavnce",
      element: <TouringAdvance />,
      url: "/budget/touring-advance",
    },
    {
      name: "Logistics Refunds",
      element: <LogisticsRefunds />,
      url: "/budget/logistics/refund/response",
    },
    {
      name: "Reverse Payment",
      element: <ReversePayments />,
      url: "/budget/reverse/payment",
    },
    {
      name: "Modules",
      element: <Modules />,
      url: "/admin/modules",
    },
    {
      name: "Roles",
      element: <Roles />,
      url: "/admin/roles",
    },
    {
      name: "Disbursements",
      element: <BatchPayments />,
      url: "/tracking/disbursements",
    },
    {
      name: "Tracking Entries",
      element: <Entries />,
      url: "/tracking/disbursements/batch",
    },
  ],
};
