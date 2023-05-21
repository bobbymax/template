/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Alert from "../../services/utils/alert";
import { Button } from "../../template/components/forms/Inputs";
import AssignRoles from "../modals/profile/AssignRoles";
import { collection, batchRequests } from "../../controllers";
import axios from "axios";
import UpdateProfile from "../modals/profile/UpdateProfile";
import PasswordReset from "../modals/profile/PasswordReset";

const ManageStaff = () => {
  const initialModalState = {
    roles: false,
    passwordReset: false,
    record: false,
    service: false,
  };

  const [modalState, setModalState] = useState(initialModalState);
  const [staff, setStaff] = useState(null);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [appRoles, setAppRoles] = useState([]);
  const [name, setName] = useState("");

  const { state } = useLocation();

  const handleSubmit = (response) => {
    setStaff(response.data);
    setName(response.data?.name);

    Alert.success(response?.status, response?.message);
    handleModalClose();
  };

  const handleModalClose = () => {
    setModalState(initialModalState);
  };

  useEffect(() => {
    if (state !== null && state?.staff) {
      const { staff } = state;

      setStaff(staff);
      setName(staff?.name);
      setRoles(staff?.roles);
    }
  }, [state]);

  useEffect(() => {
    try {
      const rolesData = collection("roles");
      const departmentsData = collection("departments");
      const gradeLevelsData = collection("gradeLevels");

      batchRequests([rolesData, departmentsData, gradeLevelsData])
        .then(
          axios.spread((...res) => {
            const roles = res[0].data.data;
            const departments = res[1].data.data;
            const gradeLevels = res[2].data.data;

            const selected = [];

            roles?.map((role) =>
              selected.push({
                value: role?.id,
                label: role?.name,
              })
            );

            setAppRoles(selected);
            setDepartments(departments);
            setGradeLevels(gradeLevels);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AssignRoles
        title="Add Roles to Staff"
        show={modalState.roles}
        handleClose={handleModalClose}
        handleSubmit={handleSubmit}
        dependencies={{ roles, staff, appRoles }}
      />
      <UpdateProfile
        title="Update Staff Record"
        show={modalState.record}
        handleClose={handleModalClose}
        handleSubmit={handleSubmit}
        dependencies={{ departments, gradeLevels }}
        data={staff}
      />
      <PasswordReset
        title="Reset Staff Password"
        show={modalState.passwordReset}
        handleClose={handleModalClose}
        handleSubmit={handleSubmit}
        data={staff}
      />
      <div className="manage_staff_area">
        <div className="row">
          <div className="col-md-8">
            <div className="user__details">
              <div className="user-card__header">
                <h3>
                  <span className="material-icons-sharp">person</span> User
                  Profile
                </h3>
              </div>
              <div className="user-card__body">
                <table>
                  <tbody>
                    <tr>
                      <td>Staff ID:</td>
                      <td className="table__content">{staff?.staff_no}</td>
                    </tr>
                    <tr>
                      <td>Department:</td>
                      <td className="table__content">
                        {staff?.department_name}
                      </td>
                    </tr>
                    <tr>
                      <td>Roles:</td>
                      <td>
                        <div className="rows__badge">
                          {roles?.length > 0 ? (
                            roles?.map((role, i) => (
                              <span className="role__badge" key={i}>
                                {role?.name?.toLowerCase()}
                              </span>
                            ))
                          ) : (
                            <span className="role__badge">none</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td className="table__content">{staff?.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="button__cards">
              <Button
                text="Block Account"
                variant="dark"
                handleClick={() => console.log("block")}
              />
              <Button
                text="Reset Password"
                variant="danger"
                handleClick={() =>
                  setModalState({ ...modalState, passwordReset: true })
                }
              />
              <Button
                text="Update Record"
                handleClick={() =>
                  setModalState({ ...modalState, record: true })
                }
              />
              <Button
                text="Assign Roles"
                variant="secondary"
                handleClick={() =>
                  setModalState({ ...modalState, roles: true })
                }
              />
              <Button
                text="Print Service Record"
                variant="info"
                handleClick={() => console.log("here")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageStaff;
