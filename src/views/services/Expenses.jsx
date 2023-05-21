/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { batchRequests, collection, store } from "../../controllers";
import { currency } from "../../services/helpers";
import Alert from "../../services/utils/alert";
import EmptyData from "../../template/components/data/EmptyData";

import AddExpense from "../modals/AddExpense";

const Expenses = () => {
  const { state } = useLocation();
  const [claim, setClaim] = useState(null);
  const [remunerations, setRemunerations] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState(0);

  const navigate = useNavigate();

  const { auth } = useStateContext();

  const manageExpense = (exp) => {
    setData(exp);
    setIsUpdating(true);
    setShow(true);
  };

  const removeExpense = (expId) => {
    setExpenses(expenses.filter((exp) => exp?.id != expId));
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setExpenses(
        expenses.map((exp) => {
          if (exp.id == response?.id) {
            return {
              ...response?.data,
              id: response?.id,
            };
          }

          return exp;
        })
      );
    } else {
      const nep = {
        ...response?.data,
        id: response?.id,
      };
      setExpenses([nep, ...expenses]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const submitWithStatus = (stat) => {
    registerClaim(stat);
  };

  const registerClaim = (status) => {
    const data = {
      claim_id: claim?.id,
      expenses,
      status,
    };

    try {
      store("expenses", data)
        .then((res) => {
          const response = res.data;
          Alert.success("Registered", response.message);
          navigate("/services/claims", {
            state: {
              claim: response.data,
            },
          });
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  useEffect(() => {
    if (state && state?.claim) {
      const { claim } = state;
      setClaim(claim);
      setExpenses(claim?.expenses);
    }
  }, [state]);

  useEffect(() => {
    if (claim !== null && claim?.status !== "registered") {
      try {
        const remunerationsData = collection("remunerations");
        const settlementsData = collection("settlements");

        batchRequests([remunerationsData, settlementsData])
          .then(
            axios.spread((...res) => {
              const resData = res[0].data.data;
              const settleData = res[1].data.data;

              setRemunerations(
                resData?.filter((rem) => rem?.category === "claims")
              );

              setSettlements(
                settleData?.filter(
                  (sett) => sett?.grade_level_name === auth?.gradeLevel
                )
              );
            })
          )
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [claim]);

  useEffect(() => {
    if (expenses?.length > 0) {
      setTotal(
        expenses
          .map((exp) => parseFloat(exp.amount))
          .reduce((sum, curr) => sum + curr, 0)
      );
    } else {
      setTotal(0);
    }
  }, [expenses]);

  useEffect(() => {
    if (total > 0) {
      setBalance(parseFloat(claim?.total_amount) - total);
    }
  }, [total]);

  // console.log(claim);

  return (
    <>
      <AddExpense
        title="Add Expense"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ remunerations, settlements }}
        data={data}
      />
      <div className="row">
        <div className="col-md-8">
          <div className="title">
            <div className="top-badge">
              <span>{claim?.status}</span>
            </div>
            <h2 className="expense-purpose">{claim?.title?.toUpperCase()}</h2>
          </div>
          <div className="btn-cl mt-3">
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShow(true)}
                disabled={claim?.status !== "pending"}
              >
                <span className="material-icons-sharp">note_add</span>
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() =>
                  navigate("/services/claims/print", {
                    state: {
                      claim,
                    },
                  })
                }
              >
                <span className="material-icons-sharp">print</span>
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="total-amount">
            <p>Spent Amount</p>
            <h2>{currency(total)}</h2>
          </div>
        </div>

        <div className="col-md-12 mt-4">
          {expenses?.length > 0 ? (
            <table className="table custom__expense__table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, i) => (
                  <tr key={i}>
                    <td>{`${moment(expense?.from).format("ll")} - ${moment(
                      expense?.to
                    ).format("ll")}`}</td>
                    <td>{expense?.description}</td>
                    <td>{currency(expense?.amount)}</td>
                    <td>
                      <div className="btn-group custom__expense-btn-group">
                        <button
                          type="button"
                          className="custom__expense-btn custom__expense-primary"
                          disabled={
                            claim?.status !== "pending" ||
                            claim?.status !== "unregistered"
                          }
                          onClick={() => manageExpense(expense)}
                        >
                          <span className="material-icons-sharp">
                            edit_note
                          </span>
                        </button>
                        <button
                          type="button"
                          className="custom__expense-btn custom__expense-danger"
                          disabled={claim?.status !== "pending"}
                          onClick={() => removeExpense(expense?.id)}
                        >
                          <span className="material-icons-sharp">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyData text="No Expense has been added yet..." />
          )}
        </div>
      </div>
      <div className="footer-area mt-4">
        <div className="row">
          <div className="col-md-4">
            <p>Manage</p>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => submitWithStatus("unregistered")}
                disabled={
                  expenses?.length < 1 ||
                  claim?.status !== "pending" ||
                  claim?.status !== "unregistered"
                }
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => submitWithStatus("registered")}
                disabled={expenses?.length < 1 || claim?.status !== "pending"}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => navigate("/services/claims")}
              >
                {`${
                  claim?.status !== "pending" ||
                  claim?.status !== "unregistered"
                    ? "Close"
                    : "Cancel"
                }`}
              </button>
            </div>
          </div>
          {claim?.type === "touring-adavnce" && (
            <>
              <div className="col-md-4">
                <p>Balance</p>
                <h2>{currency(balance)}</h2>
              </div>
              <div className="col-md-4">
                <p>Approved Amount</p>
                <h2>{currency(claim?.total_amount)}</h2>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Expenses;
