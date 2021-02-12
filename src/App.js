import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button, Container, TextField, Grid, Fab, Grow, CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './App.css'
import LinearProgressWithLabel from './components/LinearProgressWithLabel'
import SubmissionsList from './components/SubmissionsList'

function App() {
  const emailInputRef = useRef()
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { register, handleSubmit, errors, formState, reset, watch } = useForm()
  const watchAllFields = watch()

  const handleServerErrors = (res) => {
    if (!res.ok) { throw new Error(`Network response was not ok: ${res.status}`) }
    return res
  }

  const fetchSubmissions = () => {
    axios.get("https://sprout-scientific-test.glitch.me/getEmails")
      .then(response => {
        setIsLoaded(true)
        setItems(response.data)
        setError(null)
      })
      .catch(error => {
        console.error(error)
        setIsLoaded(true)
        setError(error)
      })
    // fetch("https://sprout-scientific-test.glitch.me/getEmails", {})
    //   .then(handleServerErrors)
    //   .then(res => res.json())
    //   .then(response => {
    //     setIsLoaded(true)
    //     setItems(response)
    //     setError(null)
    //   },
    //     (error) => {
    //       setIsLoaded(true)
    //       setError(error)
    //     })
  }


  useEffect(() => { fetchSubmissions() }, [])

  const onSubmit = (data) => {
    console.log(data)
    if (data['file-upload'][0]) {
      setFileName(data['file-upload'][0].name)
      setShowProgress(true)
    }
    const formData = new FormData()
    formData.append("email", data.email)
    if (data['file-upload']) {
      formData.append("file", data['file-upload'][0])
    }

    const config = {
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percentCompleted)
        console.log(percentCompleted)
      }
    }

    const resetForm = () => {
      reset()
      setFileName(null)
      setShowProgress(false)
      emailInputRef.current.focus()
    }

    axios.post("https://sprout-scientific-test.glitch.me/addEmail", formData, config)
      .then(response => {
        console.log(JSON.stringify(response))
        resetForm()
        setShowSuccessMessage(true)
        fetchSubmissions()
        setTimeout(() => setShowSuccessMessage(false), 4000)
      })
      .catch(error => {
        if (!window.navigator.onLine) {
          console.log('Attachment failed to upload. Check you connection.')
        } else {
          console.log('Server failure. Try again.')
        }
        // if (!!error.isAxiosError && !error.response) {
        console.log('post error: ', error)
      })



    // fetch("https://sprout-scientific-test.glitch.me/addEmail", {
    //   method: "POST",
    //   body: formData
    // })
    //   .then(handleServerErrors)
    //   .then(res => res.json())
    //   .then(response => {
    //     console.log(JSON.stringify(response))
    //     fetchSubmissions()
    //   },
    //     (error) => {
    //       console.log('post errror: ', error)
    //     }
    //   )
  }

  const handleReset = () => {
    reset()
    emailInputRef.current.focus()
  }

  // let emailList

  // if (error) {
  //   emailList = <div>Error: {error.message}</div>
  // } else if (!isLoaded) {
  //   emailList = <div><CircularProgress /> Loading submissions...</div>
  // } else (
  //   emailList =
  //   <ul>
  //     {items.map(item =>
  //       <li key={item.id}>
  //         {item.id} {item.email} {item.file_name} {new Date(`${item.created_at} UTC`).toLocaleString()}
  //       </li>)}
  //   </ul>
  // )


  return (

    <Container maxWidth="sm" align="center" spacing={3}>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField id="standard-basic" label="Enter an email ID" name="email" type="email"
              inputRef={(e) => {
                emailInputRef.current = e
                register(e, {
                  required: true,
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email Invalid."
                  }
                })
              }}
              error={!!errors.email}
              helperText={errors.email && errors.email.message}
            />
          </Grid>
          <Grid item xs={6}>
            <label htmlFor="file-upload">
              <input ref={register}
                id="file-upload"
                name="file-upload"
                type="file"
                style={{ display: 'none' }}
              ></input>
              <Fab color="primary" aria-label="add" size="small" component="span">
                <AddIcon />
              </Fab>
            </label>
          </Grid>

          <Grow in={showProgress}>
            <Grid container>
              <Grid item xs={12} style={{ textAlign: "left" }}>
                {fileName && <p>{fileName}</p>}
              </Grid>
              <Grid item xs={12}>
                <LinearProgressWithLabel value={progress} />
              </Grid>
            </Grid>
          </Grow>

          <Grid item xs={12}>
            <Button color="primary" disabled={!formState.isDirty || watchAllFields.email === ""} onClick={handleReset}>Reset</Button>
            <Button color="primary" type="submit">Email</Button>
          </Grid>
        </Grid>

        {errors.email && <p>{errors.email.message}</p>}

        <Grow in={showSuccessMessage}>
          <p>Success! Email Sent</p>
        </Grow>

      </form>
      <SubmissionsList error={error} items={items} isLoaded={isLoaded} />
      {/* {emailList} */}
    </Container >
  )
}

export default App
