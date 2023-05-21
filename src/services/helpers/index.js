import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: "en-NG",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  },
});

export const approvalStages = [
  {
    name: "budget-office",
    canEdit: false,
    role: "budget-office-officer",
    canQuery: false,
    level: 1,
    next: "treasury",
    action: "clear",
  },
  {
    name: "treasury",
    canEdit: true,
    role: "treasury-officer",
    canQuery: false,
    level: 2,
    next: "audit",
    action: "clear",
  },
  {
    name: "audit",
    canEdit: false,
    role: "audit-officer",
    canQuery: true,
    level: 3,
    next: "accounts",
    action: "clear",
  },
  {
    name: "accounts",
    canEdit: false,
    role: "treasury-officer",
    canQuery: false,
    level: 4,
    next: "sun-systems",
    action: "post",
  },
];

export const splitRoute = (pathname) => {
  const url = pathname.split("/")[1];
  return "/" + url;
};

export const amountToWords = (amount) => {
  return toWords.convert(amount);
};

export const currency = (fig, label = false) => {
  let currency = Intl.NumberFormat("en-US");
  return `${label ? "" : "NGN "}${currency.format(fig)}`;
};

export const currencyNoSymbol = (fig) => {
  let currency = Intl.NumberFormat("en-US");
  return currency.format(fig);
};

export const batchValues = [
  {
    name: "staff-payment",
    maxSlot: 6,
    subBudgetCode: "",
    prefix: "SP",
    default: true,
  },
  {
    name: "third-party",
    maxSlot: 1,
    subBudgetCode: "",
    prefix: "TPP",
    default: false,
  },
];

export const departmentTypes = [
  {
    key: "committee",
    value: "Committee",
  },
  {
    key: "unit",
    value: "Unit",
  },
  {
    key: "department",
    value: "Department",
  },
  {
    key: "division",
    value: "Division",
  },
  {
    key: "directorate",
    value: "Directorate",
  },
];

export const adminRoles = [
  "budget-controller",
  "budget-office-officer",
  "head-of-budget",
  "ict-admin",
  "ict-manager",
  "fad-manager",
  "fad-admin",
  "budget-owner",
  "super-administrator",
  "dfpm",
  "executive-secretary",
];

export const remunerationTypes = [
  {
    key: "earnings",
    value: "Earnings",
  },
  {
    key: "allowances",
    value: "Allowances",
  },
];

export const remunerationCategories = [
  {
    key: "remittance",
    value: "Remittance",
  },
  {
    key: "claims",
    value: "Claims",
  },
];

export const formatSelectOptions = (data, value, label) =>
  data?.length > 0 &&
  data.map((val) => ({
    value: val[value],
    label: val[label],
  }));

export const allowedFileTypes = ["jpg", "jpeg", "png"];
export const getFileExt = (name) => name.split(".").pop();

export const uploadImageCallBack = (file) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader("Authorization", "Client-ID ##clientid###");
    const data = new FormData();
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      resolve(response);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      console.log(error);
      reject(error);
    });
  });
};

export const unique = () => {
  const min = 10000;
  const max = 90000;
  const num = Math.floor(Math.random() * max) + min;
  return num;
};

export const verifyNumOfDays = (started, ended, difference) => {
  const date1 = new Date(started);
  const date2 = new Date(ended);
  const diffTime = Math.abs(date2 - date1);

  const result = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return result - difference;
};

export const EXTS = ["xlsx", "xls", "csv"];

export const ImportTypes = [
  {
    id: 1,
    label: "Departments",
    value: "departments",
  },
  {
    id: 2,
    label: "Staff",
    value: "staff",
  },
  {
    id: 3,
    label: "Budget Heads",
    value: "budget-heads",
  },
  {
    id: 4,
    label: "Sub Budget Heads",
    value: "sub-budget-heads",
  },
  {
    id: 5,
    label: "Modules",
    value: "modules",
  },
  {
    id: 6,
    label: "Roles",
    value: "roles",
  },
  {
    id: 7,
    label: "Grade Levels",
    value: "grade-levels",
  },
  {
    id: 8,
    label: "Onboard Staff",
    value: "onboarding",
  },
  {
    id: 9,
    label: "Fund",
    value: "funds",
  },
];

export const getExtension = (file) => {
  const parts = file.name.split(".");
  const ext = parts[parts.length - 1];
  return EXTS.includes(ext);
};

export const convertToJson = (headers, data) => {
  const rows = [];
  data.forEach((row) => {
    let rowData = {};
    row.forEach((el, index) => {
      rowData[headers[index]] = el;
    });
    rows.push(rowData);
  });

  return rows;
};

export const inputTypes = [
  { key: "text", label: "Text" },
  { key: "textarea", label: "Textarea" },
  { key: "select", label: "Select" },
  { key: "file", label: "File" },
  { key: "number", label: "Number" },
  { key: "password", label: "Password" },
  { key: "email", label: "Email" },
  { key: "checkbox", label: "Checkbox" },
  { key: "radio", label: "Radio" },
];

export const configGroups = [
  { key: "site", label: "Site" },
  { key: "admin", label: "Admin" },
];

export const splitDetails = (txt) => {
  const arrs = txt.split(",");
  const options = [];

  arrs.forEach((el) => {
    const inner = el.split(":");
    const list = {
      key: inner[0],
      label: inner[1],
    };

    options.push(list);
  });

  return options;
};
