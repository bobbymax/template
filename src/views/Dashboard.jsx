import React from "react";
import MainSection from "../template/components/sections/MainSection";
import RightSection from "../template/components/sections/RightSection";

const Dashboard = () => {
  return (
    <>
      <MainSection pageName="Dashboard"></MainSection>
      <RightSection>
        <h2>Right Side</h2>
      </RightSection>
    </>
  );
};

export default Dashboard;
