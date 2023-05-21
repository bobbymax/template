/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { batchRequests, collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddProduct from "../modals/AddProduct";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageProduct = (prod) => {
    setData(prod);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setProducts(
        products.map((dept) => {
          if (dept.id == response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setProducts([response?.data, ...products]);
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
      const brandData = collection("brands");
      const classificationData = collection("classifications");
      const categoryData = collection("categories");
      const productData = collection("products");
      batchRequests([brandData, classificationData, categoryData, productData])
        .then(
          axios.spread((...res) => {
            setBrands(res[0].data.data);
            setClassifications(res[1].data.data);
            setCategories(res[2].data.data);
            setProducts(res[3].data.data);
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddProduct
        title="Add Product"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ brands, classifications, categories }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Product
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.products}
          rows={products}
          manageRow={manageProduct}
          canManage
        />
      </div>
    </>
  );
};

export default Products;
