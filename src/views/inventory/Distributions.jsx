/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { batchRequests, collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddDistribution from "../modals/AddDistribution";
import axios from "axios";

const Distributions = () => {
  const [distributions, setDistributions] = useState([]);
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageDistribution = (dist) => {
    setData(dist);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setDistributions(
        distributions.map((dist) => {
          if (dist.id == response?.data?.id) {
            return response?.data;
          }

          return dist;
        })
      );
    } else {
      setDistributions([response?.data, ...distributions]);
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
      const productData = collection("products");
      const distData = collection("distributions");
      const deptData = collection("departments");
      const staffData = collection("users");

      batchRequests([productData, distData, staffData, deptData])
        .then(
          axios.spread((...res) => {
            const prods = res[0].data.data;
            const dists = res[1].data.data;
            const staff = res[2].data.data;
            const depts = res[3].data.data;

            setProducts(prods.filter((prod) => prod.isDistributable));
            setDistributions(dists);
            setDepartments(depts);
            setUsers(staff);
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddDistribution
        title="Add Distribution"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ products, departments, users }}
        data={data}
      />
      <button
        type="button"
        className="custom__btn custom__btn-primary mb-3"
        onClick={() => setShow(true)}
      >
        <span className="material-icons-sharp">add_circle</span>
        Add Distribution
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.distributions}
          rows={distributions}
          manageRow={manageDistribution}
          canManage
        />
      </div>
    </>
  );
};

export default Distributions;
