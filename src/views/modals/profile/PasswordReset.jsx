/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter } from "../../../controllers";
import {
  Button,
  TextInput,
  Boxes,
} from "../../../template/components/forms/Inputs";
import Modal from "../../../template/components/modals/Modal";

const PasswordReset = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    password: "",
    shouldReset: false,
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setState(initialState);
    setLoading(false);
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const request = {
      password: state.password,
      shouldReset: state.shouldReset ? "yes" : "no",
    };

    // console.log(state?.id, request);

    try {
      alter("reset/password", state?.id, request)
        .then((res) => {
          const response = res.data;
          handleSubmit({
            status: "Updated!!",
            data: response.data,
            message: response.message,
            action: "alter",
          });
          handleModalClose();
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
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
                label="New Password"
                value={state.password}
                type="password"
                onChange={(e) =>
                  setState({ ...state, password: e.target.value })
                }
                placeholder="Enter New Password"
              />
            </div>
            <div className="col-md-12">
              <Boxes
                label="Staff should reset password on Login"
                value={state.shouldReset}
                onChange={(e) =>
                  setState({ ...state, shouldReset: e.target.isChecked })
                }
              />
            </div>
            <div className="col-md-12 mt-3">
              <Button
                type="submit"
                text="Reset Password"
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

export default PasswordReset;
