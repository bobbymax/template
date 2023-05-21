/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { batchRequests, collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddSettlement from "../modals/AddSettlement";
import axios from "axios";

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [remunerations, setRemunerations] = useState([]);
  const [grades, setGrades] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageSettlement = (settlement) => {
    setData(settlement);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setSettlements(
        settlements.map((dept) => {
          if (dept.id == response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setSettlements([...response?.data, ...settlements]);
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
      const settlementsData = collection("settlements");
      const remunerationsData = collection("remunerations");
      const gradeLevelsData = collection("gradeLevels");

      batchRequests([remunerationsData, gradeLevelsData, settlementsData])
        .then(
          axios.spread((...res) => {
            setRemunerations(res[0].data.data);
            setGrades(res[1].data.data);
            setSettlements(res[2].data.data);
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
      <AddSettlement
        title="Add Settlement"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ remunerations, grades }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Settlement
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.settlements}
          rows={settlements}
          manageRow={manageSettlement}
          canManage
        />
      </div>
    </>
  );
};

export default Settlements;
