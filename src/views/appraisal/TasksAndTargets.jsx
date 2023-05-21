/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import AddMilestone from "../modals/AddMilestone";
import Alert from "../../services/utils/alert";
import moment from "moment";
import { store } from "../../controllers";
import { useNavigate } from "react-router-dom";

const TasksAndTargets = () => {
  const initialState = {
    id: 0,
    user_id: 0,
    result: "",
    remark: "",
    commitment_id: 0,
    objectives: "",
    measure: "",
    weight: 0,
    target: 0,
    milestones: [],
  };

  let editorState = EditorState.createEmpty();
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [objectives, setObjectives] = useState(editorState);
  const [measures, setMeasures] = useState(editorState);
  const [targets, setTargets] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const onEditorStateChange = (editorState) => {
    setObjectives(editorState);
  };

  const onEditorMeasureStateChange = (editorState) => {
    setMeasures(editorState);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setState({
        ...state,
        milestones: state.milestones?.map((mile) => {
          if (mile?.id == response?.data?.id) {
            return response?.data;
          }

          return mile;
        }),
      });
    } else {
      setState({
        ...state,
        milestones: [response?.data, ...state.milestones],
      });
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleAddTargets = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      objectives: state.objectives.value,
      weight: state.weight,
      target: state.target,
      measure: state.measure.value,
      milestones: state.milestones,
    };

    setTargets([data, ...targets]);
    setState(initialState);
    setObjectives(editorState);
    setMeasures(editorState);
    setLoading(false);
  };

  const makeSubmission = () => {
    const data = {
      targets,
      status: "department-head",
    };

    setLoading(true);

    try {
      store("commitments", data)
        .then((res) => {
          const response = res.data;
          navigate("/assessment/commitment", {
            state: {
              target: response.data,
            },
          });
          setLoading(false);
          Alert.success("Submitted!!", response.message);
        })
        .catch((err) => {
          console.log(err.message);
          Alert.success("Oops!!", err.response.data.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targets?.length > 0) {
      setTotal(
        targets
          .map((target) => parseInt(target.weight))
          .reduce((sum, curr) => sum + curr, 0)
      );
    }
  }, [targets]);

  return (
    <>
      <AddMilestone
        title="Add Milestone"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        count={targets?.length}
        data={data}
      />
      <div className="row">
        <div className="col-md-8">
          <div className="form-data">
            <form onSubmit={handleAddTargets}>
              <div className="row">
                <div className="col-md-12">
                  <div className="rich-text mt-3 mb-4">
                    <p className="label-font">Objectives</p>
                    <small className="label-description">
                      Description of what is to be achieved - must be in SMART
                      terms and derive from overall Board Objectives.
                    </small>
                    <Editor
                      editorState={objectives}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={onEditorStateChange}
                    />
                    <textarea
                      style={{ display: "none" }}
                      disabled
                      ref={(val) => (state.objectives = val)}
                      value={draftToHtml(
                        convertToRaw(objectives.getCurrentContent())
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Weight"
                    description="Assign a % to each objective. Weights must add up to 100%."
                    type="number"
                    value={state.weight}
                    onChange={(e) =>
                      setState({ ...state, weight: e.target.value })
                    }
                    disabled={total == 100}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Target"
                    description="The desired level of delivery in % in terms of time, volume, etc.?"
                    type="number"
                    value={state.target}
                    onChange={(e) =>
                      setState({ ...state, target: e.target.value })
                    }
                    disabled={total == 100}
                  />
                </div>
                <div className="col-md-12">
                  <div className="rich-text mt-3 mb-4">
                    <p className="label-font">Measure</p>
                    <small className="label-description">
                      How will the objective be measured? What will have to be
                      seen, heard, felt, etc. to confirm that the objective has
                      been achieved?
                    </small>
                    <Editor
                      editorState={measures}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={onEditorMeasureStateChange}
                    />
                    <textarea
                      style={{ display: "none" }}
                      disabled
                      ref={(val) => (state.measure = val)}
                      value={draftToHtml(
                        convertToRaw(measures.getCurrentContent())
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="milestone-btn-area mb-3">
                    <p className="label-font">Milestones</p>
                    <small className="label-description">
                      What are the Performance Milestones? What are the agreed
                      delivery and review dates?
                    </small>
                    <button
                      type="button"
                      className="milestone-btn"
                      disabled={total == 100}
                      onClick={() => setShow(true)}
                    >
                      <span className="material-icons-sharp">
                        notification_add
                      </span>
                      Add Milestone
                    </button>
                  </div>
                  {state.milestones?.length > 0 && (
                    <div className="row">
                      {state.milestones?.map((milestone, i) => (
                        <div className="col-md-3" key={i}>
                          <div className="milestone-data-area">
                            <p>{milestone?.description}</p>
                            <small>
                              {moment(milestone?.due_date).format("LL")}
                            </small>
                            {" -- "}
                            <small>
                              {milestone?.percentage_completion + "%"}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-md-12 mt-4">
                  <Button
                    type="submit"
                    text="Add Task"
                    icon="add_circle"
                    isLoading={loading}
                    disabled={
                      state.objectives === "" ||
                      state.weight == 0 ||
                      state.target == 0 ||
                      state.measure === "" ||
                      state.milestones?.length < 1 ||
                      total == 100
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <p className="label-font">Commitments</p>
          {targets?.length > 0 ? (
            targets?.map((targ, i) => (
              <div className="milestone-data-area mt-3 mb-3" key={i}>
                <h3>Task Weight: {targ?.weight + "%"}</h3>
                <p>Milestones: {targ?.milestones?.length}</p>
                <p>Target: {targ?.target + "%"}</p>
              </div>
            ))
          ) : (
            <div className="milestone-data-area mt-3">
              <p className="text-center text-danger">
                Nothing has been added yet
              </p>
            </div>
          )}

          <Button
            type="button"
            text="Submit Tasks"
            icon="send"
            handleClick={makeSubmission}
            isLoading={loading}
            disabled={targets?.length < 1}
          />
        </div>
      </div>
    </>
  );
};

export default TasksAndTargets;
