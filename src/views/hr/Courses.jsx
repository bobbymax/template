/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../services/utils/alert";

import DataTables from "../../template/components/tables/DataTables";
import { collection } from "../../controllers";
import { columns } from "../../controllers/columns";
import AddCourse from "../modals/AddCourse";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageCourse = (course) => {
    setData(course);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setCourses(
        courses.map((course) => {
          if (course.id == response?.data?.id) {
            return response?.data;
          }

          return course;
        })
      );
    } else {
      setCourses([response?.data, ...courses]);
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
      collection("learningCategories")
        .then((res) => {
          const response = res.data.data;
          setCourses(response);
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
      <AddCourse
        title="Add Course"
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
        Add Course
      </button>
      <div className="custom__card">
        <DataTables
          pillars={columns.courses}
          rows={courses}
          manageRow={manageCourse}
          canManage
        />
      </div>
    </>
  );
};

export default Courses;
