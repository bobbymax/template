/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddGrade from "../modals/AddGrade";

const Grades = () => {
  const [levels, setLevels] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageLevels = (level) => {
    setData(level);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setLevels(
        levels.map((lev) => {
          if (lev.id == response?.data?.id) {
            return response?.data;
          }

          return lev;
        })
      );
    } else {
      setLevels([response?.data, ...levels]);
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
      collection("gradeLevels")
        .then((res) => {
          const response = res.data.data;
          setLevels(response);
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
      <AddGrade
        title="Add Grade Level"
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
        Add Grade Level
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.levels}
          rows={levels}
          manageRow={manageLevels}
          canManage
        />
      </div>
    </>
  );
};

export default Grades;
