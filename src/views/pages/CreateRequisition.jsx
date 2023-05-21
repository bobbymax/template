/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { collection, store } from "../../controllers";
import Alert from "../../services/utils/alert";

import AddItem from "../modals/AddItem";

const CreateRequisition = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const { auth } = useStateContext();
  const navigate = useNavigate();

  const manageItem = (item) => {
    setData(item);
    setIsUpdating(true);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  // eslint-disable-next-line no-unused-vars
  const makeRequisition = () => {
    const requests = {
      department_id: auth?.department_id,
      no_of_items: items?.length,
      items,
    };

    try {
      store("requisitions", requests)
        .then((res) => {
          const response = res.data;
          Alert.success("Created!!", response.message);
          navigate("/inventory/requisitions", {
            state: {
              requisition: response?.data,
            },
          });
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }

    console.log(requests);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setItems(
        items.map((item) => {
          if (item.id == response?.data?.id) {
            return response?.data;
          }

          return item;
        })
      );
      Alert.success(response?.status, response?.message);
    } else {
      const exists = items.filter((itm) => itm?.id == response?.data?.id);

      if (exists?.length < 1) {
        setItems([response?.data, ...items]);
        Alert.success(response?.status, response?.message);
      } else {
        setError("This item already exists!!");
      }
    }

    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  useEffect(() => {
    collection("products")
      .then((res) => {
        const response = res.data.data;
        setProducts(response.filter((prod) => prod.isDistributable < 1));
      })
      .catch((err) => console.log(err.message));
  }, []);

  console.log(items);

  return (
    <>
      <AddItem
        title="Add Item"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ products }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Item
      </button>
      {error !== "" && (
        <div className="col-md-12 mt-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      <div className="items-area mt-3">
        <div className="row">
          {items?.map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="items__card">
                <span className="items__card-badge badge__primary">
                  {item?.urgency}
                </span>
                <h2 className="mt-2">{item?.product_name}</h2>
                <p className="text-success">Quantity: {item?.quantity}</p>
                <button
                  type="button"
                  className="items__custom-btn"
                  onClick={() => manageItem(item)}
                >
                  <span className="material-icons-sharp">settings</span>
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          {items?.length > 0 && (
            <div className="col-md-12 mt-4">
              <button
                type="button"
                className="items__custom-btn"
                onClick={() => makeRequisition()}
              >
                <span className="material-icons-sharp">send</span>
                Make Requisition
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateRequisition;
