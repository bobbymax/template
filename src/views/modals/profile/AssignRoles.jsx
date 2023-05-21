/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { store } from "../../../controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Modal from "../../../template/components/modals/Modal";
import { Button } from "../../../template/components/forms/Inputs";

const AssignRoles = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
}) => {
  const animated = makeAnimated();

  const [selected, setSelected] = useState([]);
  const [user, setUser] = useState(null);
  const [appRoles, setAppRoles] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setSelected([]);
    setUser(null);
    setLoading(false);
    setAssigned([]);
    handleClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const request = {
      user_id: user?.id,
      roles: selected,
    };

    // console.log(request);

    try {
      store("assign/roles", request)
        .then((res) => {
          const response = res.data;
          handleSubmit({
            status: "Updated!!",
            data: response.data,
            message: response.message,
            action: "store",
          });
          handleModalClose();
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      dependencies !== undefined &&
      Array.isArray(dependencies?.roles) &&
      Array.isArray(dependencies?.appRoles) &&
      dependencies?.staff !== null
    ) {
      const { roles, staff, appRoles } = dependencies;
      setAssigned(roles);
      setUser(staff);
      setAppRoles(appRoles);
    }
  }, [dependencies]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="rows__badge">
                {assigned?.length > 0 ? (
                  assigned?.map((role, i) => (
                    <span className="role__badge" key={i}>
                      {role?.name?.toLowerCase()}
                    </span>
                  ))
                ) : (
                  <span className="role__badge">not assigned</span>
                )}
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <p className="label-font">Training Title</p>
              <Select
                components={animated}
                options={appRoles}
                placeholder="Select Roles"
                value={selected}
                onChange={setSelected}
                isSearchable
                isMulti
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`Add Roles`}
                isLoading={loading}
                icon="add_circle"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AssignRoles;
