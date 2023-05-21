/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Button,
  TextInput,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import Modal from "../../template/components/modals/Modal";
import { formatSelectOptions } from "../../services/helpers";

const AddItem = ({
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
    quantity: 0,
    quantity_received: 0,
    urgency: "",
    available: 0,
    balance: 0,
  };
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(false);
  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      id: prod?.value,
      product_id: prod?.value,
      product_name: prod?.label,
      quantity: state.quantity,
      quantity_received: state.quantity_received,
      urgency: state.urgency,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        handleSubmit({
          status: "Updated!!",
          data: requests,
          message: "Item data has been updated!!",
          action: "alter",
        });
        setState(initialState);
        setProd(null);
        setLoading(false);
      } else {
        handleSubmit({
          status: "Created!!",
          data: requests,
          message: "Item data has been added!!",
          action: "store",
        });
        setState(initialState);
        setProd(null);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setState(initialState);
    handleClose();
  };

  useEffect(() => {
    if (state.quantity > 0 && state.available > 0) {
      const value = state.available - state.quantity;

      if (value > 0) {
        setState({
          ...state,
          balance: value,
        });
        setError("");
      } else {
        setState({
          ...state,
          balance: 0,
          quantity: 0,
        });

        setError("The amount required is more than what is available");
      }
    }
  }, [state.quantity, state.available]);

  useEffect(() => {
    if (prod !== null) {
      const product = dependencies?.products?.filter(
        (pros) => pros?.id == prod?.value
      )[0];

      if (product) {
        setState({
          ...state,
          available: product?.quantity_expected,
        });
      }
    }
  }, [prod]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        quantity: data?.quantity,
        quantity_received: data?.quantity_received,
        urgency: data?.urgency,
      });

      setProd({
        value: data?.product_id,
        label: data?.product_name,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            {error !== "" && (
              <div className="col-md-12">
                <div className="alert alert-danger">{error}</div>
              </div>
            )}
            <div className="col-md-12 mb-4">
              <p className="label-font">Product</p>
              <Select
                closeMenuOnSelect={true}
                components={animated}
                options={formatSelectOptions(
                  dependencies?.products,
                  "id",
                  "title"
                )}
                placeholder="Select Product"
                value={prod}
                onChange={setProd}
                isSearchable
              />
            </div>

            <div className="col-md-6">
              <TextInput
                label="Available"
                type="number"
                value={state.available}
                onChange={(e) =>
                  setState({ ...state, available: parseInt(e.target.value) })
                }
                disabled
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Balance"
                type="number"
                value={state.balance}
                onChange={(e) =>
                  setState({ ...state, balance: parseInt(e.target.value) })
                }
                disabled
              />
            </div>

            <div className="col-md-6">
              <TextInput
                label="Expected"
                type="number"
                value={state.quantity}
                onChange={(e) =>
                  setState({ ...state, quantity: parseInt(e.target.value) })
                }
                placeholder="Enter Quantity"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Received"
                type="number"
                value={state.quantity_received}
                onChange={(e) =>
                  setState({
                    ...state,
                    quantity_received: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Quantity"
              />
            </div>

            <div className="col-md-12">
              <CustomSelect
                label="Urgency"
                value={state.urgency}
                onChange={(e) =>
                  setState({
                    ...state,
                    urgency: e.target.value,
                  })
                }
              >
                <CustomSelectOptions value="" label="Select Urgency" disabled />

                {[
                  { key: "high", label: "High" },
                  { key: "medium", label: "Medium" },
                  { key: "low", label: "Low" },
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
                text={`${isUpdating ? "Update" : "Add"} Category`}
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

export default AddItem;
