/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import DataTables from "../../../template/components/tables/DataTables";
import { columns } from "../../../controllers/columns";
import { useStateContext } from "../../../context/ContextProvider";
import { collection } from "../../../controllers";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const { auth } = useStateContext();
  const navigate = useNavigate();

  const handlePrinting = (batch) => {
    // console.log(batch);

    navigate("/budget/batch/print", {
      state: {
        batch,
      },
    });
  };

  useEffect(() => {
    try {
      collection("batches")
        .then((res) => {
          const responses = res.data.data;
          setPayments(
            responses.filter(
              (batch) => batch?.department_id == auth?.department_id
            )
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, [auth]);

  return (
    <>
      <div className="custom__card">
        <DataTables
          pillars={columns.payments}
          rows={payments}
          manageRow={handlePrinting}
          canManage
        />
      </div>
    </>
  );
};

export default Payments;
