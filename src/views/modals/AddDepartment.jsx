/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import { departmentTypes } from "../../services/helpers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddDepartment = ({
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
    payment_code: "",
    parentId: 0,
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      code: state.code,
      payment_code: state.payment_code,
      parentId: state.parentId,
      type: state.type,
    };

    // console.log(requests);

    try {
      setLoading(true);
      if (isUpdating) {
        alter("departments", state.id, requests)
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
        store("departments", requests)
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

  // console.log(state.id);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        name: data?.name,
        code: data?.code,
        payment_code: data?.payment_code ?? "",
        parentId: data?.parentId,
        type: data?.type,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Department Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions
                  value=""
                  label="Select Department Type"
                  disabled
                />

                {departmentTypes.map((typ, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={typ.key}
                    label={typ.value}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <CustomSelect
                label="Parent"
                value={state.parentId}
                onChange={(e) =>
                  setState({ ...state, parentId: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Department Parent"
                  disabled
                />

                <CustomSelectOptions value={0} label="None" />

                {dependencies?.departments?.map((dept, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={dept.id}
                    label={dept.code}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Name"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="Enter Department name"
              />
            </div>

            <div className="col-md-6">
              <TextInput
                label="Code"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="Enter Code"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Payment Code"
                value={state.payment_code}
                onChange={(e) =>
                  setState({ ...state, payment_code: e.target.value })
                }
                placeholder="Enter Payment Code"
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Department`}
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

export default AddDepartment;
