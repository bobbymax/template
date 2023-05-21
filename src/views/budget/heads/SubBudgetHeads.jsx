/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import DataTables from "../../../template/components/tables/DataTables";
import { columns } from "../../../controllers/columns";
import { batchRequests, collection } from "../../../controllers";
import axios from "axios";
import Alert from "../../../services/utils/alert";
import AddSubBudgetHead from "../../modals/AddSubBudgetHead";

const SubBudgetHeads = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageSubBudgetHeads = (subBudgetHeads) => {
    setData(subBudgetHeads);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setSubBudgetHeads(
        subBudgetHeads.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setSubBudgetHeads([response?.data, ...subBudgetHeads]);
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
      const subBudgetData = collection("subBudgetHeads");
      const budgetData = collection("budgetHeads");
      const departmentsData = collection("departments");

      batchRequests([budgetData, departmentsData, subBudgetData])
        .then(
          axios.spread((...res) => {
            setBudgetHeads(res[0].data.data);
            setDepartments(res[1].data.data);
            setSubBudgetHeads(res[2].data.data);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(subBudgetHeads);

  return (
    <>
      <AddSubBudgetHead
        title="Add Sub-Budget Head"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ budgetHeads, departments }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Sub-Budget Head
      </button>

      <div className="custom__card">
        <DataTables
          pillars={columns.subBudgetHeads}
          rows={subBudgetHeads}
          manageRow={manageSubBudgetHeads}
          canManage
        />
      </div>
    </>
  );
};

export default SubBudgetHeads;
