/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import axios from "axios";
// import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { batchRequests, collection } from "../../controllers";
import { columns } from "../../controllers/columns";

const VerifyTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  //   const [show, setShow] = useState(false);
  //   const [data, setData] = useState(undefined);
  //   const [isUpdating, setIsUpdating] = useState(false);

  const manageJoining = (joining) => {
    // setData(joining);
    // setIsUpdating(true);
    // setShow(true);
  };

  //   const handleSubmit = (response) => {
  //     if (response?.action === "alter") {
  //       setTrainings(
  //         trainings.map((joining) => {
  //           if (joining.id == response?.data?.id) {
  //             return response?.data;
  //           }

  //           return joining;
  //         })
  //       );
  //     } else {
  //       setTrainings([response?.data, ...trainings]);
  //     }

  //     Alert.success(response?.status, response?.message);
  //     setIsUpdating(false);
  //     setShow(false);
  //     setData(undefined);
  //   };

  //   const handleClose = () => {
  //     setShow(false);
  //     setIsUpdating(false);
  //     setShow(false);
  //     setData(undefined);
  //   };

  useEffect(() => {
    try {
      const trainingData = collection("joinings");

      batchRequests([trainingData])
        .then(
          axios.spread((...res) => {
            const trains = res[0].data.data;
            setTrainings(
              trains?.filter((train) => train?.status === "registered")
            );
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
      <div className="custom__card">
        <DataTables
          pillars={columns.joinings}
          rows={trainings}
          manageRow={manageJoining}
          canManage
        />
      </div>
    </>
  );
};

export default VerifyTrainings;
