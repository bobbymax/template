/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { alter, fetch, store } from "../../controllers";
import Alert from "../../services/utils/alert";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddExpenditure = ({
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
    sub_budget_head_id: 0,
    claim_id: 0,
    beneficiary: "",
    description: "",
    additional_info: "",
    budget_code: "",
    code: "",
    amount: 0,
    booked_balance: 0,
    new_balance: 0,
    type: "",
    payment_type: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { auth } = useStateContext();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      department_id: auth?.department_id,
      sub_budget_head_id: state.sub_budget_head_id,
      claim_id: state.claim_id,
      beneficiary: state.beneficiary,
      description: state.description,
      additional_info: state.additional_info,
      amount: state.amount,
      type: state.type,
      payment_type: state.payment_type,
      status: "cleared",
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("expenditures", state.id, requests)
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
        store("expenditures", requests)
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
    }
  };

  const handleModalClose = () => {
    setState(initialState);
    handleClose();
  };

  useEffect(() => {
    if (state.code !== "" && state.code?.length >= 6) {
      try {
        fetch("fetch/claims", state.code)
          .then((res) => {
            const response = res.data.data;

            if (response?.status === "cleared") {
              Alert.warning(
                "Warning!!",
                "An Expenditure for this claim has already been raised!!"
              );
              setState({
                ...state,
                code: "",
              });
            } else {
              setState({
                ...state,
                claim_id: response?.id,
                amount: parseFloat(response?.total_amount),
                beneficiary: response?.owner?.name,
                description: response?.title,
              });
            }
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [state.code]);

  useEffect(() => {
    if (state.sub_budget_head_id > 0) {
      const sub = dependencies?.subBudgetHeads?.filter(
        (head) => head.id == state.sub_budget_head_id
      )[0];

      setState({
        ...state,
        budget_code: sub?.code,
        booked_balance: parseFloat(sub?.booked_balance),
      });
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (state.booked_balance > 0 && state.amount > 0) {
      const newBalance = state.booked_balance - state.amount;
      let value = 0;

      if (newBalance < 1) {
        value = 0;
      } else {
        value = newBalance;
      }

      setState({
        ...state,
        new_balance: value,
      });
    }
  }, [state.booked_balance, state.amount]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        user_id: data?.id,
        department_id: data?.department_id,
        sub_budget_head_id: data?.sub_budget_head_id,
        beneficiary: data?.beneficiary,
        description: data?.description,
        additional_info: data?.additional_info,
        amount: data?.amount,
        type: data?.type,
        payment_type: data?.payment_type,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-6">
              <CustomSelect
                label="Payment Type"
                value={state.payment_type}
                onChange={(e) =>
                  setState({ ...state, payment_type: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Payment Type"
                  disabled
                />

                {[
                  { value: "staff-payment", label: "Staff" },
                  { value: "third-party", label: "Third Party" },
                ].map((modTyp, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={modTyp.value}
                    label={modTyp.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
                disabled={state.payment_type === "third-party"}
              >
                <CustomSelectOptions
                  value=""
                  label="Select Expenditure Type"
                  disabled
                />

                {[
                  { value: "claim", label: "Claim" },
                  { value: "touring-advance", label: "Touring Advance" },
                  { value: "other", label: "Other" },
                ].map((modTyp, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={modTyp.value}
                    label={modTyp.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <TextInput
                label="Code"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="Enter Code"
                disabled={state.payment_type === "third-party"}
              />
            </div>
            <div className="col-md-8">
              <CustomSelect
                label="Sub-Budget Head"
                value={state.sub_budget_head_id}
                onChange={(e) =>
                  setState({ ...state, sub_budget_head_id: e.target.value })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Sub-Budget Head"
                  disabled
                />

                {dependencies.subBudgetHeads.map((sub, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={sub.id}
                    label={sub.name}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <TextInput
                label="Budget Code"
                value={state.budget_code}
                onChange={(e) =>
                  setState({ ...state, budget_code: e.target.value })
                }
                placeholder="Budget Code"
                disabled
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Booked Balance"
                value={state.booked_balance}
                onChange={(e) =>
                  setState({ ...state, booked_balance: e.target.value })
                }
                disabled
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Amount"
                type="number"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
                disabled={
                  state.type === "claim" || state.type === "touring-advance"
                }
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="New Balance"
                value={state.new_balance}
                onChange={(e) =>
                  setState({ ...state, new_balance: e.target.value })
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
                placeholder="Enter Beneficiary"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                placeholder="Enter Description"
                multiline={3}
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Additional Info"
                value={state.additional_info}
                onChange={(e) =>
                  setState({ ...state, additional_info: e.target.value })
                }
                placeholder="Enter Additional Info"
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Module`}
                isLoading={loading}
                icon="add_circle"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddExpenditure;
