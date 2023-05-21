/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import Alert from "../../services/utils/alert";
import DataTables from "../../template/components/tables/DataTables";
import AddSetting from "../modals/AddSetting";

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSetting = (setting) => {
    setData(setting);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setSettings(
        settings.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setSettings([response?.data, ...settings]);
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
      collection("settings")
        .then((res) => {
          setSettings(res.data.data);
        })
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddSetting
        title="Add Setting"
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
        Add Setting
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.settings}
          rows={settings}
          manageRow={handleSetting}
          canManage
        />
      </div>
    </>
  );
};

export default Settings;
