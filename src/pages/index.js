import { useState } from "react"
import Head from 'next/head'
import Layout from "../components/Layout"
import Modal from '../components/Modal/Modal'
import { useForm } from "react-hook-form";


const Home = ({ routes = [], data }) => {
  console.log(data);
  const [showAddRedirect, setShowAddRedirect] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onAddRedirect = ({ from, to, statusCode }) => {
    console.log(from, to, parseInt(statusCode))
  }
  return (
    <Layout>
      <div className="container">

        <div>
          <button onClick={() => setShowAddRedirect(true)}>
            Add a new redirect
          </button>
        </div>

        <table className="routes">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Status Code</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, i) => {
              return (
                <tr className="route" key={`route-${i}`}>
                  <th>{route.from}</th>
                  <th>{route.to}</th>
                  <th>{route.statusCode}</th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Modal
        show={showAddRedirect}
        close={() => setShowAddRedirect(false)}

      >
        <form onSubmit={handleSubmit(onAddRedirect)}>
          <div>
            <label className="d-block">from:</label>
            <input type="text" name="from" {...register("from", { required: true })} />
            {errors.from && <span>This field is required</span>}
          </div>
          <div>
            <label className="d-block">to:</label>
            <input type="text" name="to" {...register("to", { required: true })} />
            {errors.to && <span>This field is required</span>}
          </div>
          <div>
            <label className="d-block" htmlFor="">Status Code</label>
            <select {...register("statusCode")}>
              <option value="301">301 (permanent)</option>
              <option value="302">302 (temporary)</option>
            </select>
          </div>

          <button type="submit">Add new redirect</button>
        </form>
      </Modal>
    </Layout>
  )
}

export default Home

export const getServerSideProps = async () => {
  const res = await fetch('http://caddy:2019/config/');
  const data = await res.json();
  const routes = Object.values(data.apps.http.servers).reduce((sers, ser) => {
    const redirects = ser.routes.reduce((routes, route) => {
      if (route.handle[0].routes[0].handle[0].headers) {
        return [...routes, {
          from: route.match[0].host[0],
          to: route.handle[0].routes[0].handle[0].headers.Location[0],
          statusCode: route.handle[0].routes[0].handle[0].status_code,
        }]
      }
    }, [])
    if (redirects) {
      return [...sers, ...redirects]
    }
    return sers
  }, [])

  return {
    props: {
      routes,
      data
    }
  }
}