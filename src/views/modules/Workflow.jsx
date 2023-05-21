import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";

import DataTables from "../../template/components/tables/DataTables";

const Workflow = () => {
  const [processes, setProcesses] = useState([]);

  const navigate = useNavigate();

  const updateProcess = (proc) => {
    console.log(proc);
  };

  const createProcess = () => {
    navigate("/admin/workflow/process");
  };

  useEffect(() => {
    try {
      collection("processes")
        .then((res) => {
          setProcesses(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => createProcess()}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Workflow
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.processes}
          rows={processes}
          manageRow={updateProcess}
          canManage
        />
      </div>
    </>
  );
};

export default Workflow;
