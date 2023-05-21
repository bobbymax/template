/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

import DataTables from "../../template/components/tables/DataTables";
import { columns } from "../../controllers/columns";
import { batchRequests, collection } from "../../controllers";
import axios from "axios";
import AddModules from "../modals/AddModules";
import Alert from "../../services/utils/alert";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [data, setData] = useState(undefined);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateModule = (mod) => {
    setData(mod);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setModules(
        modules.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setModules([response?.data, ...modules]);
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
      const modulesData = collection("modules");
      const rolesData = collection("roles");

      batchRequests([modulesData, rolesData])
        .then(
          axios.spread((...res) => {
            setModules(res[0].data.data);
            setRoles(res[1].data.data);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(modules);

  return (
    <>
      <AddModules
        title="Add Module"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ modules, roles }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Module
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.modules}
          rows={modules}
          manageRow={updateModule}
          canManage
        />
      </div>
    </>
  );
};

export default Modules;
