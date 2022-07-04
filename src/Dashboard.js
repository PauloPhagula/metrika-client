import React, { useState, useEffect, useRef }  from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import { DateTime } from "luxon";
import Chart from 'chart.js/auto';
import _ from 'lodash';
import config from './config'

function Dashboard() {
  // Form date helpers
  const defaultFromDate = `${DateTime.now().startOf("day").toFormat("yyyy-MM-dd")}T${DateTime.now().startOf("day").toFormat("T")}`
  const defaultToDate = `${DateTime.now().minus({hour: 1}).toFormat("yyyy-MM-dd")}T${DateTime.now().minus({hour: 1}).toFormat("T")}`;
  const maxDate = `${DateTime.now().toFormat("yyyy-MM-dd")}T${DateTime.now().toFormat("T")}`;

  const [metricNames, setMetricNames] = useState(["all"]);

  useEffect(() => {
    axios
      .get(config.API_BASE_URL + "/metric_names")
      .then((response) => response.data)
      .then((names) => {
        // FIXME: Something is causing re-render and thus loading of names happens twice, forcing me to use `_.uniq' here,
        setMetricNames((prevMetricNames) => _.uniq([...names, ...prevMetricNames]));
      }).catch((err) => {
        // FIXME: Handle err this request is critical for the component
      })
  }, []);

  const [stats, setStats] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(true);


  const {register, formState: { errors }, handleSubmit, reset} = useForm()

  const onSubmit = (formData) => {
    setLoadingGraph(true);

    // HACK: See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#setting_timezones
    formData.from = DateTime.fromISO(formData.from).toISO()
    formData.to = DateTime.fromISO(formData.to).toISO()
    axios
      .get(config.API_BASE_URL + "/stats", {params: formData} )
      .then((response) => response.data)
      .then((items) => {
        setStats(items);
        setLoadingGraph(false)
      })
  };

  // TODO: Extract chart into a standlone component rather than grabbing it with a ref and doing nasty stuff to it.
  const chartEl = useRef(null);

  useEffect(() => {
    let _stats = _.groupBy(stats, (stat) => stat.name);

    // TODO: Consider using useMemo
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
      <div className="container">
        <div className='row'>
          <div className="col-12 col-lg-4">
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12 col-lg-12 mb-3">
                  <label htmlFor="metric" className="form-label">Metric</label>
                  <select className="form-select"id="metric" defaultValue="all" {...register("metric", { required: true })}>
                    { metricNames.map((metric) => <option key={metric} value={metric}>{metric}</option>) }
                  </select>
                  {errors.metric?.type === "required" && <div className="invalid-feedback d-block">Metric is required!</div>}
                </div>

                <div className='col-12 col-lg-6 mb-3'>
                  <label htmlFor="from" className="form-label">From</label>
                  <input type="datetime-local" id="from" className="form-control" defaultValue={defaultFromDate}
                    {...register("from", { required: true, max: maxDate })}
                    />
                    {errors.from?.type === "required" && <div className="invalid-feedback d-block">From is required!</div>}
                    {errors.from?.type === "max" && <div className="invalid-feedback d-block">From time can't be in the future!</div>}
                </div>

                <div className='col-12 col-lg-6 mb-3'>
                  <label htmlFor="to" className="form-label">To</label>
                  <input type="datetime-local" id="to" className="form-control" defaultValue={defaultToDate}
                    {...register("to", { required: true, max: maxDate})} />
                  {errors.to?.type === "required" && <div className="invalid-feedback d-block">To is required!</div>}
                  {errors.to?.type === "max" && <div className="invalid-feedback d-block">To time can't be in the future!</div>}
                </div>

                <div className='col-12 col-lg-12 mb-3'>
                  <label htmlFor="by" className="form-label">Avg. By</label>
                  <select className="form-select" id="by" defaultValue="minute"
                    {...register("by", { required: true })}>
                    <option value="minute">minute</option>
                    <option value="hour">hour</option>
                    <option value="day">day</option>
                  </select>
                </div>

                <div className="col-12 col-lg-12 mb-3 text-center">
                  <button type="submit" className="btn btn-primary mt-3" id="refreshButton">
                    <i className="bi bi-arrow-clockwise" role="img" aria-label="Refresh"></i> Refresh
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="col-12 col-lg-8">
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-md-12 col-lg-4">
                  <div className="chart-container mt-2">
                    <canvas id="chart" ref={chartEl} aria-label="Metric's Graph" role="img"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
