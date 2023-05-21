/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { alter, store } from "../../controllers";
import { unique } from "../../services/helpers";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddClaim = ({
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
    start: "",
    end: "",
    type: "staff-claim",
    total_amount: 0,
    status: "pending",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { auth } = useStateContext();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      user_id: auth?.id,
      title: state.title,
      start: state.start,
      end: state.end,
      type: state.type,
      total_amount: state.total_amount,
      status: state.status,
      reference_no: "SC" + unique(),
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("claims", state.id, requests)
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
        store("claims", requests)
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
        reference_no: data?.reference_no,
        total_amount: data?.total_amount,
        title: data?.title,
        start: data?.start,
        end: data?.end,
        type: data?.type,
        status: data?.status,
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
                label="Purpose"
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
                placeholder="Enter Claim Purpose"
                multiline={3}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Start"
                type="date"
                value={state.start}
                onChange={(e) => setState({ ...state, start: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="End"
                type="date"
                value={state.end}
                onChange={(e) => setState({ ...state, end: e.target.value })}
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Claim`}
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

export default AddClaim;
