export const columns = {
  budgetHeads: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Code",
      accessor: "budgetId",
    },
  ],
  subBudgetHeads: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Budget Code",
      accessor: "code",
    },
  ],
  breakdown: [
    {
      Header: "Budget Code",
      accessor: "code",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Approved Amount",
      accessor: "approved_amount",
    },
    {
      Header: "Booked Expenditure",
      accessor: "booked_expenditure",
    },
    {
      Header: "Booked Balance",
      accessor: "booked_balance",
    },
    {
      Header: "Actual Expenditure",
      accessor: "actual_expenditure",
    },
    {
      Header: "Actual Balance",
      accessor: "actual_balance",
    },
  ],
  funds: [
    {
      Header: "Code",
      accessor: "sub_budget_head_code",
    },
    {
      Header: "Budget Owner",
      accessor: "budget_owner",
    },
    {
      Header: "Approved Amount",
      accessor: "approved_amount",
    },
    {
      Header: "Booked Expenditure",
      accessor: "booked_expenditure",
    },
    {
      Header: "Budget Type",
      accessor: "type",
    },
  ],
  expenditures: [
    {
      Header: "Code",
      accessor: "sub_budget_head_code",
    },
    {
      Header: "Beneficiary",
      accessor: "beneficiary",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Purpose",
      accessor: "description",
    },
    {
      Header: "Created At",
      accessor: "created_at",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  modules: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "URL",
      accessor: "url",
    },
    {
      Header: "Type",
      accessor: "type",
    },
  ],
  payments: [
    {
      Header: "Budget Code",
      accessor: "sub_budget_head_code",
    },
    {
      Header: "Batch No.",
      accessor: "code",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Payments",
      accessor: "no_of_payments",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Generated",
      accessor: "created_at",
    },
  ],
  levels: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Code",
      accessor: "key",
    },
  ],
  departments: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "Type",
      accessor: "type",
    },
  ],
  remunerations: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Category",
      accessor: "category",
    },
  ],
  settlements: [
    {
      Header: "Remunation",
      accessor: "remuneration_name",
    },
    {
      Header: "Grade Level",
      accessor: "grade_level_name",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
  ],
  brands: [
    {
      Header: "Name",
      accessor: "name",
    },
  ],
  classifications: [
    {
      Header: "Name",
      accessor: "name",
    },
  ],
  categories: [
    {
      Header: "Name",
      accessor: "name",
    },
  ],
  products: [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "Quantity",
      accessor: "quantity_expected",
    },
  ],
  requisitions: [
    {
      Header: "Requisitor",
      accessor: "requisitor_staff_name",
    },
    {
      Header: "Approving Officer",
      accessor: "manager_staff_name",
    },
    {
      Header: "No of Items",
      accessor: "no_of_items",
    },
    {
      Header: "Created At",
      accessor: "created_at",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  items: [
    {
      Header: "Product",
      accessor: "product_name",
    },
    {
      Header: "Expected",
      accessor: "quantity_expected",
    },
    {
      Header: "Received",
      accessor: "quantity_received",
    },
    {
      Header: "Urgency",
      accessor: "urgency",
    },
  ],
  distributions: [
    {
      Header: "Product",
      accessor: "product_id",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Floor",
      accessor: "floor",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  courses: [
    {
      Header: "Name",
      accessor: "name",
    },
  ],
  qualifications: [
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Min",
      accessor: "min",
    },
    {
      Header: "Max",
      accessor: "max",
    },
  ],
  trainings: [
    {
      Header: "Title",
      accessor: "title",
    },
  ],
  joinings: [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Category",
      accessor: "course",
    },
    {
      Header: "Qualification",
      accessor: "qualification",
    },
    {
      Header: "Start",
      accessor: "start",
    },
    {
      Header: "Finish",
      accessor: "end",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  commitments: [
    {
      Header: "User",
      accessor: "user_id",
    },
    {
      Header: "Result",
      accessor: "result",
    },
  ],
  claims: [
    {
      Header: "Code",
      accessor: "reference_no",
    },
    {
      Header: "Purpose",
      accessor: "title",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  staff: [
    {
      Header: "Staff No.",
      accessor: "staff_no",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
  ],
  roles: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Slots",
      accessor: "slots",
    },
  ],
  touringAdvance: [
    {
      Header: "Code",
      accessor: "reference_no",
    },
    {
      Header: "Beneficiary",
      accessor: "beneficiary",
    },
    {
      Header: "Purpose",
      accessor: "title",
    },
    {
      Header: "Amount",
      accessor: "total_amount",
    },
    {
      Header: "Raised At",
      accessor: "created_at",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  demands: [
    {
      Header: "Batch No.",
      accessor: "batch_no",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Raised",
      accessor: "created_at",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  refunds: [
    {
      Header: "Batch No.",
      accessor: "batch",
    },
    {
      Header: "Beneficiary",
      accessor: "beneficiary",
    },
    {
      Header: "Department",
      accessor: "department_code",
    },
    {
      Header: "Amount",
      accessor: "requested_amount",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Raised",
      accessor: "created_at",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ],
  processes: [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Active",
      accessor: "isActive",
    },
  ],
  tracking: [
    {
      Header: "Code",
      accessor: "codeId",
    },
    {
      Header: "Reference No.",
      accessor: "code",
    },
    {
      Header: "Department",
      accessor: "department_code",
    },
    {
      Header: "Office",
      accessor: "office",
    },
    {
      Header: "Created",
      accessor: "created_at",
    },
  ],
  settings: [
    {
      Header: "Key",
      accessor: "key",
    },
    {
      Header: "Name",
      accessor: "display_name",
    },
    {
      Header: "Type",
      accessor: "input_type",
    },
    {
      Header: "Group",
      accessor: "group",
    },
  ],
};
