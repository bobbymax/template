/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

import DataTables from "../../template/components/tables/DataTables";
import { columns } from "../../controllers/columns";
import AddRole from "../modals/AddRole";
import Alert from "../../services/utils/alert";
import { collection } from "../../controllers";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState(undefined);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateRole = (role) => {
    setData(role);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setRoles(
        roles.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setRoles([response?.data, ...roles]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  useEffect(() => {
    try {
      collection("roles")
        .then((res) => {
          setRoles(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddRole
        title="Add Role"
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
        Add Role
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.roles}
          rows={roles}
          manageRow={updateRole}
          canManage
        />
      </div>
    </>
  );
};

export default Roles;
