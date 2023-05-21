/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import {
  Boxes,
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddModules = ({
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
    code: "",
    icon: "",
    url: "",
    parentId: 0,
    type: "",
    roles: [],
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      code: state.code,
      icon: state.icon,
      url: state.url,
      parentId: state.parentId,
      type: state.type,
      roles: state.roles,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("modules", state.id, requests)
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
        store("modules", requests)
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

  const handleRoleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      !state.roles.includes(value) &&
        setState({ ...state, roles: [...state.roles, value] });
    } else {
      const indx = state.roles.indexOf(value);
      if (indx > -1 && state.roles.includes(value)) {
        state.roles.splice(indx, 1);
      }
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
        code: data?.code,
        icon: data?.icon,
        url: data?.url,
        parentId: data?.parentId,
        type: data?.type,
        roles: [],
      });
    }
  }, [data]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-7">
            <TextInput
              label="Name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="Enter Module Name"
            />
          </div>
          <div className="col-md-5">
            <CustomSelect
              label="Type"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
            >
              <CustomSelectOptions value="" label="Select Module Type" />

              {[
                { value: "application", label: "Application" },
                { value: "module", label: "Module" },
                { value: "page", label: "Page" },
              ].map((modTyp, i) => (
                <CustomSelectOptions
                  key={i}
                  value={modTyp.value}
                  label={modTyp.label}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-5">
            <TextInput
              label="Icon"
              value={state.icon}
              onChange={(e) => setState({ ...state, icon: e.target.value })}
              placeholder="Enter Module icon"
            />
          </div>
          <div className="col-md-7">
            <TextInput
              label="Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              placeholder="Enter Module Code"
            />
          </div>
          <div className="col-md-7">
            <TextInput
              label="Url"
              value={state.url}
              onChange={(e) => setState({ ...state, url: e.target.value })}
              placeholder="Enter Module Url"
            />
          </div>
          <div className="col-md-5">
            <CustomSelect
              label="Parent"
              value={state.parentId}
              onChange={(e) => setState({ ...state, parentId: e.target.value })}
            >
              <CustomSelectOptions value={0} label="None" />

              {dependencies?.modules
                .filter((mod) => mod.type === "application")
                .map((mod) => (
                  <CustomSelectOptions
                    key={mod.id}
                    value={mod.id}
                    label={mod.name}
                  />
                ))}
            </CustomSelect>
          </div>
          <div className="col-md-12">
            <div className="mt-3 mb-4">
              <div className="row">
                {dependencies?.roles.map((rol, i) => (
                  <div className="col-md-4" key={i}>
                    <Boxes
                      value={rol.id}
                      onChange={handleRoleChange}
                      label={rol.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Module`}
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddModules;
