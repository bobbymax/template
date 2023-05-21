/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddTraining from "../modals/AddTraining";

const Plan = () => {
  const [trainings, setTrainings] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageTraining = (training) => {
    setData(training);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setTrainings(
        trainings.map((training) => {
          if (training.id == response?.data?.id) {
            return response?.data;
          }

          return training;
        })
      );
    } else {
      setTrainings([response?.data, ...trainings]);
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
      collection("trainings")
        .then((res) => {
          const response = res.data.data;
          setTrainings(response);
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
      <AddTraining
        title="Add Training"
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
        Add Training
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.trainings}
          rows={trainings}
          manageRow={manageTraining}
          canManage
        />
      </div>
    </>
  );
};

export default Plan;
