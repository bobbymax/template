/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";

import DataTables from "../../template/components/tables/DataTables";

const BatchPayments = () => {
  const { auth } = useStateContext();
  const navigate = useNavigate();

  const [tracks, setTracks] = useState([]);

  const handleEntries = (trac) => {
    // console.log(trac);

    navigate("/tracking/disbursements/batch", {
      state: {
        track: trac,
      },
    });
  };

  useEffect(() => {
    try {
      collection("tracks")
        .then((res) => {
          const tcks = res.data.data;

          setTracks(
            tcks.filter((trck) => trck?.department_id == auth?.department_id)
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(tracks);

  return (
    <>
      <div className="custom__card">
        <DataTables
          pillars={columns.tracking}
          rows={tracks}
          manageRow={handleEntries}
          canManage
        />
      </div>
    </>
  );
};

export default BatchPayments;
