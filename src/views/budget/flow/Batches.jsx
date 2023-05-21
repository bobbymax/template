/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import { collection, store } from "../../../controllers";
import { batchValues } from "../../../services/helpers";
import ExpenseCard from "../../components/ExpenseCard";
import { Button } from "../../../template/components/forms/Inputs";
import Alert from "../../../services/utils/alert";

const Batches = () => {
  const initialState = {
    name: "",
    maxSlot: 0,
    subBudgetCode: "",
    prefix: "",
    justAdded: 0,
    batchCode: "",
    default: false,
    disable: false,
    error: "",
  };

  const [state, setState] = useState(initialState);
  const [batch, setBatch] = useState([]);
  const [total, setTotal] = useState(0);
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("staff-payment");
  const { auth } = useStateContext();
  const navigate = useNavigate();

  const generateBatchNumber = () => {
    const code = state.prefix + Math.floor(Math.random() * 100000);

    setState({
      ...state,
      batchCode: code,
    });
  };

  const addToBatch = (exp) => {
    if (batch.length < 1) {
      setState({
        ...state,
        subBudgetCode: exp?.sub_budget_head_code,
        justAdded: exp?.id,
      });
      setBatch([exp, ...batch]);
    } else if (batch.length < state.maxSlot) {
      if (exp?.sub_budget_head_code === state.subBudgetCode) {
        setBatch([exp, ...batch]);

        setStage({
          ...state,
          justAdded: exp?.id,
        });
      }
    } else {
      setState({
        ...state,
        error: "You can only add expenditures with the same Sub-Budget Head",
      });
    }
  };

  const removeFromBatch = (exp) => {
    setBatch(batch.filter((ex) => ex.id != exp.id));
    setExpenditures([exp, ...expenditures]);
  };

  const handleBatchPayments = () => {
    const data = {
      expenditures: batch,
      sub_budget_head_code: state.subBudgetCode,
      department_id: auth?.department_id,
      amount: parseFloat(total),
      code: state.batchCode,
      no_of_payments: batch?.length,
      stage: "budget-office",
    };

    try {
      store("batches", data)
        .then((res) => {
          const response = res.data;
          setLoading(false);
          Alert.success("Success!!", response.message);
          navigate("/budget/payments", {
            state: {
              batch: response.data,
            },
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.justAdded > 0) {
      setExpenditures(expenditures.filter((exp) => exp?.id != state.justAdded));
    }
  }, [state.justAdded]);

  useEffect(() => {
    setTotal(
      batch
        ?.map((exp) => parseFloat(exp?.amount))
        .reduce((sum, curr) => sum + curr, 0)
    );
    setState({
      ...state,
      disable: batch?.length == state.maxSlot,
    });

    if (batch.length < 1) {
      setState({
        ...state,
        subBudgetCode: "",
        justAdded: 0,
        batchCode: "",
        disable: false,
      });
    }
  }, [batch]);

  useEffect(() => {
    try {
      collection("expenditures")
        .then((res) => {
          const result = res.data.data;

          const departmentsExps = result.filter(
            (exp) =>
              exp?.department_id == auth?.department_id &&
              exp?.status === "cleared"
          );

          setExpenditures(departmentsExps);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, [auth]);

  useEffect(() => {
    const restrictions = batchValues.filter((val) => val.name === stage)[0];

    setState({
      ...state,
      name: restrictions.name,
      maxSlot: restrictions.maxSlot,
      prefix: restrictions.prefix,
    });
  }, [stage]);

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="tab__line">
          <ul className="tab__line-links">
            <li>
              <Link
                to="#"
                className={`${stage === "staff-payment" ? "link__active" : ""}`}
                onClick={() => batch?.length < 1 && setStage("staff-payment")}
              >
                Staff Payments
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className={`${stage === "third-party" ? "link__active" : ""}`}
                onClick={() => batch?.length < 1 && setStage("third-party")}
              >
                Third Party Payments
              </Link>
            </li>
          </ul>
        </div>
        <div className="tab__content">
          {stage === "staff-payment" && (
            <div className="staff-area">
              <div className="row">
                {expenditures
                  .filter((exp) => exp.payment_type === "staff-payment")
                  .map((exp) => (
                    <div className="col-md-6" key={exp.id}>
                      <ExpenseCard
                        expenditure={exp}
                        addToBatch={addToBatch}
                        disabled={state.disable}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
          {stage === "third-party" && (
            <div className="third-party-area">
              <div className="row">
                {expenditures
                  .filter((exp) => exp.payment_type === "third-party")
                  .map((exp) => (
                    <div className="col-md-6" key={exp.id}>
                      <ExpenseCard
                        expenditure={exp}
                        addToBatch={addToBatch}
                        disabled={state.disable}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
          {expenditures.length < 1 && (
            <div className="payment-area mt-4">
              <div className="row">
                <div className="col-md-12">
                  <div className="alert alert-danger">
                    There area no expenditures to batch at this time....
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-md-4">
        <div className="batched-payments">
          <div className="top__header">
            <div className="row">
              <div className="col-md-9">
                <p className="exp-sub__custom text-uppercase">batch code:</p>
                <h3 className="exp-title__custom">
                  {state.batchCode === "" ? "NULL" : state.batchCode}
                </h3>
              </div>
              <div className="col-md-3">
                <button
                  type="button"
                  className="custom__btn-exp"
                  onClick={() => generateBatchNumber()}
                  disabled={state.batchCode !== "" || batch.length < 1}
                >
                  <span className="material-icons-sharp">add_link</span>
                  <span className="material-icons-sharp">
                    library_add_check
                  </span>
                </button>
              </div>
            </div>
          </div>
          {batch?.map((exp, i) => (
            <ExpenseCard
              key={i}
              expenditure={exp}
              removeFromBatch={removeFromBatch}
              batched
            />
          ))}

          <Button
            type="button"
            text={
              batch?.length < 1 || state.batchCode === ""
                ? "Nothing to Batch"
                : "Batch Payments"
            }
            isLoading={loading}
            icon="add"
            disabled={batch?.length < 1 || state.batchCode === ""}
            handleClick={handleBatchPayments}
          />
        </div>
      </div>
    </div>
  );
};

export default Batches;
