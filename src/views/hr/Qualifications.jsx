/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddQualification from "../modals/AddQualification";

const Qualifications = () => {
  const [qualifications, setQualifications] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageQualification = (qualification) => {
    setData(qualification);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setQualifications(
        qualifications.map((qualification) => {
          if (qualification.id == response?.data?.id) {
            return response?.data;
          }

          return qualification;
        })
      );
    } else {
      setQualifications([response?.data, ...qualifications]);
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
      collection("qualifications")
        .then((res) => {
          const response = res.data.data;
          setQualifications(response);
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
      <AddQualification
        title="Add Qualification"
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
        Add Qualification
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.qualifications}
          rows={qualifications}
          manageRow={manageQualification}
          canManage
        />
      </div>
    </>
  );
};

export default Qualifications;
