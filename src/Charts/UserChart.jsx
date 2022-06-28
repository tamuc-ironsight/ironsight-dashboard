import React, { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { Chart, registerables } from "chart.js";

import { UserChartOptions } from "../chartConfigs/chartConfigs";

import { Line } from "react-chartjs-2";
import { getdata } from "../chartConfigs/chartData";
import styled from "styled-components";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement);

Chart.register(...registerables);

const StyledLine = styled(Line)`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWrapper = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 700px;
  height: 500px;
  margin: 0 auto;
`;

{
  /* <div className="chart-container" style = {{ position: "relative", width: 700, height: 500 }}></div> */
}

const UserChart = () => {
  const [labelsData, setLabelsData] = useState([]);
  const [confirmedData, setConfirmedData] = useState([]);

  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 30, 400);

    gradient.addColorStop(0, "#e570e7");
    gradient.addColorStop(0.35, "rgba(255, 0, 255, 0.75");
    gradient.addColorStop(0.95, "#9251BA");

    return {
      labels: labelsData,
      datasets: [
        {
          fill: true,
          label: "UserActivity",
          data: confirmedData,
          backgroundColor: gradient,
          borderColor: gradient,
          borderWidth: 0.5,
        },
      ],
    };
  };

  const getChartData = async () => {
    try {
      let labelsArray = [];
      let confirmedArray = [];
      let deathsArray = [];
      const response = await getdata();
      response.forEach((element) => {
        labelsArray.push(element.reportDate);
        confirmedArray.push(element.confirmed.total);
        deathsArray.push(element.deaths.total);
      });
      setLabelsData(labelsArray);
      setConfirmedData(confirmedArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <StyledWrapper>
      <StyledLine data={data} options={UserChartOptions} />
    </StyledWrapper>
  );
};

export default UserChart;
