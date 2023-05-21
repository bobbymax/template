/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddRemuneration from "../modals/AddRemuneration";

const Remunerations = () => {
  const [remunerations, setRemunerations] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageRemuneration = (rem) => {
    setData(rem);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setRemunerations(
        remunerations.map((dept) => {
          if (dept.id == response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setRemunerations([response?.data, ...remunerations]);
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
      collection("remunerations")
        .then((res) => {
          const response = res.data.data;
          setRemunerations(response);
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
      <AddRemuneration
        title="Add Remuneration"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ remunerations }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Remuneration
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.remunerations}
          rows={remunerations}
          manageRow={manageRemuneration}
          canManage
        />
      </div>
    </>
  );
};

export default Remunerations;
