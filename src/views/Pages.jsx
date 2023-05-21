import React from "react";
import { CChart } from "@coreui/react-chartjs";

const Pages = () => {
  return (
    <>
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="custom__card">
            <CChart
              type="line"
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                ],
                datasets: [
                  {
                    label: "Booked Expenditures",
                    backgroundColor: "rgba(220, 220, 220, 0.2)",
                    borderColor: "rgba(220, 220, 220, 1)",
                    pointBackgroundColor: "rgba(220, 220, 220, 1)",
                    pointBorderColor: "#fff",
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                  {
                    label: "Actual Expenditures",
                    backgroundColor: "rgba(151, 187, 205, 0.2)",
                    borderColor: "rgba(151, 187, 205, 1)",
                    pointBackgroundColor: "rgba(151, 187, 205, 1)",
                    pointBorderColor: "#fff",
                    data: [50, 12, 28, 29, 7, 25, 12, 70, 60],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="custom__card">
            <CChart
              type="bar"
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                ],
                datasets: [
                  {
                    label: "GitHub Commits",
                    backgroundColor: "#f87979",
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                ],
              }}
              labels="months"
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom__card">
            <CChart
              type="doughnut"
              data={{
                labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
                datasets: [
                  {
                    backgroundColor: [
                      "#41B883",
                      "#E46651",
                      "#00D8FF",
                      "#DD1B16",
                    ],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom__card">
            <CChart
              type="polarArea"
              data={{
                labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
                datasets: [
                  {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                      "#FF6384",
                      "#4BC0C0",
                      "#FFCE56",
                      "#E7E9ED",
                      "#36A2EB",
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom__card">
            <CChart
              type="radar"
              data={{
                labels: [
                  "Eating",
                  "Drinking",
                  "Sleeping",
                  "Designing",
                  "Coding",
                  "Cycling",
                  "Running",
                ],
                datasets: [
                  {
                    label: "My First dataset",
                    backgroundColor: "rgba(220, 220, 220, 0.2)",
                    borderColor: "rgba(220, 220, 220, 1)",
                    pointBackgroundColor: "rgba(220, 220, 220, 1)",
                    pointBorderColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220, 220, 220, 1)",
                    data: [65, 59, 90, 81, 56, 55, 40],
                  },
                  {
                    label: "My Second dataset",
                    backgroundColor: "rgba(151, 187, 205, 0.2)",
                    borderColor: "rgba(151, 187, 205, 1)",
                    pointBackgroundColor: "rgba(151, 187, 205, 1)",
                    pointBorderColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151, 187, 205, 1)",
                    data: [28, 48, 40, 19, 96, 27, 100],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Pages;
