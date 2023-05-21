/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import DataTables from "../../template/components/tables/DataTables";
import { columns } from "../../controllers/columns";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
} from "../../template/components/forms/Inputs";
import { alter, collection, store } from "../../controllers";
import AddItem from "./AddItem";
import Alert from "../../services/utils/alert";
import AlterItem from "./AlterItem";

const ApproveRequisition = () => {
  const { state } = useLocation();
  const [requisition, setRequisition] = useState(null);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [alterShow, setAlterShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const closeRequisitionRequest = () => {
    const data = {
      status,
      requisition_id: requisition?.id,
    };

    try {
      setLoading(true);
      store("stores", data)
        .then((res) => {
          const response = res.data;

          setRequisition(response.data);
          setLoading(false);
          Alert.success("Confirmed!!", response.message);
        })
        .catch((err) => {
          setLoading(false);
          Alert.error("Oops!!", "Something went wrong!!");
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmRequest = () => {
    const data = {
      status: "department-approval",
      items,
    };

    try {
      setLoading(true);
      alter("requisitions", requisition?.id, data)
        .then((res) => {
          const response = res.data.data;
          setRequisition(response);
          setItems(response?.items);
          setLoading(false);
          Alert.success("Confirmed!!", res.data.message);
        })
        .catch((err) => {
          console.log(err.message);
          Alert.error("Oops!!", "Something went wrong!!");
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const manageItem = (item) => {
    setData({
      ...item,
      quantity: item?.quantity_expected,
    });

    setIsUpdating(true);
    setShow(true);
  };

  const manageItemRequests = (item) => {
    setData(item);
    setAlterShow(true);
  };

  const handleClose = () => {
    setAlterShow(false);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setItems(
        items.map((item) => {
          if (item.product_id == response?.data?.product_id) {
            return {
              ...item,
              quantity_expected: response?.data?.quantity_expected,
              quantity_received: response?.data?.quantity_received,
              urgency: response?.data?.urgency,
              status: response?.data?.status,
            };
          }

          return item;
        })
      );
      Alert.success(response?.status, response?.message);
    }

    setIsUpdating(false);
    setShow(false);
    setAlterShow(false);
    setData(undefined);
  };

  useEffect(() => {
    if (state) {
      const req = state?.requisition;

      setRequisition(req);
      setItems(req?.items);
    }
  }, [state]);

  useEffect(() => {
    collection("products")
      .then((res) => {
        const response = res.data.data;
        setProducts(response.filter((prod) => !prod?.isDistributable));
      })
      .catch((err) => console.log(err.message));
  }, []);

  //   console.log(requisition);

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
      <AlterItem
        title="Confirm Item"
        show={alterShow}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={data}
      />
      "Approve Requisition">
      <div className="content">
        <div className="requisition-details m-4">
          <div className="row">
            <div className="col-md-4">
              <div className="details__card">
                <div className="dits mb-4">
                  <p>Requisitor</p>
                  <small>- {requisition?.created_at}</small>
                  <h3 className="mt-1 text-success">
                    {requisition?.requisitor_staff_name}
                  </h3>
                  <small>
                    <b>{requisition?.department}</b>
                  </small>
                </div>
                <div className="dits mb-4">
                  <p>Approving Staff</p>
                  <small>- {requisition?.updated_at}</small>
                  <h3
                    className={`mt-1 ${
                      requisition?.manager_staff_name === ""
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {requisition?.manager_staff_name === ""
                      ? "Not Seconded!!"
                      : requisition?.manager_staff_name}
                  </h3>
                  <small>
                    <b>{requisition?.department}</b>
                  </small>
                </div>

                <Button
                  text={`${
                    requisition?.approving_officer_id < 1
                      ? "Confirm Request"
                      : "Confirmed"
                  }`}
                  isLoading={loading}
                  icon={`${
                    requisition?.approving_officer_id < 1
                      ? "add_circle"
                      : "verified"
                  }`}
                  handleClick={confirmRequest}
                  disabled={requisition?.approving_officer_id > 0}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="details__card">
                <div className="dits mb-4">
                  <p>Store Manager</p>
                  <small>- {requisition?.store?.created_at}</small>
                  <h3
                    className={`mt-1 ${
                      requisition?.store === null
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {requisition?.store === null
                      ? "No Response Yet!!"
                      : requisition?.store?.store_manager_name}
                  </h3>
                  <small>
                    <b>
                      {requisition?.store === null
                        ? "Awaiting Response"
                        : "Store"}
                    </b>
                  </small>
                  {!requisition?.isArchived && (
                    <div className="mt-4 mb-4">
                      <CustomSelect
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <CustomSelectOptions
                          label="Select Action"
                          value=""
                          disabled
                        />
                        {[
                          { value: "approved", label: "Approve" },
                          { value: "denied", label: "Deny" },
                        ].map((stat, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={stat.value}
                            label={stat.label}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                  )}
                </div>
                <Button
                  text={`${
                    requisition?.status !== "approved"
                      ? "Close Request"
                      : "Closed"
                  }`}
                  isLoading={loading}
                  icon={`${
                    requisition?.status !== "approved"
                      ? "add_circle"
                      : "verified"
                  }`}
                  handleClick={closeRequisitionRequest}
                  disabled={requisition?.status === "approved" || status === ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="custom__card">
          <div className="row">
            <DataTables
              pillars={columns.items}
              rows={items}
              manageRow={manageItem}
              canManage={
                requisition?.status !== "department-approval" &&
                !requisition?.isArchived
              }
              confirmItems={manageItemRequests}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApproveRequisition;
