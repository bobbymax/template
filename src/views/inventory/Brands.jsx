/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddBrand from "../modals/AddBrand";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageBrand = (brand) => {
    setData(brand);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setBrands(
        brands.map((dept) => {
          if (dept.id == response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setBrands([response?.data, ...brands]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      collection("brands")
        .then((res) => {
          const response = res.data.data;
          setBrands(response);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddBrand
        title="Add Brand"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Brand
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.brands}
          rows={brands}
          manageRow={manageBrand}
          canManage
        />
      </div>
    </>
  );
};

export default Brands;
