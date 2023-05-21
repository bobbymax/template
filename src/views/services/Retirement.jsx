/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import { useNavigate } from "react-router-dom";

const Retirement = () => {
  const [claims, setClaims] = useState([]);

  const navigate = useNavigate();

  const handleClaim = (claim) => {
    navigate("/services/retirement/details", {
      state: {
        claim,
      },
    });
  };

  useEffect(() => {
    try {
      collection("claims")
        .then((res) => {
          const response = res.data.data;
          setClaims(
            response?.filter((claim) => claim?.type === "touring-advance")
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
      <div className="custom__card">
        <DataTables
          pillars={columns.claims}
          rows={claims}
          manageRow={handleClaim}
          canManage
        />
      </div>
    </>
  );
};

export default Retirement;
