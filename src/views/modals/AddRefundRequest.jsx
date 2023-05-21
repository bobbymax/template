/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddRefundRequest = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    user_id: 0,
    department_id: 0,
    expenditure_id: 0,
    beneficiary: "",
    approved_amount: 0,
    paid: 0,
    prevBal: 0,
    balance: 0,
    amount: 0,
    description: "",
    budget_year: 0,
  };

  const [state, setState] = useState(initialState);
  const [depts, setDepts] = useState([]);
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const animated = makeAnimated();

  const handleModalClose = () => {
    setState(initialState);
    setDept(null);
    setLoading(false);
    setError("");
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      user_id: state.user_id,
      department_id: dept?.value,
      expenditure_id: state.expenditure_id,
      beneficiary: state.beneficiary,
      amount: state.amount,
      description: state.description,
      budget_year: state.budget_year,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("refunds", state.id, requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Updated!!",
              data: response.data,
              message: response.message,
              action: "alter",
            });
            setState(initialState);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } else {
        store("refunds", requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Created!!",
              data: response.data,
              message: response.message,
              action: "store",
            });
            setState(initialState);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        user_id: data?.user_id,
        department_id: data?.department_id,
        expenditure_id: data?.expenditure_id,
        beneficiary: data?.beneficiary,
        amount: parseFloat(data?.requested_amount),
        description: data?.description,
        budget_year: data?.budget_year,
      });

      setDept(depts?.filter((dpt) => dpt?.value == data?.department_id)[0]);
    }
  }, [data]);

  useEffect(() => {
    if (state.amount > 0) {
      const newBal = state.prevBal - state.amount;

      if (newBal < 0) {
        setError("The balance cannot be less than 0 naira");
        setState({
          ...state,
          balance: state.prevBal,
          amount: 0,
        });
      } else {
        setState({
          ...state,
          balance: newBal,
        });
        setError("");
      }
    }
  }, [state.amount]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.auth !== null &&
      dependencies?.departments?.length > 0 &&
      dependencies?.exp !== null
    ) {
      const { auth, departments, exp } = dependencies;

      const balance = parseFloat(exp?.amount) - parseFloat(exp?.paid);
      setState({
        ...state,
        user_id: auth?.id,
        expenditure_id: exp?.id,
        approved_amount: parseFloat(exp?.amount),
        paid: parseFloat(exp?.paid),
        prevBal: balance,
        balance,
        beneficiary: exp?.beneficiary,
        description: `REFUND FOR ${exp?.description}`,
        budget_year: 2022,
      });

      setDepts(departments);
    }
  }, [dependencies]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            {error !== "" && (
              <div className="col-md-12">
                <div className="alert alert-danger">{error}</div>
              </div>
            )}
            <div className="col-md-12 mb-4">
              <p className="label-font">Department</p>
              <Select
                closeMenuOnSelect={false}
                components={animated}
                options={depts}
                placeholder="Select Department"
                value={dept}
                onChange={setDept}
                isSearchable
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Approved Amount"
                value={state.approved_amount}
                onChange={(e) =>
                  setState({
                    ...state,
                    approved_amount: parseFloat(e.target.value),
                  })
                }
                disabled
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Amount"
                value={state.amount}
                onChange={(e) =>
                  setState({ ...state, amount: parseFloat(e.target.value) })
                }
                placeholder="Enter Payable Amount"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Balance"
                value={state.balance}
                onChange={(e) =>
                  setState({ ...state, balance: parseFloat(e.target.value) })
                }
                disabled
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Beneficiary"
                value={state.beneficiary}
                onChange={(e) =>
                  setState({ ...state, beneficiary: e.target.value })
                }
                placeholder="Enter Beneficiary here"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                placeholder="Enter Description Here"
                multiline={4}
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Refund Request`}
                isLoading={loading}
                icon="add_circle"
                disabled={dept === null || state.amount < 0}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddRefundRequest;
