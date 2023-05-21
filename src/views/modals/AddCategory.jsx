/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddCategory = ({
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
    description: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      parentId: state.parentId,
      description: state.description,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("categories", state.id, requests)
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
        store("categories", requests)
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
      });
    }
  }, [data]);
  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
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
                  setState({ ...state, parentId: parseInt(e.target.value) })
                }
              >
                <CustomSelectOptions value="" label="Select Parent" disabled />
                <CustomSelectOptions value={0} label="None" />

                {dependencies?.categories
                  ?.filter((cat) => cat?.parentId == 0)
                  ?.map((cat, i) => (
                    <CustomSelectOptions
                      key={i}
                      value={cat.id}
                      label={cat.name}
                    />
                  ))}
              </CustomSelect>
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
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Category`}
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

export default AddCategory;
