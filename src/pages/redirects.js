import { useState, useEffect, useRef } from "react"
import Head from 'next/head'
import Layout from "../components/Layout"
import { useForm } from "react-hook-form";
import axios from "axios";
import AddRedirectModal from '../components/AddRedirectModal';
import EditRedirectModal from '../components/EditRedirectModal';
import { saveAs } from 'file-saver';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Redirects = ({ routes: initialRoutes = [] }) => {
  const [showAddRedirect, setShowAddRedirect] = useState(false);
  const [showEditRedirect, setShowEditRedirect] = useState(false);
  const [editModalData, setEditModalData] = useState({})
  const [routes, setRoutes] = useState(initialRoutes);
  const [checkboxStatus, setCheckboxStatus] = useState(initialRoutes.map(r => false));
  const [selectAllStatus, setselectAllStatus] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onAddRedirect = async ({ from, to }, setError) => {
    if (!checkDuplicate(routes, { source: from })) {
      if (setError) {
        return setError('from', {
          type: "manual",
          message: "Source already exists",
        });
      } else {
        return;
      }
    };
    try {
      const res = await axios.post(`/api/addRoute`, { from, to, mode: "redirect" })
      const route = res.data;
      console.log(route)
      setRoutes([...routes, route]);
    }
    catch (e) {
      const errors = e.response.data.errors
      console.log(e.response.data)
      if (!setError) return;
      for (const errorKey in errors) {
        setError(errorKey, {
          type: "manual",
          message: errors[errorKey],
        });
      }
    }
  }
  const getRoutes = async () => {
    try {
      const res = await axios.get(`/api/getRoutes`)
      const routes = res.data;
      setRoutes(routes);
    }
    catch (e) {
      console.log(e)
    }
  }
  const toggleSelectAll = (event) => {
    const checked = event.target.checked
    const newStatus = checkboxStatus.map(s => checked)
    setselectAllStatus(checked)
    setCheckboxStatus(newStatus)
  }
  const changeCheckbox = (index, value) => {
    const newStatus = [...checkboxStatus]
    newStatus[index] = value
    const allChecked = newStatus.every(item => item === true)
    setselectAllStatus(allChecked)
    setCheckboxStatus(newStatus)
  }
  useEffect(() => {
    setCheckboxStatus(routes.map(r => false))
  }, [routes])
  const onPerformAction = ({ action }) => {
    switch (action) {
      case "delete": {
        deleteSelectedRoutes()
        break;
      }
      case "export": {
        exportSelected()
        break;
      }
    }
  }
  const editRouteModal = (index) => {
    const route = { ...routes[index] }
    console.log(index, route)
    setEditModalData({
      from: route.source,
      to: route.target,
    })
    setShowEditRedirect(true)
  }
  const exportSelected = () => {
    const saveRoutes = routes.filter((r, i) => checkboxStatus[i] === true).map(r => {
      delete r.settings.certificate_path
      delete r.settings.key_path
      return r;
    })
    const blob = new Blob([JSON.stringify(saveRoutes)], { type: "application/json;charset=utf-8" })
    saveAs(blob, "redirects.json");
  }
  const importRoutes = () => {


  }
  const onEditRedirect = async ({ from, to }, setErrors) => {
    try {
      const res = await axios.put(`/api/editRoute`, { from, to, mode: 'redirect' })
      const editedRoute = res.data;
      const newRoutes = routes.map(route => {
        if (route.source === editedRoute.source) {
          return editedRoute
        }
        return route
      })
      setRoutes(newRoutes);
      setShowEditRedirect(false)
      setEditModalData({})
    }
    catch (e) {
      const errors = e.response.data.errors
      console.log(e.response.data)
      if (!setError) {
        return;
      }
      for (const errorKey in errors) {
        setError(errorKey, {
          type: "manual",
          message: errors[errorKey],
        });
      }
    }
  }
  const deleteSelectedRoutes = async () => {
    const deleteRoutes = routes.filter((r, i) => checkboxStatus[i] === true).map(route => route.source)
    try {
      const res = await axios.post(`/api/deleteRoutes`, { domains: deleteRoutes })
      const deleted = res.data.deleted;
      if (deleted) {
        const newRoutes = routes.filter(route => !deleted.includes(route.source))
        setRoutes(newRoutes);
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  const checkDuplicate = (routes, item) => {
    if (routes.length === 0) return true;
    return routes.filter(route => item.source === route.source).length === 0
  }
  const onImportFileChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (!file) return;
    var fr = new FileReader();
    fr.onload = () => {
      const routes = JSON.parse(fr.result)
      const promises = routes.map((route) => {
        return onAddRedirect(
          {
            from: route.source,
            to: route.target,
          }
        )
      })
      Promise.all(promises).then(() => {
        getRoutes()
      })
    }
    fr.readAsText(file);
  }
  const uploadRef = useRef()
  return (
    <Layout>
      <Head>
        <title>Manage your redirects | Redirct</title>
        <meta property="og:title" content="Redirects made easy" key="title" />
      </Head>
      <div className="container">

        <form onSubmit={handleSubmit(onPerformAction)}>
          <div className="actions d-flex justify-content-between my-3">
            <div className="d-flex align-items-center">
              <select className="action-select mr-2" defaultValue="" {...register("action", { required: true })}>
                <option value="">------</option>
                <option value="delete">Delete selected</option>
                <option value="export">Export selected as JSON</option>
              </select>
              <button className="btn-1" type="submit">Go</button>
            </div>
            <div className="d-flex align-items-center">
              <button className="mr-2 btn-1" onClick={() => setShowAddRedirect(true)}>
                Add a new redirect
              </button>
              <button className="btn-1" onClick={() => {
                uploadRef.current.click();
              }}>
                Import from JSON
              </button>

              <input ref={uploadRef} className="d-none" type='file' id='file' onChange={onImportFileChange} />
            </div>
          </div>
          <h1 className="h4">All Redirect Hosts</h1>
          <table className="routes">
            <thead>
              <tr>
                <th className="checkbox-col"><input type="checkbox" checked={selectAllStatus} onChange={toggleSelectAll} /></th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, i) => {
                return (
                  <tr className="route" key={`route-${i}`}>
                    <th className="checkbox-col"><input type="checkbox" checked={checkboxStatus[i]} onChange={(event) => changeCheckbox(i, event.target.checked)} /></th>
                    <th><button className="text-left btn-trans w-100" onClick={() => {
                      setEditModalData(route)
                      editRouteModal(i)
                    }
                    }>{route.source}</button></th>
                    <th className="font-weight-normal">{route.target}</th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </form>
      </div>
      {/* edit redirect  */}
      {showEditRedirect && <EditRedirectModal
        showAddRedirect={showEditRedirect}
        setShowAddRedirect={(arg) => {
          setShowEditRedirect(arg)
          setEditModalData({})
        }}
        onSubmit={onEditRedirect}
        {...editModalData}
        buttonText="Update redirect"
      />}
      {/* add redirect */}
      {showAddRedirect && <AddRedirectModal
        showAddRedirect={showAddRedirect}
        setShowAddRedirect={setShowAddRedirect}
        onSubmit={onAddRedirect}
      />}
    </Layout>
  )
}

export default Redirects


export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const response = await axios.get(`http://${process.env.CERYX_API_HOSTNAME}:5555/api/routes/`);
    const routes = response.data.filter(route => route.settings.mode === 'redirect')
    return {
      props: { routes }
    }
  }
})