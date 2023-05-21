/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";

import DataTables from "../../template/components/tables/DataTables";

const Orders = () => {
  const [requisitions, setRequisitions] = useState([]);
  const { auth } = useStateContext();
  const navigate = useNavigate();

  const manageRequisition = (req) => {
    // console.log(req);

    navigate("/inventory/requistion/request", {
      state: {
        requisition: req,
      },
    });
  };

  useEffect(() => {
    try {
      collection("requisitions")
        .then((res) => {
          const response = res.data.data;

          setRequisitions(
            response.filter((req) => req.department_id == auth?.department_id)
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  //   console.log(requisitions);

  return (
    <>
      <div className="custom__card">
        <DataTables
          pillars={columns.requisitions}
          rows={requisitions}
          manageRow={manageRequisition}
          canManage
        />
      </div>
    </>
  );
};

export default Orders;
