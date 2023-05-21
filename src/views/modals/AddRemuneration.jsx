/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import {
  remunerationCategories,
  remunerationTypes,
} from "../../services/helpers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddRemuneration = ({
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
    parentId: 0,
    type: "",
    category: "",
    no_of_days: 0,
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      parentId: state.parentId,
      type: state.type,
      category: state.category,
      no_of_days: state.no_of_days,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("remunerations", state.id, requests)
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
        store("remunerations", requests)
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
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        name: data?.name,
        parentId: data?.parentId,
        type: data?.type,
        category: data?.category,
        no_of_days: data?.no_of_days,
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
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions value="" label="Select Type" disabled />

                {remunerationTypes.map((typ, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={typ.key}
                    label={typ.value}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Name"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="Enter Name"
              />
            </div>

            <div className="col-md-12">
              <CustomSelect
                label="Parent"
                value={state.parentId}
                onChange={(e) =>
                  setState({ ...state, parentId: e.target.value })
                }
              >
                <CustomSelectOptions value="" label="Select Parent" disabled />

                <CustomSelectOptions value={0} label="None" />

                {dependencies?.remunerations?.map((remu, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={remu.id}
                    label={remu.name}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Category"
                value={state.category}
                onChange={(e) =>
                  setState({ ...state, category: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Category"
                  disabled
                />

                {remunerationCategories.map((cat, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={cat.key}
                    label={cat.value}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="No. of Days Required"
                value={state.no_of_days}
                onChange={(e) =>
                  setState({ ...state, no_of_days: e.target.value })
                }
              >
                <CustomSelectOptions value="" label="Select Action" disabled />

                {[
                  { key: 0, value: "No" },
                  { key: 1, value: "Yes" },
                ].map((cat, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={cat.key}
                    label={cat.value}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Remuneration`}
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

export default AddRemuneration;
