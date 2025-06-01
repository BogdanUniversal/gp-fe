import { useContext, useEffect, useRef, useState } from "react";
import { ModelContext } from "../Model/ModelContext";
import { api } from "../../User/api";
import Loader from "../Loader/Loader";
import "./view.css"

interface PerformanceData {
  fig_performance: string;
  fig_profile: string;
  fig_single_explanation: string;
}

declare global {
  interface Window {
    Plotly: any;
  }
}

function PlotContainer({
  htmlContent,
  className,
}: {
  htmlContent: string;
  className: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!htmlContent || !containerRef.current) return;

    if (!window.Plotly) {
      const plotlyScript = document.createElement("script");
      plotlyScript.src = "https://cdn.plot.ly/plotly-3.0.1.min.js";
      plotlyScript.async = true;
      plotlyScript.onload = () => renderPlot();
      document.head.appendChild(plotlyScript);
    } else {
      renderPlot();
    }

    function renderPlot() {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        const plotDiv = doc.querySelector(".plotly-graph-div");
        if (!plotDiv) return;

        const scriptContent = doc.querySelector("script")?.textContent || "";

        containerRef.current!.innerHTML = "";
        containerRef.current!.appendChild(plotDiv);

        const cleanScript = scriptContent
          .replace("window.PLOTLYENV=window.PLOTLYENV || {};", "")
          .replace(/if \(document\.getElementById\([^)]*\)\) \{/, "")
          .replace(/\};\s*$/, "");

        new Function(cleanScript)();
      } catch (error) {
        console.error("Error rendering plot:", error);
      }
    }
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className={className}
    />
  );
}

const Performance = () => {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const { model } = useContext(ModelContext);

  useEffect(() => {
    api
      .get("/models/get_performance", {
        params: { model_id: model?.id },
        withCredentials: true,
      })
      .then((response) => {
        setPerformanceData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching performance data:", error);
      });
  }, [model]);

  return (
    <div className="view__performance">
      <div className="view__performance__plots">
        <h3 className="view__performance__plots__title">Performance</h3>
        {performanceData?.fig_performance ? <PlotContainer
        className="view__performance__plots__plot"
          htmlContent={
            performanceData?.fig_performance
              ? performanceData?.fig_performance
              : ""
          }
        /> : <Loader />}
        <h3 className="view__performance__plots__title">Profile</h3>
        {performanceData?.fig_profile ? <PlotContainer
        className="view__performance__plots__plot"
          htmlContent={
            performanceData?.fig_profile ? performanceData?.fig_profile : ""
          }
        />  : <Loader />}
        <h3 className="view__performance__plots__title">Single Explanation</h3>
        {performanceData?.fig_single_explanation ? <PlotContainer
        className="view__performance__plots__plot"
          htmlContent={
            performanceData?.fig_single_explanation
              ? performanceData?.fig_single_explanation
              : ""
          }
        /> : <Loader />}
      </div>
    </div>
  );
};

export default Performance;
