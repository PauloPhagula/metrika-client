import React, { useState, useEffect, useRef }  from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import { DateTime } from "luxon";
// #import Chart from 'chart.js/auto';

import _ from 'lodash';
import config from './config'
import Graph from './Graph'

function Dashboard() {
  // Form date helpers
  const defaultFromDate = `${DateTime.now().startOf("day").toFormat("yyyy-MM-dd")}T${DateTime.now().startOf("day").toFormat("T")}`
  const defaultToDate = `${DateTime.now().minus({hour: 1}).toFormat("yyyy-MM-dd")}T${DateTime.now().minus({hour: 1}).toFormat("T")}`;
  const maxDate = `${DateTime.now().toFormat("yyyy-MM-dd")}T${DateTime.now().toFormat("T")}`;

  const chartEl = useRef(null);

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

  const {register, formState: { errors }, handleSubmit, reset} = useForm()

  const onSubmit = (formData) => {
    // HACK: See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#setting_timezones
    formData.from = DateTime.fromISO(formData.from).toISO()
    formData.to = DateTime.fromISO(formData.to).toISO()
    axios
      .get(config.API_BASE_URL + "/stats", {params: formData} )
      .then((response) => response.data)
      .then((items) => {
        setStats(items);
      })
  };

  const [googleData, setGoogleData] = useState([])

  useEffect(() => {
    let rawStats = stats
    let rows = []
    let names = _.map(_.uniqBy(stats, (stat) => stat.name), (value) => value.name)
    let zeroes = [];
    for (let i = 0; i < names.length; i++) {
      zeroes.push(0)
    }

    let statsByX = _.groupBy(stats, (stat) => stat.x)
    _.map(statsByX, (xStat, xStatkey) => {
      let row = _.zipObject(names, zeroes)
      row.x = xStatkey;
      for (let name of names) {
        let found = _.find(xStat, (o) => o.name == name);

        if (found) {
          row[name] = found.y
        } else {
          row[name] = 0
        }
      }

      rows.push(row)
    })

    let newNames = ["x", ...names];
    let dataset = _.map(rows, (row) => {
      let result = [];

      result.push(row.x)
      for (let name of names) {
        result.push(row[name])
      }
      return result
    })

    let _googleData = [newNames, ...dataset]
    console.log(_googleData)
    setGoogleData(_googleData);

  }, [stats])

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
                    <Graph data={googleData} />
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
