import React, { useState, useEffect, useRef }  from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { Navigate } from 'react-router-dom';
import moment from "moment";

const API_BASE_URL = "http://127.0.0.1:3000/api/v1"
const defaultDate = moment().format("YYYY-MM-DDThh:mm");

function NewMetric() {
  const [submittedSuccessfuly, setSubmittedSuccessfuly] = useState(null);
  const [showSubmitWarn, setShowSubmitWarn] = useState(false);


  const {register, handleSubmit} = useForm()
  const onSubmit = (formData) => {
    const params = {
      "metric": { ...formData }
    }

    axios
      .post(API_BASE_URL + "/metrics", params)
      .then((response) => {setSubmittedSuccessfuly(true)})
      .catch((err) => {setSubmittedSuccessfuly(false)});
  };

  useEffect(() => {
    if (submittedSuccessfuly === false) {
      setShowSubmitWarn(true);
    } else {
      setShowSubmitWarn(false);
    }
    return () => {
      setShowSubmitWarn(false);
    };
  }, [submittedSuccessfuly]);


  return (
    <>
      {submittedSuccessfuly && <Navigate to="/" replace={true} />}

      <div className="container">
        <div className="row justify-content-md-center">
          <form className="form col-4" onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" aria-describedby="nameHelp" list="defaultMetricNames"
                {...register("name", { required: true })}
              />
              <div id="name" className="form-text">What was measured</div>
              <datalist id="defaultMetricNames">
                <option value="cpu_usage" />
              </datalist>
            </div>

            <div className="mb-3">
              <label htmlFor="value" className="form-label">Value</label>
              <input type="number" className="form-control" aria-describedby="valueHelp"
                {...register("metric_value", { required: true })}
              />
              <div id="valueHelps" className="form-text">How much it measured.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="timepoint" className="form-label">Time</label>
              <input type="datetime-local" className="form-control" aria-describedby="timepoint"
                {...register("timepoint", { required: true, max: defaultDate })}
              />
              <div id="timepointHelp" className="form-text">When was it measured.</div>
            </div>

            <div className="mb-3">
              <button type="submit" className="btn btn-primary d-block" id="refreshButton">
                  <i className="bi bi-plus" role="img" aria-label="Save"></i> Save
                </button>
            </div>

            {showSubmitWarn ?
              <div className="alert alert-warning" role="alert">
                An error happened submit this metric. Please try again!
              </div>
              : <span/>
            }
          </form>
        </div>
      </div>
    </>
  );
}

export default NewMetric;
