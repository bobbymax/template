/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddTraining = ({
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
    title: "",
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
      title: state.title,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("trainings", state.id, requests)
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
        store("trainings", requests)
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
        title: data?.title,
      });
    }
  }, [data]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            <TextInput
              label="Title"
              value={state.title}
              onChange={(e) => setState({ ...state, title: e.target.value })}
              placeholder="Enter Training Title"
            />
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Training`}
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTraining;
