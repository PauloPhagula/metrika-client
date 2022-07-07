import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DateTime } from "luxon";
import _ from 'lodash';
import config from './config'

const maxDate = `${DateTime.now().toFormat("yyyy-MM-dd")}T${DateTime.now().toFormat("T")}`;

function NewMetric() {
  const navigate = useNavigate();
  const [metricNames, setMetricNames] = useState([]);

  useEffect(() => {
    if (! _.isEmpty(metricNames)) {
      return;
    }

    axios
      .get(config.API_BASE_URL + "/metric_names" )
      .then((response) => {
        setMetricNames((prevMetricNames) => _.uniq([...response.data, ...prevMetricNames]));
      })
      .catch((error) => {
        // Swallow it. This request is not critical. It's data is just for suggestions.
      });
  }, []);

  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(null)
  const [showSubmitWarn, setShowSubmitWarn] = useState(false)
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false)

  const { register, formState: { errors }, handleSubmit, reset } = useForm()
  const onSubmit = (formData) => {
    const params = {
      metric: { ...formData },
    }

    axios
      .post(config.API_BASE_URL + '/metrics', params)
      .then((response) => {
        setSubmittedSuccessfully(true)
      })
      .catch((error) => {
        setSubmittedSuccessfully(false)
      })
  }

  useEffect(() => {
    if (submittedSuccessfully === true) {
      reset({keepDefaultValues: true})
    }
  }, [submittedSuccessfully])

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
                {...register('name', { required: true, pattern: /^(\w)+$/ })}
              />
              <div id="nameHelp" className="form-text">
                What was measured
              </div>
              <datalist id="defaultMetricNames">
                {metricNames.map((name) => (
                  <option value={name} key={name} />
                ))}
              </datalist>
              {errors.name?.type === "required" && <div className="invalid-feedback d-block">Metric name is required!</div>}
              {errors.name?.type === "pattern" && <div className="invalid-feedback d-block">Metric name may contain word chars only</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="value" className="form-label">
                Value
              </label>
              <input
                type="number"
                className="form-control"
                aria-describedby="valueHelp"
                {...register('metric_value', { required: true, min: 0, max: 100 })}
              />
              <div id="valueHelp" className="form-text">
                How much it measured.
              </div>
              {errors.metric_value?.type === "required" && <div className="invalid-feedback d-block">Metric value is required!</div>}
              {errors.metric_value?.type === "min" && <div className="invalid-feedback d-block">Metric value min is 0!</div>}
              {errors.metric_value?.type === "max" && <div className="invalid-feedback d-block">Metric value max is 100!</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="timepoint" className="form-label">
                Time
              </label>
              <input
                type="datetime-local"
                className="form-control"
                aria-describedby="timepointHelp"
                {...register('timepoint', { required: true, max: maxDate })}
              />
              <div id="timepointHelp" className="form-text">
                When was it measured.
              </div>
              {errors.timepoint?.type === "required" && <div className="invalid-feedback d-block">Metric time is required!</div>}
              {errors.timepoint?.type === "max" && <div className="invalid-feedback d-block">Metric time can't be in the future!</div>}
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
