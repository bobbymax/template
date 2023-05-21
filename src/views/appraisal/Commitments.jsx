/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Commitments = () => {
  const [commitments, setCommitments] = useState([]);

  const navigate = useNavigate();

  const manageCommitment = (commitment) => {
    navigate("/assessment/commitment/task-and-targets", {
      state: {
        commitment,
      },
    });
  };

  useEffect(() => {
    try {
      collection("commitments")
        .then((res) => {
          const response = res.data.data;
          setCommitments(response);
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
        onClick={() => navigate("/assessment/commitment/tasks-and-target")}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Task and Targets {moment().year()}
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.commitments}
          rows={commitments}
          manageRow={manageCommitment}
          canManage
        />
      </div>
    </>
  );
};

export default Commitments;
