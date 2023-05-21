/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { alter } from "../../controllers";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";

const AlterItem = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    product_id: 0,
    quantity_expected: 0,
    quantity_received: 0,
    urgency: "",
    description: "",
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      product_id: state.product_id,
      quantity_expected: state.quantity_expected,
      quantity_received: state.quantity_received,
      urgency: state.urgency,
      description: state.description,
      status: state.status,
    };

    try {
      alter("items", state.id, requests)
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
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        product_id: data?.product_id,
        quantity_expected: parseInt(data?.quantity_expected),
        quantity_received: parseInt(data?.quantity_received),
        urgency: data?.urgency,
        description: data?.description === null ? "" : data?.description,
        status: data?.status,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-4">
              <TextInput
                label="Quantity Expected"
                type="number"
                value={state.quantity_expected}
                onChange={(e) =>
                  setState({
                    ...state,
                    quantity_expected: parseInt(e.target.value),
                  })
                }
                disabled
              />
            </div>
            <div className="col-md-8">
              <TextInput
                label="Allocate"
                type="number"
                value={state.quantity_received}
                onChange={(e) =>
                  setState({
                    ...state,
                    quantity_received: parseInt(e.target.value),
                  })
                }
              />
            </div>

            {state.status === "denied" && (
              <div className="col-md-12">
                <TextInput
                  label="Remark"
                  value={state.description}
                  onChange={(e) =>
                    setState({
                      ...state,
                      description: parseInt(e.target.value),
                    })
                  }
                  multiline={3}
                  placeholder="Enter Remark Here"
                />
              </div>
            )}

            <div className="col-md-12">
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
                <CustomSelectOptions
                  value="pending"
                  label="Select Status"
                  disabled
                />

                {[
                  { key: "approved", label: "Approve" },
                  { key: "denied", label: "Deny" },
                ].map((dist, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={dist.key}
                    label={dist.label}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text="Confirm Item"
                isLoading={loading}
                icon="send"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AlterItem;
