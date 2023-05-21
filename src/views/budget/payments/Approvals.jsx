/* eslint-disable eqeqeq */
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { alter, fetch } from "../../../controllers";
import { approvalStages, currency } from "../../../services/helpers";
import Alert from "../../../services/utils/alert";
import { Button, TextInput } from "../../../template/components/forms/Inputs";

import QueryExpenditure from "../../modals/QueryExpenditure";

const Approvals = () => {
  const initialState = {
    batch_no: "",
    amount: 0,
    beneficiary: "",
    totalAmount: 0,
    purpose: "",
    expenditure_id: 0,
  };

  const stageState = {
    name: "",
    canEdit: false,
    role: "",
    canQuery: "",
    next: "",
    action: "",
    level: 0,
  };

  const [state, setState] = useState(initialState);
  const [stage, setStage] = useState(stageState);
  const [batch, setBatch] = useState(null);
  const [expenditures, setExpenditures] = useState([]);
  const [expenditure, setExpenditure] = useState(undefined);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { auth } = useStateContext();

  const updateExpenditure = (exp) => {
    setState({
      ...state,
      expenditure_id: exp?.id,
      beneficiary: exp?.beneficiary,
      purpose: exp?.description,
      amount: parseFloat(exp?.amount),
    });
  };

  const clearPayment = (exp) => {
    const requests = {
      status: stage?.name === "audit" ? "paid" : "cleared",
      approval_status: "cleared",
      stage: stage?.next,
      level: stage?.level + 1,
    };

    try {
      alter("clear/expenditures", exp?.id, requests)
        .then((res) => {
          const response = res.data;

          updateExpStatus(response);
          setBatch(null);
          setExpenditures([]);
          setExpenditure(undefined);
          Alert.success("Success!!", response.message);
        })
        .catch((err) => {
          const error = err.data.message;
          console.log(err);
          setError(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const alterExpendiiture = (e) => {
    e.preventDefault();

    const requests = {
      amount: state?.amount,
    };

    try {
      alter("expenditures", state.expenditure_id, requests)
        .then((res) => {
          const response = res.data;
          updateExpStatus(response);
          setState({
            ...state,
            expenditure_id: 0,
            beneficiary: "",
            purpose: "",
            amount: 0,
          });
          Alert.success("Success!!", response.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setExpenditure(undefined);
  };

  const queryExpenditure = (exp) => {
    setShow(true);
    setExpenditure(exp);
  };

  const updateExpStatus = (response) => {
    setExpenditures(
      expenditures.map((exp) => {
        if (exp.id == response?.data?.id) {
          return response?.data;
        }

        return exp;
      })
    );
  };

  const getBatch = () => {
    if (state.batch_no !== "") {
      try {
        fetch("collect/batches", state.batch_no)
          .then((res) => {
            const batch = res.data.data;
            setBatch(batch);
            setExpenditures(batch?.expenditures);

            const stg = approvalStages.filter(
              (sta) => sta.name === batch?.stage
            )[0];

            setStage(stg);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if ((auth !== null || auth !== undefined) && Array.isArray(auth?.roles)) {
      const labels = [];
      const { roles } = auth;
      roles?.map((rle) => labels.push(rle?.label));
      setRoles(labels);
    }
  }, [auth]);

  // console.log(expenditures, stage, roles);

  console.log(batch);

  return (
    <>
      <QueryExpenditure
        title="Query Expenditure"
        show={show}
        handleClose={handleClose}
        handleSubmit={updateExpStatus}
        data={expenditure}
      />
      <div className="custom__card mb-3">
        <div className="row">
          <div className="col-md-4">
            <TextInput
              label="Batch No.:"
              value={state.batch_no}
              onChange={(e) => setState({ ...state, batch_no: e.target.value })}
              placeholder="Enter Batch No."
            />
            <button
              type="button"
              className="btn btn-sm btn-success"
              disabled={state.batch_no === ""}
              onClick={() => getBatch()}
            >
              Fetch Batch
            </button>
          </div>
          <div className="col-md-8">
            <div className="batch__details">
              <small>{batch?.level?.toUpperCase()}</small>
              <h2>{batch?.code}</h2>
              <p>
                {batch !== null &&
                  `Raised from the ${batch?.sub_budget_head_code} Budget Head`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-5">
          <div className="custom__card">
            <form onSubmit={alterExpendiiture}>
              <div className="row">
                <div className="col-md-12">
                  <TextInput
                    label="Beneficiary"
                    value={state.beneficiary}
                    onChange={(e) =>
                      setState({ ...state, beneficiary: e.target.value })
                    }
                    placeholder="Beneficiary Name"
                    disabled
                  />
                </div>
                <div className="col-md-12">
                  <TextInput
                    label="Purpose"
                    value={state.purpose}
                    onChange={(e) =>
                      setState({ ...state, purpose: e.target.value })
                    }
                    multiline={3}
                    placeholder="Purpose of Expenditure"
                    disabled
                  />
                </div>
                <div className="col-md-12">
                  <TextInput
                    label="Amount"
                    value={state.amount}
                    onChange={(e) =>
                      setState({
                        ...state,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    placeholder="Enter Amount"
                    disabled={
                      batch === null ||
                      expenditures?.length == 0 ||
                      !stage?.canEdit
                    }
                  />
                </div>
                <div className="col-md-12">
                  <Button
                    type="submit"
                    text="Update Expenditure"
                    icon="update"
                    disabled={
                      batch === null ||
                      expenditures?.length == 0 ||
                      !stage?.canEdit
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          {error !== "" && (
            <>
              <div className="alert alert-danger mb-2">{error}</div>
            </>
          )}
          {expenditures?.length > 0 ? (
            expenditures?.map((exp, i) => (
              <div className="expenditures__card mb-3" key={i}>
                <div className="row">
                  <div className="col-md-9">
                    <div className="exp__content">
                      <small className="text-muted">
                        {moment(exp?.created_at).format("LL")}
                      </small>
                      <h2>{exp?.beneficiary}</h2>
                      <p>{exp?.description}</p>
                      <p className="text-muted">
                        <b>{currency(exp?.amount)}</b>
                      </p>
                    </div>
                    <div className="action__area">
                      <div className="row">
                        <div className="col-md-6">
                          <button
                            type="button"
                            className="custom-btn custom-btn__default mt-3"
                            disabled={
                              state.expenditure_id > 0 ||
                              exp?.approval_status === "queried" ||
                              !roles?.includes(stage?.role) ||
                              stage?.name !== exp?.stage ||
                              exp?.status === "paid"
                            }
                            onClick={() => clearPayment(exp)}
                          >
                            {exp?.status === "paid"
                              ? "Payment Posted!!"
                              : "Clear Payment"}
                          </button>
                        </div>
                        <div className="col-md-6">
                          <button
                            type="button"
                            className="custom-btn custom-btn__danger mt-3"
                            onClick={() => queryExpenditure(exp)}
                            disabled={
                              state.expenditure_id > 0 ||
                              exp?.approval_status === "pending" ||
                              !stage?.canQuery ||
                              stage?.name !== exp?.stage
                            }
                          >
                            Query
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="exp__bttn-container">
                      <button
                        type="button"
                        className="exp__bttn"
                        onClick={() => updateExpenditure(exp)}
                        disabled={state.expenditure_id > 0 || !stage?.canEdit}
                      >
                        <span className="material-icons-sharp">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger">
              There are no expenditures loaded yet!!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Approvals;
