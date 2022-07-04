import { Chart } from "react-google-charts";

function Graph({ data }) {
    return (
      <>
        {data.length === 1 ? (
          <h1>No data</h1>
        ) : (
          <Chart
          chartType="LineChart"
          data={ data }
          width="100%"
          height="400px"
        />
        )}
      </>
    )
}

export default Graph;
