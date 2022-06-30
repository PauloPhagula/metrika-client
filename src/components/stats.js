import React, { useState, useEffect, useRef }  from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import moment from 'moment';
import Chart from 'chart.js/auto';
import _ from 'lodash';

const API_BASE_URL = "http://127.0.0.1:3000/api/v1"
const defaultFromDate = moment().format("YYYY-MM-DDT00:00");
const defaultToDate = moment().format("YYYY-MM-DDThh:mm");

function getStats(params) {
  return axios.get(API_BASE_URL + "/stats", {params}).then((response) => response.data);
}

function getMetricNames() {
  return axios.get(API_BASE_URL + "/metric_names").then((response) => response.data);
}

function Stats(props) {
  const [metricNames, setMetricNames] = useState(["all"]);
  const [loadingMetricNames, setLoadingMetricNames] = useState(true);

  useEffect(() => {
    setLoadingMetricNames(true);

    getMetricNames().then((names) => {
      // TODO: Something is causing re-render and thus loading of names happening twice, forcing me to use `_.uniq' here,
      setMetricNames((prevMetricNames) => _.uniq([...names, ...prevMetricNames]));
      setLoadingMetricNames(false);
    })
  }, []);

  const [stats, setStats] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(true);


  const {register, handleSubmit} = useForm()

  const onSubmit = (formData) => {
    setLoadingGraph(true);

    getStats(formData).then((items) => {
      setStats(items);
      setLoadingGraph(false)
    })
  };

  // TODO: Extract chart into a standlone component rather than grabbing it with a ref and doing nasty stuff to it.
  const chartEl = useRef(null);

  useEffect(() => {
    let _stats = _.groupBy(stats, (stat) => stat.name);

    let dataSets = []
    for (let key in _stats) {
      let dataSet = {
        label: key,
        backgroundColor: Math.floor(Math.random()*16777215).toString(16),
        data: _stats[key]
      }
      dataSets.push(dataSet);
    }

    let chart = chartEl.current.getContext("2d");

    let myChart = new Chart(chart, {
      type: 'line',
      options: {
        scales: {
          x: {
            beginAtZero: true,
            type: "linear",
          }
        },
        plugins: {
          legend: {
              display: true,
              labels: {
                  color: 'rgb(255, 99, 132)'
              }
          }
        }
      },
      data: {
        datasets: dataSets
      }
    });

    return () => {
      myChart.destroy()
    }
  }, [stats]);

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
            <label htmlFor="by" className="form-label">Average By</label>
            <select className="form-select" id="by" defaultValue="minute"
              {...register("by", { required: true })}>
              <option value="minute">minute</option>
              <option value="hour">hour</option>
              <option value="day">day</option>
            </select>
          </div>

          <div className="col">
            <label htmlFor="refreshButton" className="form-label">&nbsp;</label>
            <button type="submit" className="btn btn-primary d-block" id="refreshButton">
              <i className="bi-arrow-clockwise" role="img" aria-label="Refresh"></i>
              Refresh
            </button>
          </div>
        </div>
      </form>

      <div className="container-fluid chart-container">
        <canvas id="chart" ref={chartEl} width="250" height="250" aria-label="Metric's Graph" role="img"></canvas>
      </div>
    </>
  )
}

export default Stats
