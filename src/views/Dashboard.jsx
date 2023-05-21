/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import logo from "../template/assets/images/ncdmb-logo.png";
import chip from "../template/assets/images/card-chip.png";
import { useStateContext } from "../context/ContextProvider";
import { adminRoles, currency } from "../services/helpers";
import { batchRequests, collection } from "../controllers";
import axios from "axios";
import DashboardCards from "./components/DashboardCards";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { auth } = useStateContext();
  const navigate = useNavigate();

  const initialState = {
    totalApprovedAmount: 0,
    totalBookedExpenditure: 0,
    totalBookedBalance: 0,
    totalActualExpenditure: 0,
    totalActualBalance: 0,
    totalExpectedPerformance: 0,
    totalActualPerformance: 0,
    totalReversed: 0,
    approvedAmount: 0,
    bookedExpenditure: 0,
    bookedBalance: 0,
    actualExpenditure: 0,
    actualBalance: 0,
    expectedPerformance: 0,
    actualPerformance: 0,
    paymentForms: [],
  };

  const [state, setState] = useState(initialState);
  const [roles, setRoles] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [reversals, setReversals] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const handleBreakdown = () => {
    navigate("/budget/expenses/breakdown", {
      state: {
        subHeads: subBudgetHeads,
      },
    });
  };

  useEffect(() => {
    if (auth !== null) {
      const { roles } = auth;
      setRoles(roles);
    }
  }, [auth]);

  useEffect(() => {
    if (expenditures?.length > 0 && subBudgetHeads?.length > 0) {
      const excludes = ["reversed", "refunded"];
      const bcoExps = expenditures.filter(
        (exp) => exp?.department_id == auth?.department_id
      );
      const bcoReversedExps = bcoExps.filter(
        (exp) => exp?.status === "reversed"
      );
      const bcoExpsBooked = bcoExps.filter(
        (exp) => exp?.status !== "reversed" || exp?.status !== "refunded"
      );
      const bcoSubs = subBudgetHeads.filter(
        (sub) => sub?.department_id == auth?.department_id
      );

      const allTotalExps = bcoExps
        ?.filter((exp) => !excludes.includes(exp?.status))
        .map((exp) => parseFloat(exp?.amount))
        .reduce((sum, curr) => sum + curr, 0);

      const deptTotalApproved = bcoSubs
        .map((sub) => parseFloat(sub?.approved_amount))
        .reduce((sum, curr) => sum + curr, 0);

      const deptBookedBalance = bcoSubs
        .map((sub) => parseFloat(sub?.booked_balance))
        .reduce((sum, curr) => sum + curr, 0);

      const deptBookedExpenditures = bcoExpsBooked
        .map((sub) => parseFloat(sub?.amount))
        .reduce((sum, curr) => sum + curr, 0);

      setState({
        ...state,
        totalBookedExpenditure: allTotalExps,
        approvedAmount: deptTotalApproved,
        bookedExpenditure: deptBookedExpenditures,
        bookedBalance: deptBookedBalance,
        totalReversed: bcoReversedExps,
        expectedPerformance: (deptBookedExpenditures / deptTotalApproved) * 100,
        paymentForms: bcoExps,
      });
    }
  }, [expenditures, subBudgetHeads]);

  useEffect(() => {
    if (roles?.length > 0 && adminRoles.some((rle) => roles.includes(rle))) {
      try {
        const exps = collection("expenditures");
        const subs = collection("subBudgetHeads");
        const dmds = collection("demands");
        const refs = collection("refunds");

        batchRequests([exps, subs, dmds, refs])
          .then(
            axios.spread((...res) => {
              const subHeads = res[1].data.data;
              const notReversedOrRefunded = res[0].data.data;
              setExpenditures(notReversedOrRefunded);
              setSubBudgetHeads(subHeads?.filter((sub) => sub?.fund));
              setRefunds(res[3].data.data);
              setReversals(res[2].data.data);
            })
          )
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [roles]);

  // console.log(refunds);

  return (
    <>
      <div className="dashboard__cards">
        <div className="row">
          <div className="col-md-9">
            <div className="insights">
              <div className="insights__top__card mb-4">
                <div className="row">
                  <div className="col-md-7">
                    <div className="credit__card">
                      <div className="insight__logo">
                        <img src={logo} alt="NCDMB Logo" />
                      </div>
                      <div className="title__top">
                        <h3>{auth?.department_name}</h3>
                      </div>
                      <div className="chip mt-3">
                        <img src={chip} alt="Credit Card Chip" />
                      </div>
                      <div className="clearfix"></div>
                      <div className="footer__section__card mt-4">
                        <p>Approved Amount</p>
                        <h2>&#8358; {currency(state.approvedAmount, true)}</h2>
                        <p className="below__text mt-3">Budget Year: 2022</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="summary__card">
                      <p>Booked Expenditure</p>
                      <h1>&#8358; {currency(state.bookedExpenditure, true)}</h1>
                      <p>Booked Balance</p>
                      <h1>&#8358; {currency(state.bookedBalance, true)}</h1>
                      <p>Expected Performance</p>
                      <h1>{`${state.expectedPerformance?.toFixed(2)}%`}</h1>

                      <button
                        type="button"
                        className="exp___bttn summary__btn mt-4"
                        onClick={() => handleBreakdown()}
                      >
                        View Breakdown
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="insights__section">
                <div className="row">
                  <DashboardCards items={state} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="notification__cards">
              <div className="reversal__requests mb-4">
                <h3>- Pending Reversal Requests</h3>
                {reversals
                  ?.filter((rev) => rev?.status === "pending")
                  ?.map((rev, i) => (
                    <div className="request__cards" key={i}>
                      <small>{rev?.batch_no}</small>
                      <h3>&#8358; {currency(rev?.amount, true)}</h3>
                      <p>{rev?.description}</p>
                      <small>{`Raised At: ${rev?.created_at}`}</small>
                    </div>
                  ))}
              </div>
              <div className="logistics__refunds">
                <h3>- Pending Logistics Refunds</h3>
                {refunds
                  ?.filter(
                    (ref) =>
                      ref?.status === "approved" &&
                      ref?.department_id == auth?.department_id
                  )
                  ?.map((ref, i) => (
                    <div className="request__cards funds__card__green" key={i}>
                      <p>{ref?.beneficiary}</p>
                      <small>{ref?.batch}</small>
                      <h3>&#8358; {currency(ref?.amount, true)}</h3>
                      <p>{ref?.description}</p>
                      <small>{`Raised At: ${ref?.created_at}`}</small>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
