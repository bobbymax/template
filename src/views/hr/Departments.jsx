/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddDepartment from "../modals/AddDepartment";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageDepartment = (dept) => {
    setData(dept);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setDepartments(
        departments.map((dept) => {
          if (dept.id == response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setDepartments([response?.data, ...departments]);
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
      collection("departments")
        .then((res) => {
          const response = res.data.data;
          setDepartments(response);
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
      <AddDepartment
        title="Add Department"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ departments }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Department
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.departments}
          rows={departments}
          manageRow={manageDepartment}
          canManage
        />
      </div>
    </>
  );
};

export default Departments;
