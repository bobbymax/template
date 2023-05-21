/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
// import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Requisitions = () => {
  const [requisitions, setRequisitions] = useState([]);

  const { auth } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      collection("requisitions")
        .then((res) => {
          const response = res.data.data;
          setRequisitions(
            response.filter((req) => req?.department_id == auth?.department_id)
          );
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
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => navigate("/inventory/requisitions/create")}
      >
        <span className="material-icons-sharp">add_circle</span>
        Make Requisition
      </button>
      <div className="custom__card">
        <DataTables pillars={columns.requisitions} rows={requisitions} />
      </div>
    </>
  );
};

export default Requisitions;
