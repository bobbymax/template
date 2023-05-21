/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { formatSelectOptions } from "../../services/helpers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { alter } from "../../controllers";
import Modal from "../../template/components/modals/Modal";
import { Button } from "../../template/components/forms/Inputs";

const TrackingDocument = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
}) => {
  const initialState = {
    user_id: 0,
    entry_id: 0,
    track_id: 0,
    stage_id: 0,
    type: "",
  };

  const animated = makeAnimated();

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [depts, setDepts] = useState([]);
  const [dept, setDept] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      user_id: state.user_id,
      department_id: dept?.value,
      entry_id: state.entry_id,
      stage_id: state.stage_id,
      type: state.type === "inflow" ? "outflow" : "inflow",
    };

    // console.log(requests);

    try {
      setLoading(true);
      alter("tracks", state.track_id, requests)
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setState(initialState);
    setDept(null);
    handleClose();
  };

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.departments &&
      dependencies?.nextStage &&
      dependencies?.track &&
      dependencies?.auth &&
      dependencies?.entry
    ) {
      const { departments, nextStage, track, auth, entry } = dependencies;

      setDepts(formatSelectOptions(departments, "id", "code"));
      setState({
        ...state,
        track_id: track?.id,
        user_id: auth?.id,
        stage_id: nextStage?.id,
        entry_id: entry?.id,
        type: track?.state,
      });
    }
  }, [dependencies]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="col-md-12 mb-4">
          <p className="label-font">Departments</p>
          <Select
            closeMenuOnSelect={false}
            components={animated}
            options={depts}
            placeholder="Select Department"
            value={dept}
            onChange={setDept}
            isSearchable
          />
        </div>
        <div className="col-md-12">
          <Button
            type="submit"
            text={`${state.type === "inflow" ? "Send" : "Receive"}`}
            isLoading={loading}
            icon="add_circle"
          />
        </div>
      </form>
    </Modal>
  );
};

export default TrackingDocument;
