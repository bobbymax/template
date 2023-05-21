/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddFund = ({
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
    sub_budget_head_id: 0,
    approved_amount: 0,
    year: 0,
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setState(initialState);
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      sub_budget_head_id: state.sub_budget_head_id,
      approved_amount: state.approved_amount,
      year: state.year,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("funds", state.id, requests)
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
        store("funds", requests)
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
        sub_budget_head_id: data?.sub_budget_head_id,
        approved_amount: parseFloat(data?.approved_amount),
        year: data?.year,
      });
    }
  }, [data]);
  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
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

              {dependencies?.subBudgetHeads.map((sub) => (
                <CustomSelectOptions
                  key={sub.id}
                  value={sub.id}
                  label={sub.name}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-12">
            <TextInput
              label="Approved Amount"
              type="number"
              value={state.approved_amount}
              onChange={(e) =>
                setState({
                  ...state,
                  approved_amount: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Budget Year"
              type="number"
              value={state.year}
              onChange={(e) =>
                setState({ ...state, year: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Fund for Sub-Budget Head`}
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddFund;
