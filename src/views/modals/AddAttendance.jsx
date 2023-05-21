/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddAttendance = ({
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
    training_id: 0,
    title: "",
    learning_category_id: 0,
    qualification_id: 0,
    start: "",
    end: "",
    facilitator: "",
    location: "",
    category: "",
    type: "archive",
    resident: "",
    certificate: "",
    status: "registered",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(null);
  const [trains, setTrains] = useState([]);
  const [noOfDays, setNoOfDays] = useState(0);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      training_id: state.training_id,
      learning_category_id: state.learning_category_id,
      qualification_id: state.qualification_id,
      start: state.start,
      end: state.end,
      facilitator: state.facilitator,
      location: state.location,
      category: state.category,
      type: state.type,
      resident: state.resident,
      certificate: state.certificate,
      status: state.status,
      title: state.title,
    };

    // console.log(requests);

    try {
      setLoading(true);
      if (isUpdating) {
        alter("joinings", state.id, requests)
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
        store("joinings", requests)
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
    setLoading(false);
    setTraining(null);
    setNoOfDays(0);
    handleClose();
  };

  useEffect(() => {
    if (dependencies !== null && dependencies?.trainings?.length > 0) {
      const { trainings } = dependencies;
      const loaded = [{ value: 0, label: "Other" }];
      trainings?.map((training) =>
        loaded.push({
          value: training?.id,
          label: training?.title,
        })
      );
      setTrains(loaded);
    }
  }, [dependencies]);

  useEffect(() => {
    if (state.start !== "" && state.end !== "") {
      const start = new Date(state.start);
      const end = new Date(state.end);
      const time = Math.abs(end - start);
      const days = Math.ceil(time / (1000 * 60 * 60 * 24));

      setNoOfDays(days + 1);
    }
  }, [state.start, state.end]);

  useEffect(() => {
    if (
      noOfDays > 0 &&
      dependencies !== undefined &&
      dependencies?.qualifications?.length > 0
    ) {
      const { qualifications } = dependencies;
      qualifications?.map(
        (qual) =>
          noOfDays >= qual?.min &&
          noOfDays <= qual?.max &&
          setState({
            ...state,
            qualification_id: parseInt(qual?.id),
          })
      );
    }
  }, [noOfDays]);

  useEffect(() => {
    if (training !== null && training?.label !== "Other") {
      setState({
        ...state,
        training_id: training?.value,
        title: training?.label,
      });
    }
  }, [training]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        training_id: data?.training_id,
        learning_category_id: data?.learning_category_id,
        qualification_id: data?.qualification_id,
        start: data?.start,
        end: data?.end,
        facilitator: data?.facilitator,
        location: data?.location,
        category: data?.category,
        type: data?.type,
        resident: data?.resident,
        certificate: data?.certificate,
        status: data?.status,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <p className="label-font">Training Title</p>
              <Select
                components={animated}
                options={trains}
                placeholder="Select Categories"
                value={training}
                onChange={setTraining}
                isSearchable
              />
            </div>
            {training !== null && training?.label === "Other" && (
              <div className="col-md-12">
                <TextInput
                  label="Title"
                  value={state.title}
                  onChange={(e) =>
                    setState({
                      ...state,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter Training Title"
                  disabled={training?.label !== "Other"}
                />
              </div>
            )}

            <div className="col-md-6">
              <TextInput
                label="Start"
                type="date"
                value={state.start}
                onChange={(e) =>
                  setState({
                    ...state,
                    start: e.target.value,
                  })
                }
                placeholder="Enter Start Date"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Finish"
                type="date"
                value={state.end}
                onChange={(e) =>
                  setState({
                    ...state,
                    end: e.target.value,
                  })
                }
                placeholder="Enter Finish Date"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Facilitator"
                value={state.facilitator}
                onChange={(e) =>
                  setState({
                    ...state,
                    facilitator: e.target.value,
                  })
                }
                placeholder="Enter Facilitator"
              />
            </div>
            <div className="col-md-8">
              <TextInput
                label="Location"
                value={state.location}
                onChange={(e) =>
                  setState({
                    ...state,
                    location: e.target.value,
                  })
                }
                placeholder="Enter Location"
              />
            </div>
            <div className="col-md-7">
              <CustomSelect
                label="Resident"
                value={state.resident}
                onChange={(e) =>
                  setState({
                    ...state,
                    resident: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Resident"
                  disabled
                />

                {[
                  { key: "international", label: "International" },
                  { key: "local", label: "Local" },
                ].map((resident, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={resident.key}
                    label={resident.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-5">
              <CustomSelect
                label="Category"
                value={state.category}
                onChange={(e) =>
                  setState({
                    ...state,
                    category: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Category"
                  disabled
                />

                {[
                  { key: "virtual", label: "Virtual" },
                  { key: "on-premise", label: "On Premise" },
                ].map((cat, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={cat.key}
                    label={cat.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Learning Category"
                value={state.learning_category_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    learning_category_id: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Learning Category"
                  disabled
                />

                {dependencies?.categories?.map((qual, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={qual.id}
                    label={qual.name}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Qualification"
                value={state.qualification_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    qualification_id: e.target.value,
                  })
                }
                disabled
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Qualification"
                  disabled
                />

                {dependencies?.qualifications?.map((qual, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={qual.id}
                    label={qual.type}
                  />
                ))}
              </CustomSelect>
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
    </>
  );
};

export default AddAttendance;
