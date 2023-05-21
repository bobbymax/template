/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetch } from "../../controllers";
import { columns } from "../../controllers/columns";
import { currency } from "../../services/helpers";
import DataTables from "../../template/components/tables/DataTables";
import { CSVLink } from "react-csv";
import { headers } from "../../controllers/headers";

const ExpenditureBreakdown = () => {
  const { state } = useLocation();
  const initialCardState = {
    totalPaymentsRaised: 0,
    totalPaymentsCount: 0,
    totalPaidPayments: 0,
    totalPaidPaymentsCount: 0,
    totalPendingPayments: 0,
    totalPendingPaymentsCount: 0,
    totalReversedPayments: 0,
    totalReversedPaymentsCount: 0,
  };
  const [expState, setExpState] = useState(initialCardState);
  const [subBudgetHead, setSubBudgetHead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expenditures, setExpenditures] = useState([]);

  const csvReport = {
    data: expenditures,
    headers: headers.expenditures,
    filename: `${subBudgetHead?.name}-expenditures-breakdown.csv`,
  };

  useEffect(() => {
    if (expenditures?.length > 0) {
      const statuses = ["paid", "reversed", "refunded"];
      const reversed = expenditures?.filter(
        (exp) => exp?.status === "reversed"
      );

      const paid = expenditures?.filter((exp) => exp?.status === "paid");
      const pending = expenditures?.filter(
        (exp) => !statuses.includes(exp?.status)
      );
      const total = expenditures?.filter(
        (exp) => exp?.status !== "reversed" || exp?.status !== "refunded"
      );

      setExpState({
        ...expState,
        totalPaymentsRaised: total
          ?.map((exp) => parseFloat(exp?.amount))
          .reduce((sum, curr) => sum + curr, 0),
        totalPaymentsCount: total?.length,
        totalPaidPayments: paid
          ?.map((exp) => parseFloat(exp?.amount))
          .reduce((sum, curr) => sum + curr, 0),
        totalPaidPaymentsCount: paid?.length,
        totalPendingPayments: pending
          ?.map((exp) => parseFloat(exp?.amount))
          .reduce((sum, curr) => sum + curr, 0),
        totalPendingPaymentsCount: pending?.length,
        totalReversedPayments: reversed
          ?.map((exp) => parseFloat(exp?.amount))
          .reduce((sum, curr) => sum + curr, 0),
        totalReversedPaymentsCount: reversed?.length,
      });
    }
  }, [expenditures]);

  useEffect(() => {
    if (subBudgetHead !== null) {
      try {
        setIsLoading(true);

        fetch("fetch/expenditures", subBudgetHead?.id)
          .then((res) => {
            const response = res.data.data;

            setIsLoading(false);
            setExpenditures(response);
          })
          .catch((err) => {
            console.log(err.message);
            setIsLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [subBudgetHead]);

  useEffect(() => {
    if (state !== null) {
      const { subHead } = state;
      setSubBudgetHead(subHead);
    }
  }, [state]);

  console.log(expenditures);

  return (
    <>
      <div className="row">
        <div className="col-md-4 mb-5">
          <CSVLink {...csvReport} className="export__btn">
            Export to CSV
          </CSVLink>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="summary__card">
            <p>Total Payments Raised</p>
            <h1>&#8358; {currency(expState.totalPaymentsRaised, true)}</h1>
            <small>
              {`${expState.totalPaymentsCount} payments have been raised`?.toUpperCase()}
            </small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary__card">
            <p>Pending Payments</p>
            <h1>&#8358; {currency(expState.totalPendingPayments, true)}</h1>
            <small>
              {`${expState.totalPendingPaymentsCount} payment(s) awaiting payment`?.toUpperCase()}
            </small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary__card">
            <p>Total Paid Raised</p>
            <h1>&#8358; {currency(expState.totalPaidPayments, true)}</h1>
            <small>
              {`${expState.totalPaidPaymentsCount} payments have been paid`?.toUpperCase()}
            </small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="summary__card">
            <p>Reversed Payments</p>
            <h1>&#8358; {currency(expState.totalReversedPayments, true)}</h1>
            <small>
              {`${expState.totalReversedPaymentsCount} payment(s) have been reversed`?.toUpperCase()}
            </small>
          </div>
        </div>
      </div>
      <div className="custom__card">
        <DataTables
          isFetching={isLoading}
          pillars={columns.expenditures}
          rows={expenditures}
        />
      </div>
    </>
  );
};

export default ExpenditureBreakdown;
