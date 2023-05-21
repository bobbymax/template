/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import {
  CustomSelect,
  CustomSelectOptions,
  Button,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddRole = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    name: "",
    slots: 0,
    type: "",
    no_expiration: 0,
    isSuper: 0,
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
      name: state.name,
      slots: state.slots,
      type: state.type,
      no_expiration: state.no_expiration,
      isSuper: state.isSuper,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("roles", state.id, requests)
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
        store("roles", requests)
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
        name: data?.name,
        slots: parseInt(data?.slots),
        type: data?.type,
        no_expiration: data?.no_expiration,
        isSuper: data?.isSuper,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-4">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions value="" label="Select Type" disabled />

                {[
                  { label: "Roles", value: "roles" },
                  { label: "Groups", value: "groups" },
                ].map((typ, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={typ.value}
                    label={typ.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-8">
              <TextInput
                label="Name"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="Enter Name"
              />
            </div>

            <div className="col-md-4">
              <TextInput
                label="Slots"
                type="number"
                value={state.slots}
                onChange={(e) =>
                  setState({ ...state, slots: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Can Expire"
                value={state.no_expiration}
                onChange={(e) =>
                  setState({ ...state, no_expiration: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Can Role Expire"
                  disabled
                />

                {[
                  { label: "Yes", value: 1 },
                  { label: "No", value: 0 },
                ].map((exp, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={exp.value}
                    label={exp.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Admin Role?"
                value={state.isSuper}
                onChange={(e) =>
                  setState({ ...state, isSuper: e.target.value })
                }
              >
                <CustomSelectOptions value="" label="Admin Role?" disabled />

                {[
                  { label: "Yes", value: 1 },
                  { label: "No", value: 0 },
                ].map((admin, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={admin.value}
                    label={admin.label}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Role`}
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

export default AddRole;
