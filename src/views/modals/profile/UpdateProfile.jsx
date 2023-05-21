/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter } from "../../../controllers";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../../template/components/forms/Inputs";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Modal from "../../../template/components/modals/Modal";

const UpdateProfile = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    firstname: "",
    middlename: "",
    surname: "",
    department_id: 0,
    email: "",
    staff_no: "",
    grade_level_id: 0,
    type: "",
    status: "",
  };

  const animated = makeAnimated();

  const [state, setState] = useState(initialState);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState(null);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setDepartments([]);
    setState(initialState);
    setLoading(false);
    setGradeLevels([]);
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const request = {
      firstname: state.firstname,
      middlename: state.middlename,
      surname: state.surname,
      department_id: department?.value,
      email: state.email,
      staff_no: state.staff_no,
      grade_level_id: state.grade_level_id,
      type: state.type,
      status: state.status,
    };

    try {
      alter("users", state.id, request)
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
    if (
      dependencies !== undefined &&
      dependencies?.departments &&
      dependencies?.gradeLevels
    ) {
      const { departments, gradeLevels } = dependencies;
      const selected = [];

      departments?.map((dept) => {
        const forms = { label: dept?.name, value: dept?.id };
        return selected.push(forms);
      });

      setDepartments(selected);
      setGradeLevels(gradeLevels);
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        firstname: data?.firstname,
        middlename: data?.middlename,
        surname: data?.surname,
        department_id: data?.department_id,
        email: data?.email,
        staff_no: data?.staff_no,
        grade_level_id: data?.grade_level_id,
        type: data?.type,
        status: data?.status,
      });
      setDepartment({
        value: data?.department_id,
        label: data?.department_name,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <p className="label-font">Department</p>
              <Select
                components={animated}
                options={departments}
                placeholder="Select Department"
                value={department}
                onChange={setDepartment}
                isSearchable
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Firstname"
                value={state.firstname}
                onChange={(e) =>
                  setState({ ...state, firstname: e.target.value })
                }
                placeholder="Enter Firstname"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Middlename"
                value={state.middlename}
                onChange={(e) =>
                  setState({ ...state, middlename: e.target.value })
                }
                placeholder="Enter Middlename"
              />
            </div>
            <div className="col-md-7">
              <TextInput
                label="Surname"
                value={state.surname}
                onChange={(e) =>
                  setState({ ...state, surname: e.target.value })
                }
                placeholder="Enter Surname"
              />
            </div>
            <div className="col-md-5">
              <TextInput
                label="Staff ID"
                value={state.staff_no}
                onChange={(e) =>
                  setState({ ...state, staff_no: e.target.value })
                }
              />
            </div>
            <div className="col-md-5">
              <TextInput
                label="Email"
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
              />
            </div>
            <div className="col-md-7">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) =>
                  setState({
                    ...state,
                    type: e.target.value,
                  })
                }
              >
                <CustomSelectOptions value="" label="Select Type" disabled />

                {[
                  { value: "permanent", label: "Permanent" },
                  { value: "contract", label: "Contract" },
                  { value: "secondment", label: "Secondment" },
                  { value: "appointment", label: "Appointment" },
                  { value: "contractor", label: "Contractor" },
                  { value: "support", label: "Support" },
                  { value: "adhoc", label: "AdHoc" },
                ].map((typ, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={typ?.value}
                    label={typ?.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Grade Level"
                value={state.grade_level_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    grade_level_id: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Grade Level"
                  disabled
                />

                {gradeLevels?.map((lvl, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={lvl?.id}
                    label={lvl?.key}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Status"
                value={state.status}
                onChange={(e) =>
                  setState({
                    ...state,
                    status: e.target.value,
                  })
                }
              >
                <CustomSelectOptions value="" label="Select Status" disabled />

                {[
                  { value: "in-service", label: "In Service" },
                  { value: "retired", label: "Retired" },
                  { value: "transfer", label: "Transfer" },
                  { value: "removed", label: "Remove" },
                ].map((stat, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={stat?.value}
                    label={stat?.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12 mt-3">
              <Button
                type="submit"
                text="Update Staff Record"
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

export default UpdateProfile;
