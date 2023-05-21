import React, { useEffect, useState } from "react";

const DashboardCards = ({ items }) => {
  const { paymentForms } = items;
  const [exps, setExps] = useState([]);
  const [reversed, setReversed] = useState([]);

  useEffect(() => {
    if (paymentForms?.length > 0) {
      setExps(paymentForms.filter((exp) => exp?.status !== "reversed"));
      setReversed(paymentForms.filter((exp) => exp?.status === "reversed"));
    }
  }, [paymentForms]);

  const dashboardCards = [
    {
      title: "Payment Forms",
      url: "/insights/payments",
      value: exps?.length,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "all",
      icon: "description",
    },
    {
      title: "Third Party Payments",
      url: "/insights/payments",
      value: exps?.filter((exp) => exp?.payment_type === "third-party")?.length,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "third-party-payment",
      icon: "list_alt",
    },
    {
      title: "Staff Payments",
      url: "/insights/payments",
      value: exps?.filter((exp) => exp?.payment_type === "staff-payment")
        ?.length,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "staff-payment",
      icon: "article",
    },
    {
      title: "Logistics Refunds",
      url: "/budget/logistics/refund/response",
      value: 0,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "refunds",
      icon: "history",
    },
    {
      title: "Reversal Requests",
      url: "/budget/reverse/payment",
      value: 0,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "reversals",
      icon: "request_page",
    },
    {
      title: "Pending Transactions",
      url: "/budget/payments",
      value: exps?.filter(
        (exp) => exp?.status !== "paid" || exp?.status !== "refunded"
      )?.length,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "pending",
      icon: "pending",
    },
    {
      title: "Paid Transactions",
      url: "/budget/payments",
      value: exps?.filter((exp) => exp?.status === "paid")?.length,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "paid",
      icon: "paid",
    },
    {
      title: "Reversed Transactions",
      url: "/budget/reverse/payment",
      value: reversed?.length,
      roles: ["budget-controller", "budget-owner"],
      adminRoles: ["dfpm", "ict-manager", "super-administrator", "es"],
      action: "view more",
      tag: "reversals",
      icon: "receipt_long",
    },
  ];

  // &#8358;

  // console.log(paymentForms, dashboardCards);
  return (
    <>
      {dashboardCards?.map((card, i) => (
        <div className="col-md-3" key={i}>
          <div className="insight__cards">
            <span className="material-icons-sharp insight__icon">
              {card.icon}
            </span>
            <p className="title mt-2">{card.title}</p>
            <h1 className="mt-2">{card.value}</h1>
            {/* <button type="button" className="insights__btn">
              {card?.action}
            </button> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default DashboardCards;
