/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddClassification from "../modals/AddClassification";

const Classifications = () => {
  const [classifications, setClassifications] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageClassification = (classification) => {
    setData(classification);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setClassifications(
        classifications.map((dept) => {
          if (dept.id == response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setClassifications([response?.data, ...classifications]);
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
      collection("classifications")
        .then((res) => {
          const response = res.data.data;
          setClassifications(response);
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
      <AddClassification
        title="Add Classification"
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
        Add Classification
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.classifications}
          rows={classifications}
          manageRow={manageClassification}
          canManage
        />
      </div>
    </>
  );
};

export default Classifications;
