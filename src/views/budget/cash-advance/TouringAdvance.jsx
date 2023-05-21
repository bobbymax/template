/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTables from "../../../template/components/tables/DataTables";
import { columns } from "../../../controllers/columns";
import { batchRequests, collection } from "../../../controllers";
import { useStateContext } from "../../../context/ContextProvider";
import AddTouringAdvance from "../../modals/AddTouringAdvance";
import Alert from "../../../services/utils/alert";

const TouringAdvance = () => {
  const [touringAdvances, setTouringAdvances] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState(undefined);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const { auth } = useStateContext();

  const manageTouringAdavce = (adv) => {
    setData(adv);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setTouringAdvances(
        touringAdvances.map((dist) => {
          if (dist.id == response?.data?.id) {
            return response?.data;
          }

          return dist;
        })
      );
    } else {
      setTouringAdvances([response?.data, ...touringAdvances]);
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
      const touringAdvancesData = collection("touringAdvances");
      const usersData = collection("users");

      batchRequests([touringAdvancesData, usersData])
        .then(
          axios.spread((...res) => {
            const advances = res[0].data.data;
            const staff = res[1].data.data;

            setTouringAdvances(
              advances.filter((adv) => adv.department_id == auth?.department_id)
            );
            setUsers(staff);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddTouringAdvance
        title="Add Touring Adavnce"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ users, auth }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Touring Advance
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.touringAdvance}
          rows={touringAdvances}
          manageRow={manageTouringAdavce}
          canManage
        />
      </div>
    </>
  );
};

export default TouringAdvance;
