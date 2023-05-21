/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddQualification = ({
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
    type: "",
    min: 0,
    max: 0,
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
      type: state.type,
      min: state.min,
      max: state.max,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("qualifications", state.id, requests)
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
        store("qualifications", requests)
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
        type: data?.type,
        min: data?.min,
        max: data?.max,
      });
    }
  }, [data]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            <TextInput
              label="Type"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
              placeholder="Enter Qualification Type"
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Min"
              type="number"
              value={state.min}
              onChange={(e) => setState({ ...state, min: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Max"
              type="number"
              value={state.max}
              onChange={(e) => setState({ ...state, max: e.target.value })}
            />
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Qualification`}
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddQualification;
