import React, { useState, useEffect }  from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import moment from 'moment';

const API_BASE_URL = "http://127.0.0.1:3000/api/v1"
const defaultFromDate = moment().format("YYYY-MM-DDT00:00");
const defaultToDate = moment().format("YYYY-MM-DDTh:mm");

function getMetris() {
  return axios.get(API_BASE_URL + "/metrics").then((response) => response.data);
}

function getMetrisNames() {
  return axios.get(API_BASE_URL + "/metric_names").then((response) => response.data);
}

function Chart(props) {
  const [metricNames, setMetricNames] = useState(["all"]);
  const [loadingMetricNames, setLoadingMetricNames] = useState(true);

  useEffect(() => {
    setLoadingMetricNames(true);

    getMetrisNames().then((names) => {
      const newMetricNames = [...metricNames, ...names]
      setMetricNames(newMetricNames);
      setLoadingMetricNames(false);
    })
  }, []);

  const [metrics, setMetrics] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(true);


  const {register, handleSubmit} = useForm()
  const onSubmit = (formData) => {
    setLoadingGraph(true);

    getMetris().then((items) => {
      setMetrics(items);
      setLoadingGraph(false)
    })
  };

  useEffect(() => {
    metrics.map((metric) => {

    })
  }, [metrics]);

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">

          <div className="col">
            <label htmlFor="metric" className="form-label">Metric</label>
            <select className="form-select"id="metric" defaultValue="all" {...register("metric", { required: true })}>
              { metricNames.map((metric) => <option key={metric} value={metric}>{metric}</option>) }
            </select>
          </div>

          <div className='col'>
            <label htmlFor="from" className="form-label">From</label>
            <input type="datetime-local" id="from" className="form-control" defaultValue={defaultFromDate}
              {...register("from", { required: true, max: defaultToDate })} />
          </div>

          <div className='col'>
            <label htmlFor="to" className="form-label">To</label>
            <input type="datetime-local" id="to" className="form-control" defaultValue={defaultToDate}
              {...register("to", { required: true, max: defaultToDate})} />
          </div>

          <div className='col'>
            <label htmlFor="avg_criteria" className="form-label">Average By</label>
            <select className="form-select" id="avg_criteria" defaultValue="minute"
              {...register("avgCriteria", { required: true })}>
              <option value="minute">minute</option>
              <option value="hour">hour</option>
              <option value="day">day</option>
            </select>
          </div>

          <div className="col">
            <label htmlFor="refreshButton" className="form-label">&nbsp;</label>
            <button type="submit" className="btn btn-primary d-block" id="refreshButton">
              <i className="bi-arrow-clockwise" role="img" aria-label="GitHub"></i>
              Refresh
            </button>
          </div>
        </div>
      </form>


      <div className="graph">
        {loadingGraph === true ? (<p>Loading...</p>) : (<p>Loaded</p>)}
      </div>
    </>
  )
}

export default Chart
