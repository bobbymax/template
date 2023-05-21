/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { batchRequests, collection, destroy } from "../../../controllers";
import { columns } from "../../../controllers/columns";
import Alert from "../../../services/utils/alert";
import DataTables from "../../../template/components/tables/DataTables";
import AddExpenditure from "../../modals/AddExpenditure";

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDestroy = (exp) => {
    if (exp?.status !== "pending") {
      Alert.warning(
        "Forbidden",
        "Expenditure cannot be deleted, payment process has started already!!"
      );
    } else {
      Alert.flash(
        "Are you sure?",
        "warning",
        "You would not be able to revert this!!"
      ).then((result) => {
        if (result.isConfirmed) {
          try {
            destroy("expenditures", exp.id)
              .then((res) => {
                const deleted = res.data.data;
                setExpenditures(
                  expenditures.filter((ex) => ex.id != deleted.id)
                );
                Alert.success("Deleted!!", res.data.message);
              })
              .catch((err) => {
                Alert.error("Oops!!", "Something went wrong!!");
                console.log(err.message);
              });
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setExpenditures(
        expenditures.map((mod) => {
          if (mod.id == response?.data?.id) {
            return response?.data;
          }

          return mod;
        })
      );
    } else {
      setSubBudgetHeads(
        subBudgetHeads.map((head) => {
          if (head.id == response?.data?.fund?.id) {
            return response?.data?.fund;
          }

          return head;
        })
      );
      setExpenditures([response?.data, ...expenditures]);
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
      const expsData = collection("expenditures");
      const subBudgetHeadsData = collection("subBudgetHeads");

      batchRequests([subBudgetHeadsData, expsData])
        .then(
          axios.spread((...res) => {
            const subs = res[0].data.data;

            setSubBudgetHeads(subs?.filter((sub) => sub?.fund));
            setExpenditures(res[1].data.data);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(expenditures);

  return (
    <>
      <AddExpenditure
        title="Create Expenditure"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ subBudgetHeads }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Create Expenditure
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.expenditures}
          rows={expenditures}
          destroy={handleDestroy}
        />
      </div>
    </>
  );
};

export default Expenditures;
