import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash';
import config from './config'

const defaultDate = moment().format('YYYY-MM-DDThh:mm')

function NewMetric() {
  let navigate = useNavigate();
  const [metricNames, setMetricNames] = useState(['all']);
  const [hasLoadedMetricNames, setHasLoadedMetricNames] = useState(false);

  useEffect(() => {
    if (hasLoadedMetricNames === true) {
      return;
    }

    axios
      .get(config.API_BASE_URL + "/metric_names")
      .then((response) => response.data)
      .then((names) => {
        // FIXME: Something is causing re-render and thus loading of names happening twice, forcing me to use `_.uniq' here,
        setMetricNames((prevMetricNames) => _.uniq([...names, ...prevMetricNames]));
        setHasLoadedMetricNames(true);
      }).catch((err) => {
        // Swallow it. This request is not critical. It's data is just for suggestions.
      });
  }, []);

  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(null)
  const [showSubmitWarn, setShowSubmitWarn] = useState(false)
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false)

  const { register, handleSubmit } = useForm()
  const onSubmit = (formData) => {
    const params = {
      metric: { ...formData },
    }

    axios
      .post(config.API_BASE_URL + '/metrics', params)
      .then((response) => {
        setSubmittedSuccessfully(true)
      })
      .catch((err) => {
        setSubmittedSuccessfully(false)
      })
  }

  useEffect(() => {
    var timer;

    if (submittedSuccessfully == null) {
      return;
    }

    if (submittedSuccessfully === false) {
      setShowSubmitWarn(true)
      setShowSubmitSuccess(false)
    } else {
      setShowSubmitWarn(false)
      setShowSubmitSuccess(true)
      timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }

    return () => {
      setShowSubmitWarn(false)
      setShowSubmitSuccess(false)
      clearTimeout(timer)
    }
  }, [submittedSuccessfully])

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <form className="form col-12 col-lg-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                aria-describedby="nameHelp"
                list="defaultMetricNames"
                {...register('name', { required: true })}
              />
              <div id="name" className="form-text">
                What was measured
              </div>
              <datalist id="defaultMetricNames">
                {metricNames.map((name) => <option value={name} key={name} /> )}
              </datalist>
            </div>

            <div className="mb-3">
              <label htmlFor="value" className="form-label">
                Value
              </label>
              <input
                type="number"
                className="form-control"
                aria-describedby="valueHelp"
                {...register('metric_value', { required: true })}
              />
              <div id="valueHelps" className="form-text">
                How much it measured.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="timepoint" className="form-label">
                Time
              </label>
              <input
                type="datetime-local"
                className="form-control"
                aria-describedby="timepoint"
                {...register('timepoint', { required: true, max: defaultDate })}
              />
              <div id="timepointHelp" className="form-text">
                When was it measured.
              </div>
            </div>

            <div className="mb-3 mt-4 d-flex justify-content-center">
              <button type="submit" className="btn btn-primary d-block" id="saveButton">
               <i className="bi bi-plus" role="img" aria-label="Save"></i> Save
              </button>
            </div>

            {showSubmitWarn ? (
              <div className="alert alert-warning" role="alert">
                An error happened submit this metric. Please try again!
              </div>
            ) : (
              <span />
            )}

            {showSubmitSuccess === true ? (
              <div className="alert alert-success" role="alert">
                Metric submitted successfully. Redirecting to the dashboard ...
              </div>
            ) : (
              <span />
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default NewMetric
