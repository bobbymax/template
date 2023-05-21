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

const AddSubBudgetHead = ({
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
    name: "",
    code: "",
    budget_head_id: 0,
    department_id: 0,
    logistics: 0,
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      code: state.code,
      budget_head_id: state.budget_head_id,
      department_id: state.department_id,
      logistics: state.logistics,
      type: state.type,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("subBudgetHeads", state.id, requests)
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
            setLoading(false);
            console.log(err.message);
          });
      } else {
        store("subBudgetHeads", requests)
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
            setLoading(false);
            console.log(err.message);
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
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        name: data?.name,
        code: data?.code,
        budget_head_id: data?.budget_head_id,
        department_id: data?.department_id,
        logistics: data?.logistics,
        type: data?.type,
      });
    }
  }, [data]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            <CustomSelect
              label="Budget Head"
              value={state.budget_head_id}
              onChange={(e) =>
                setState({ ...state, budget_head_id: e.target.value })
              }
            >
              <CustomSelectOptions
                value={0}
                label="Select Budget Head"
                disabled
              />

              {dependencies?.budgetHeads.map((head) => (
                <CustomSelectOptions
                  key={head.id}
                  value={head.id}
                  label={head.name}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-12">
            <CustomSelect
              label="Budget Owner"
              value={state.department_id}
              onChange={(e) =>
                setState({ ...state, department_id: e.target.value })
              }
            >
              <CustomSelectOptions
                value={0}
                label="Select Budget Owner"
                disabled
              />

              {dependencies?.departments.map((dept) => (
                <CustomSelectOptions
                  key={dept.id}
                  value={dept.id}
                  label={dept.code}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-12">
            <TextInput
              label="Sub-Budget Name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="Enter Sub-Budget Name"
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Budget Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              placeholder="Enter Budget Code"
            />
          </div>
          <div className="col-md-12">
            <CustomSelect
              label="Sub-Budget Type"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
            >
              <CustomSelectOptions value="" label="Select Budget Type" />

              {[
                { value: "capital", label: "Capital" },
                { value: "recurrent", label: "Recurrent" },
                { value: "personnel", label: "Personnel" },
              ].map((modTyp, i) => (
                <CustomSelectOptions
                  key={i}
                  value={modTyp.value}
                  label={modTyp.label}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-12">
            <CustomSelect
              label="Logistics Budget"
              value={state.logistics}
              onChange={(e) =>
                setState({ ...state, logistics: e.target.value })
              }
            >
              <CustomSelectOptions value="" label="Logistics Budget" disabled />

              {[
                { value: 0, label: "No" },
                { value: 1, label: "Yes" },
              ].map((logis, i) => (
                <CustomSelectOptions
                  key={i}
                  value={logis.value}
                  label={logis.label}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Sub-Budget Head`}
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddSubBudgetHead;
