import React from "react";

const MainSection = ({ pageName = "", children }) => {
  return (
    <main>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <h1 style={{ marginTop: "2rem", fontWeight: 700 }}>{pageName}</h1>
            </div>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainSection;
