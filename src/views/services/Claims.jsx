/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddClaim from "../modals/AddClaim";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const { auth } = useStateContext();

  const navigate = useNavigate();

  const manageClaim = (claim) => {
    setData(claim);
    setIsUpdating(true);
    setShow(true);
  };

  const handleClaim = (claim) => {
    navigate("/services/claims/details", {
      state: {
        claim,
      },
    });
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setClaims(
        claims.map((claim) => {
          if (claim.id == response?.data?.id) {
            return response?.data;
          }

          return claim;
        })
      );
    } else {
      setClaims([response?.data, ...claims]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      collection("claims")
        .then((res) => {
          const response = res.data.data;
          console.log(response);
          setClaims(response?.filter((claim) => claim?.type === "staff-claim"));
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
      <AddClaim
        title="Add Claim"
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
        Add Claim
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.claims}
          rows={claims}
          manageRow={manageClaim}
          more={handleClaim}
          canManage
        />
      </div>
    </>
  );
};

export default Claims;
