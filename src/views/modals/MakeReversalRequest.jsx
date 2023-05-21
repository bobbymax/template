/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import Alert from "../../services/utils/alert";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const MakeReversalRequest = ({
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
    batch_id: 0,
    user_id: 0,
    department_id: 0,
    description: "",
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
      batch_id: state.batch_id,
      user_id: state.user_id,
      department_id: state.department_id,
      description: state.description,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("demands", state.id, requests)
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
            Alert.error("Oops!!", err.response.data.message);
            setLoading(false);
          });
      } else {
        store("demands", requests)
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
            Alert.error("Oops!!", err.response.data.message);
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.auth &&
      dependencies?.batch
    ) {
      const { auth, batch } = dependencies;

      setState({
        ...state,
        batch_id: batch?.id,
        user_id: auth?.id,
        department_id: auth?.department_id,
      });
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        batch_id: data?.batch_id,
        user_id: data?.user_id,
        department_id: data?.department_id,
        description: data?.description,
      });
    }
  }, [data]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            <TextInput
              label="Reason"
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              multiline={3}
              placeholder="Enter Reason Here"
            />
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Reversal Request`}
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default MakeReversalRequest;
