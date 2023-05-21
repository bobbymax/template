/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { batchRequests, collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddAttendance from "../modals/AddAttendance";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";

const Trainings = () => {
  const [joinings, setJoinings] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const { auth } = useStateContext();

  const manageJoining = (joining) => {
    setData(joining);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setJoinings(
        joinings.map((joining) => {
          if (joining.id == response?.data?.id) {
            return response?.data;
          }

          return joining;
        })
      );
    } else {
      setJoinings([response?.data, ...joinings]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      const joiningData = collection("joinings");
      const trainingData = collection("trainings");
      const categoryData = collection("learningCategories");
      const qualificationData = collection("qualifications");

      batchRequests([
        joiningData,
        trainingData,
        categoryData,
        qualificationData,
      ])
        .then(
          axios.spread((...res) => {
            const joing = res[0].data.data;
            setJoinings(joing);
            setTrainings(res[1].data.data);
            setCategories(res[2].data.data);
            setQualifications(res[3].data.data);
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  //   console.log(joinings);

  return (
    <>
      <AddAttendance
        title="Add Training"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ auth, trainings, categories, qualifications }}
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
          pillars={columns.joinings}
          rows={joinings}
          manageRow={manageJoining}
          canManage
        />
      </div>
    </>
  );
};

export default Trainings;
