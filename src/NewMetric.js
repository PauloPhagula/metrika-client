import React, { useState, useEffect, useRef }  from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import { useForm } from "react-hook-form";
import moment from "moment";


const defaultDate = moment().format("YYYY-MM-DDThh:mm");

function NewMetric() {

  const {register, handleSubmit} = useForm()
  const onSubmit = (formData) => {

  };

  return (
    <>
      <div className="container">
        <div className="row">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
              <input type="text" className="form-control" aria-describedby="emailHelp"
                {...register("from", { required: true })}
              />
              <div id="emailHelp" className="form-text">What was measured</div>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Value</label>
              <input type="text" className="form-control" aria-describedby="emailHelp"
                {...register("from", { required: true })}
              />
              <div id="emailHelp" className="form-text">How much it measured.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Time</label>
              <input type="datetime-local" className="form-control" aria-describedby="emailHelp"
                {...register("from", { required: true, max: defaultDate })}
              />
              <div id="emailHelp" className="form-text">When was it measured.</div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default NewMetric;
