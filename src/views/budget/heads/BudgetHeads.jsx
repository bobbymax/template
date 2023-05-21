/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { collection } from "../../../controllers";
import { columns } from "../../../controllers/columns";
import Alert from "../../../services/utils/alert";
import DataTables from "../../../template/components/tables/DataTables";
import AddBudgetHead from "../../modals/AddBudgetHead";

const Budget = () => {
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageBudgetHeads = (budgetHead) => {
    setData(budgetHead);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setBudgetHeads(
        budgetHeads.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setBudgetHeads([response?.data, ...budgetHeads]);
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
      collection("budgetHeads")
        .then((res) => {
          const response = res.data.data;
          setBudgetHeads(response);
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
      <AddBudgetHead
        title="Add Budget Head"
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
        Add Budget Head
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.budgetHeads}
          rows={budgetHeads}
          manageRow={manageBudgetHeads}
          canManage
        />
      </div>
    </>
  );
};

export default Budget;
