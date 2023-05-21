/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import { useNavigate } from "react-router-dom";

const Staff = () => {
  const [users, setUsers] = useState([]);
  // const [show, setShow] = useState(false);
  // const [data, setData] = useState(undefined);
  // const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const manageUser = (usr) => {
    // setData(usr);
    // setIsUpdating(true);
    // setShow(true);

    navigate("/admin/manage/staff/profile", {
      state: {
        staff: usr,
      },
    });
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setUsers(
        users.map((usr) => {
          if (usr.id == response?.data?.id) {
            return response?.data;
          }

          return usr;
        })
      );
    } else {
      setUsers([response?.data, ...users]);
    }

    Alert.success(response?.status, response?.message);
    // setIsUpdating(false);
    // setShow(false);
    // setData(undefined);
  };

  useEffect(() => {
    try {
      collection("users")
        .then((res) => {
          const response = res.data.data;
          setUsers(response);
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
      <button type="button" className="custom__btn custom__btn-primary mb-3">
        <span className="material-icons-sharp">add_circle</span>
        Add Staff
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.staff}
          rows={users}
          manageRow={manageUser}
          canManage
        />
      </div>
    </>
  );
};

export default Staff;
