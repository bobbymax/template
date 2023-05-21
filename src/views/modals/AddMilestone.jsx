/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button, TextInput } from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AddMilestone = ({
  title = "",
  count = 0,
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    description: "",
    percentage_completion: 0,
    due_date: "",
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      id: isUpdating ? state.id : count + 1,
      description: state.description,
      percentage_completion: state.percentage_completion,
      due_date: state.due_date,
    };

    try {
      setLoading(true);
      handleSubmit({
        status: isUpdating ? "Updated!!" : "Created!!",
        data: requests,
        action: isUpdating ? "alter" : "store",
      });
      setState(initialState);
      setLoading(false);
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
        name: data?.name,
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
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                placeholder="Enter Milestone Goal"
                multiline={4}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Due Date"
                type="date"
                value={state.due_date}
                onChange={(e) =>
                  setState({ ...state, due_date: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Percentage Completion"
                type="number"
                value={state.percentage_completion}
                onChange={(e) =>
                  setState({
                    ...state,
                    percentage_completion: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Milestone`}
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

export default AddMilestone;
