/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { alter, store } from "../../controllers";
import { formatSelectOptions, unique } from "../../services/helpers";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddTouringAdvance = ({
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
    title: "",
    department_id: 0,
    user_id: 0,
    start: "",
    end: "",
    total_amount: 0,
  };

  const [state, setState] = useState(initialState);
  const [staff, setStaff] = useState([]);
  const [user, setUser] = useState(null);
  const [controller, setController] = useState(null);
  const [loading, setLoading] = useState(false);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = {
      title: state.title,
      department_id: state.department_id,
      user_id: user?.value,
      controller_id: controller?.id,
      start: state.start,
      end: state.end,
      total_amount: state.total_amount,
      reference_no: "TA" + unique(),
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("touringAdvances", state.id, data)
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
        store("touringAdvances", data)
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

  // console.log(data, state);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.users?.length > 0 &&
      dependencies?.auth !== null
    ) {
      const { users, auth } = dependencies;
      setStaff(formatSelectOptions(users, "id", "name"));
      setController(auth);
      setState({
        ...state,
        department_id: auth?.department_id,
      });
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        title: data?.title,
        total_amount: parseFloat(data?.total_amount),
        start: data?.start,
        end: data?.end,
      });
      setUser(staff.filter((stf) => stf.value == data?.user_id)[0]);
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <p className="label-font">Beneficiary</p>
              <Select
                components={animated}
                options={staff}
                placeholder="Select Staff"
                value={user}
                onChange={setUser}
                isSearchable
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Purpose"
                value={state.title}
                onChange={(e) =>
                  setState({
                    ...state,
                    title: e.target.value,
                  })
                }
                placeholder="Enter Purpose"
              />
            </div>
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
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="End"
                type="date"
                value={state.end}
                onChange={(e) =>
                  setState({
                    ...state,
                    end: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Amount"
                value={state.total_amount}
                onChange={(e) =>
                  setState({
                    ...state,
                    total_amount: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Purpose"
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Touring Advance`}
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

export default AddTouringAdvance;
