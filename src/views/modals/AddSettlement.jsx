/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter, store } from "../../controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";
import { formatSelectOptions } from "../../services/helpers";

const AddSettlement = ({
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
    remuneration_id: 0,
    grade_level_id: 0,
    amount: 0,
  };

  const [state, setState] = useState(initialState);
  const [rems, setRems] = useState([]);
  const [levels, setLevels] = useState([]);
  const [gradeLevel, setGradeLevel] = useState([]);
  const [loading, setLoading] = useState(false);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      remuneration_id: state.remuneration_id,
      grade_level_id: state.grade_level_id,
      grades: gradeLevel,
      amount: state.amount,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("settlements", state.id, requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Updated!!",
              data: response.data,
              message: response.message,
              action: "alter",
            });
            setState(initialState);
            setGradeLevel([]);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } else {
        store("settlements", requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Created!!",
              data: response.data,
              message: response.message,
              action: "store",
            });
            setState(initialState);
            setGradeLevel([]);
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
    setGradeLevel([]);
    handleClose();
  };

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.remunerations?.length > 0 &&
      dependencies?.grades?.length > 0
    ) {
      const { remunerations, grades } = dependencies;

      setRems(remunerations);
      setLevels(formatSelectOptions(grades, "id", "key"));
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        remuneration_id: data?.remuneration_id,
        grade_level_id: data?.grade_level_id,
        amount: data?.amount,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Remuneration"
                value={state.remuneration_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    remuneration_id: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Remuneration"
                  disabled
                />

                {rems.map((reme, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={reme.id}
                    label={reme.name}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              {isUpdating ? (
                <>
                  <CustomSelect
                    label="Remuneration"
                    value={state.grade_level_id}
                    onChange={(e) =>
                      setState({
                        ...state,
                        grade_level_id: parseInt(e.target.value),
                      })
                    }
                  >
                    <CustomSelectOptions
                      value={0}
                      label="Select Grade Level"
                      disabled
                    />

                    {dependencies?.grades?.map((grad) => (
                      <CustomSelectOptions
                        key={grad?.id}
                        value={grad.id}
                        label={grad.key}
                      />
                    ))}
                  </CustomSelect>
                </>
              ) : (
                <div className="mb-3">
                  <p className="label-font">Grade Levels</p>
                  <Select
                    components={animated}
                    options={levels}
                    placeholder="Select Grade Levels"
                    value={gradeLevel}
                    onChange={setGradeLevel}
                    isSearchable
                    isMulti
                  />
                </div>
              )}
            </div>

            <div className="col-md-12">
              <TextInput
                label="Amount"
                type="number"
                value={state.amount}
                onChange={(e) =>
                  setState({ ...state, amount: parseFloat(e.target.value) })
                }
                placeholder="Enter Amount"
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Remuneration`}
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

export default AddSettlement;
