import React from 'react'
import { useForm } from "react-hook-form";
import Modal from './Modal/Modal'

const AddRedirect = ({
  showAddRedirect,
  setShowAddRedirect,
  onSubmit,
  from = "",
  to = "",
  buttonText = "Update redirect"
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
          <input placeholder="example.com" className="w-100" type="text" name="from" value={from} readOnly {...register("from", { required: true })} />
          {errors.from && <span className="text-danger">{errors.from.message}</span>}
          <p><small>(Source is read-only)</small></p>
        </div>
        <div className="mb-3">
          <label className="d-block">To:</label>
          <input placeholder="https://google.com" className="w-100" type="text" name="to" defaultValue={to} {...register("to", { required: true })} />
          {errors.to && <span className="text-danger">{errors.to.message}</span>}
        </div>

        <div className="text-right pt-3">
          <button className="btn-1" type="submit">{buttonText}</button>
        </div>
      </form>
    </Modal>
  )
}

export default AddRedirect
