/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import DataTables from "../../template/components/tables/DataTables";
import { columns } from "../../controllers/columns";

const Breakdown = () => {
  const { state } = useLocation();
  const { auth } = useStateContext();
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);

  const handleBreakdown = (sub) => {
    navigate("/budget/expenditures/breakdown", {
      state: {
        subHead: sub,
      },
    });
  };

  useEffect(() => {
    if (state !== null) {
      const { subHeads } = state;

      setSubBudgetHeads(
        subHeads?.filter((sub) => sub?.department_code === auth?.budget_owner)
      );
    }
  }, [state]);

  //   console.log(subBudgetHeads, auth);

  return (
    <>
      <div className="custom__card">
        <DataTables
          pillars={columns.breakdown}
          rows={subBudgetHeads}
          manageRow={handleBreakdown}
          canManage
        />
      </div>
    </>
  );
};

export default Breakdown;
