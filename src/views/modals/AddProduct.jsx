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
import {
  allowedFileTypes,
  formatSelectOptions,
  getFileExt,
} from "../../services/helpers";

const AddProduct = ({
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
    brand_id: 0,
    classification_id: 0,
    code: "",
    title: "",
    description: "",
    quantity_expected: 0,
    quantity_received: 0,
    end_of_life: "",
    isDistributable: 0,
    image: undefined,
    categories: [],
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [errors, setErrors] = useState("");

  const animated = makeAnimated();
  const maxSize = 4194304;

  const handleChange = (e) => {
    const file = e.target.files[0];
    const allowed = allowedFileTypes.includes(getFileExt(file.name));

    if (allowed && file.size < maxSize) {
      setUploadedFile(file);
      setErrors("");
      setImgSrc(URL.createObjectURL(file));
    } else {
      setUploadedFile(null);
      setErrors("File too big or not supported");
      setImgSrc(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("photo", uploadedFile);
    formData.append("brand_id", state.brand_id);
    formData.append("classification_id", state.classification_id);
    formData.append("code", state.code);
    formData.append("title", state.title);
    formData.append("description", state.description);
    formData.append("quantity_expected", state.quantity_expected);
    formData.append("quantity_received", state.quantity_received);
    formData.append("categories", JSON.stringify(cats));
    formData.append("isDistributable", state.isDistributable);

    try {
      setLoading(true);
      if (isUpdating) {
        alter("products", state.id, formData)
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
        store("products", formData)
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
    setUploadedFile(null);
    setImgSrc(null);
    setCats([]);
    setErrors("");
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        brand_id: data?.brand_id,
        classification_id: data?.classification_id,
        code: data?.code,
        title: data?.title,
        description: data?.description,
        quantity_expected: data?.quantity_expected,
        quantity_received: data?.quantity_received,
        end_of_life: data?.end_of_life,
        isDistributable: data?.isDistributable,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form encType="multipart/form-data" onSubmit={handleFormSubmit}>
          <div className="row">
            {errors !== "" && (
              <div className="col-md-12">
                <div className="alert alert-danger">{errors}</div>
              </div>
            )}
            {imgSrc !== null && (
              <div className="col-md-12 mb-2">
                <img
                  src={imgSrc}
                  alt="Uploaded File"
                  style={{ width: 48, height: 48 }}
                />
              </div>
            )}
            <div className="col-md-8">
              <TextInput
                label="Title"
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
                placeholder="Enter Product Title"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Code"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="Enter Product Code"
              />
            </div>
            <div className="col-md-12 mb-4">
              <p className="label-font">Categories</p>
              <Select
                closeMenuOnSelect={false}
                components={animated}
                options={formatSelectOptions(
                  dependencies?.categories,
                  "id",
                  "name"
                )}
                placeholder="Select Categories"
                value={cats}
                onChange={setCats}
                isSearchable
                isMulti
              />
            </div>
            <div className="col-md-5">
              <CustomSelect
                label="Product Brand"
                value={state.brand_id}
                onChange={(e) =>
                  setState({ ...state, brand_id: parseInt(e.target.value) })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Product Brand"
                  disabled
                />

                {dependencies?.brands?.map((brand, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={brand.id}
                    label={brand.name}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-7">
              <CustomSelect
                label="Product Classification"
                value={state.classification_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    classification_id: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Product Classification"
                  disabled
                />

                {dependencies?.classifications?.map((classification, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={classification.id}
                    label={classification.name}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
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
                placeholder="Enter Product Quantity Expected"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Quantity Received"
                type="number"
                value={state.quantity_received}
                onChange={(e) =>
                  setState({
                    ...state,
                    quantity_received: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Product Quantity Received"
              />
            </div>
            <div className="col-md-7">
              <TextInput
                label="Upload Product Image"
                type="file"
                value={state.image}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-5">
              <CustomSelect
                label="Request at Point of Delivery"
                value={state.isDistributable}
                onChange={(e) =>
                  setState({
                    ...state,
                    isDistributable: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions value="" label="Select Action" disabled />

                {[
                  { key: 0, label: "No" },
                  { key: 1, label: "Yes" },
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
              <TextInput
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                placeholder="Enter Description"
                multiline={3}
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Product`}
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

export default AddProduct;
