/* eslint-disable eqeqeq */
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
import { useStateContext } from "../../context/ContextProvider";
import { formatSelectOptions } from "../../services/helpers";

const AddDistribution = ({
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
    department_id: 0,
    product_id: 0,
    category_id: 0,
    quantity: 0,
    category: "",
    floor: "",
    office: "",
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [ben, setBen] = useState(null);
  const { auth } = useStateContext();

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = {
      department_id: auth?.department_id,
      product_id: prod?.value,
      category_id: ben?.value,
      quantity: state.quantity,
      category: state.category,
      floor: state.floor,
      office: state.office,
      status: state.status,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("distributions", state.id, data)
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
        store("distributions", data)
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

  const createRange = (min, max) => {
    let range = [];
    for (let i = min; i <= max; i++) {
      range.push(i);
    }
    return range;
  };

  const handleModalClose = () => {
    setState(initialState);
    handleClose();
  };

  useEffect(() => {
    if (state.category === "staff") {
      setBeneficiaries(dependencies?.users);
    } else {
      setBeneficiaries(dependencies?.departments);
    }
  }, [state.category]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        department_id: data?.department_id,
        product_id: data?.product_id,
        category_id: data?.category_id,
        quantity: data?.quantity,
        category: data?.category,
        floor: data?.floor,
        office: data?.office,
        status: data?.status,
      });

      const product = dependencies?.products?.filter(
        (produ) => produ?.id == data?.product_id
      )[0];

      const beneficiary =
        data?.category === "staff"
          ? dependencies?.users?.filter((user) => user?.id == data?.user_id)[0]
          : dependencies?.departments?.filter(
              (dept) => dept?.id == data?.department_id
            )[0];

      if (product) {
        setProd({
          value: product?.id,
          label: product?.title,
        });
      }

      if (beneficiary) {
        setBen({
          value: beneficiary?.id,
          label: beneficiary?.name,
        });
      }
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Category"
                value={state.category}
                onChange={(e) =>
                  setState({ ...state, category: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select beneficiary"
                  disabled
                />

                {[
                  { key: "staff", label: "Staff" },
                  { key: "department", label: "Department" },
                ].map((ben, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={ben.key}
                    label={ben.label}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12 mb-4">
              <p className="label-font">Product</p>
              <Select
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
            <div className="col-md-12 mb-4">
              <p className="label-font">Beneficiary</p>
              <Select
                components={animated}
                options={formatSelectOptions(beneficiaries, "id", "name")}
                placeholder="Select Beneficiary"
                value={ben}
                onChange={setBen}
                isSearchable
              />
            </div>
            <div className="col-md-3">
              <TextInput
                label="Quantity"
                type="number"
                value={state.quantity}
                onChange={(e) =>
                  setState({
                    ...state,
                    quantity: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Quantity"
              />
            </div>

            <div className="col-md-6">
              <TextInput
                label="Office Number"
                value={state.office}
                onChange={(e) =>
                  setState({
                    ...state,
                    office: parseInt(e.target.value),
                  })
                }
                placeholder="Office Number"
              />
            </div>
            <div className="col-md-3">
              <CustomSelect
                label="Floor"
                value={state.floor}
                onChange={(e) =>
                  setState({
                    ...state,
                    floor: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions value="" label="Select Action" disabled />

                {createRange(1, 15).map((floor, i) => (
                  <CustomSelectOptions key={i} value={floor} label={floor} />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Distribution`}
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

export default AddDistribution;
