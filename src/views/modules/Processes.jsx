/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, store } from "../../controllers";
import Alert from "../../services/utils/alert";
import {
  Boxes,
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";

const Processes = () => {
  const initialState = {
    id: 0,
    name: "",
    type: "",
    stages: [],
    role_id: 0,
    office: "",
    canEdit: false,
    canQuery: false,
    accounts: false,
    action: "",
    order: 0,
  };

  const [state, setState] = useState(initialState);
  const [roles, setRoles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      type: state.type,
      stages: state.stages,
    };

    // console.log(requests);

    try {
      if (isUpdating) {
      } else {
        store("processes", requests)
          .then((res) => {
            const response = res.data;
            navigate("/admin/processes");
            Alert.success("Added!!", response.message);
          })
          .catch((err) => {
            Alert.error("Oops!!", err.response.data.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddstage = () => {
    setShow(true);
  };

  const closeSection = () => {
    setShow(false);
  };

  const addStageToList = () => {
    setLoading(true);
    const role = roles.filter((role) => role?.id == state.role_id)[0];
    const data = {
      role_id: role.id,
      role_name: role?.name,
      office: state.office,
      canEdit: state.canEdit,
      canQuery: state.canQuery,
      accounts: state.accounts,
      action: state.action,
      order: state.order,
    };

    setState({
      ...state,
      stages: [data, ...state.stages],
      role_id: 0,
      canEdit: false,
      canQuery: false,
      accounts: false,
      office: "",
      action: "",
      order: 0,
    });
    setShow(false);
    setLoading(false);
  };

  useEffect(() => {
    if (location && location.state !== null && location.state.process) {
      const { process } = location.state;
      setState({
        ...state,
        id: process?.id,
        type: process?.type,
        name: process?.name,
        stages: process?.stages,
      });
      setIsUpdating(true);
    }
  }, [location]);

  useEffect(() => {
    try {
      collection("roles")
        .then((res) => {
          setRoles(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <div className="custom__card">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <TextInput
                    label="Name"
                    value={state.name}
                    onChange={(e) =>
                      setState({ ...state, name: e.target.value })
                    }
                    placeholder="Enter Workflow Name Here"
                  />
                </div>
                <div className="col-md-4">
                  <CustomSelect
                    label="Type"
                    value={state.type}
                    onChange={(e) =>
                      setState({ ...state, type: e.target.value })
                    }
                  >
                    <CustomSelectOptions
                      value=""
                      label="Select Workflow Type"
                      disabled
                    />

                    {[
                      { key: "payment", label: "Payment" },
                      { key: "document", label: "Document" },
                    ].map((typ, i) => (
                      <CustomSelectOptions
                        key={i}
                        value={typ.key}
                        label={typ.label}
                      />
                    ))}
                  </CustomSelect>
                </div>
                <div className="col-md-12 mt-2">
                  <Button
                    text="Add Stage"
                    isLoading={loading}
                    icon="add_circle"
                    disabled={show || state.name === "" || state.type === ""}
                    handleClick={handleAddstage}
                    variant="dark"
                  />
                </div>
                {show && (
                  <div className="col-md-12">
                    <div className="stage__section">
                      <div className="row">
                        <div className="col-md-4">
                          <CustomSelect
                            label="Role"
                            value={state.role_id}
                            onChange={(e) =>
                              setState({
                                ...state,
                                role_id: parseInt(e.target.value),
                              })
                            }
                          >
                            <CustomSelectOptions
                              value={0}
                              label="Select Role"
                              disabled
                            />

                            {roles?.map((role, i) => (
                              <CustomSelectOptions
                                key={i}
                                value={role.id}
                                label={role.name}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="col-md-8">
                          <TextInput
                            label="Office"
                            value={state.office}
                            onChange={(e) =>
                              setState({
                                ...state,
                                office: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-8">
                          <CustomSelect
                            label="Type"
                            value={state.action}
                            onChange={(e) =>
                              setState({ ...state, action: e.target.value })
                            }
                          >
                            <CustomSelectOptions
                              value=""
                              label="Select Role Action"
                              disabled
                            />

                            {[
                              { key: "sign", label: "Sign" },
                              { key: "clear", label: "Clear" },
                              { key: "post", label: "Post" },
                              { key: "confirm", label: "Confirm" },
                            ].map((act, i) => (
                              <CustomSelectOptions
                                key={i}
                                value={act.key}
                                label={act.label}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="col-md-4">
                          <TextInput
                            label="Order"
                            type="number"
                            value={state.order}
                            onChange={(e) =>
                              setState({
                                ...state,
                                order: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Boxes
                            label="Edit"
                            value={state.canEdit}
                            onChange={(e) =>
                              setState({
                                ...state,
                                canEdit: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Boxes
                            label="Query"
                            value={state.canQuery}
                            onChange={(e) =>
                              setState({
                                ...state,
                                canQuery: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Boxes
                            label="FAD"
                            value={state.accounts}
                            onChange={(e) =>
                              setState({
                                ...state,
                                accounts: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          <Button
                            text="Submit"
                            isLoading={loading}
                            icon="add_circle"
                            handleClick={addStageToList}
                            variant="secondary"
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          <Button
                            text="Close"
                            isLoading={loading}
                            icon="add_circle"
                            handleClick={closeSection}
                            variant="danger"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-md-12 mt-4">
                  <Button
                    text="Create Workflow"
                    type="submit"
                    isLoading={loading}
                    icon="add_circle"
                    disabled={
                      state.name === "" ||
                      state.type === "" ||
                      state.stages?.length < 1
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          {state?.stages?.length > 0 ? (
            state.stages?.map((stg, i) => (
              <div className="stage__details" key={i}>
                <small>{stg?.role_name}</small>
                <h3>{`this role ${stg?.action}s payments, ${
                  stg?.canEdit ? "can" : "cannot"
                } make edits, and ${
                  stg?.canQuery ? "can" : "cannot"
                } query a payment.`}</h3>
                <small>approval order: {stg?.order}</small>
              </div>
            ))
          ) : (
            <div className="stage__details nothing">
              <small>empty</small>
              <h3>no stage has been added to this process</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Processes;
