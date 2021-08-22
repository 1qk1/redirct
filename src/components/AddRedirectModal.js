import React from 'react'
import { useForm } from "react-hook-form";
import Modal from './Modal/Modal'

const AddRedirect = ({
  showAddRedirect,
  setShowAddRedirect,
  onSubmit,
  from = "",
  to = "",
  statusCode = "301",
  enforceHTTPS = true,
  buttonText = "Add new redirect"
}) => {
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
  return (
    <Modal
      show={showAddRedirect}
      close={() => setShowAddRedirect(false)}
    >
      <form onSubmit={handleSubmit((data) => onSubmit(data, setError))}>
        <div className="mb-3">
          <label className="d-block">From:</label>
          <input placeholder="example.com" className="w-100" type="text" name="from" defaultValue={from} {...register("from", { required: true })} />
          {errors.from && <span className="text-danger">{errors.from.message}</span>}

        </div>
        <div className="mb-3">
          <label className="d-block">To:</label>
          <input placeholder="https://google.com" className="w-100" type="text" name="to" defaultValue={to} {...register("to", { required: true })} />
          {errors.to && <span className="text-danger">{errors.to.message}</span>}
        </div>
        <div className="mb-4">
          <label className="d-block" htmlFor="">Status Code</label>
          <select defaultValue={statusCode} {...register("statusCode")}>
            <option value="301">301 (permanent)</option>
            <option value="302">302 (temporary)</option>
          </select>
        </div>
        <div className="mt-2 mb-4">
          <label className="mr-2 d-inline-block">Enforce HTTPS
            <input className="ml-2" defaultChecked={enforceHTTPS} {...register("enforceHTTPS")} type="checkbox" name="enforceHTTPS" />
          </label>

        </div>

        <button className="btn-1" type="submit">{buttonText}</button>
      </form>
    </Modal>
  )
}

export default AddRedirect
