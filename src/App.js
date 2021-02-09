import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Container, TextField, Grid, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './App.css'

function App() {
  const emailInputRef = useRef()
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { register, handleSubmit, errors, formState, reset, watch } = useForm()
  const watchAllFields = watch()

  const handleServerErrors = (res) => {
    if (!res.ok) { throw new Error(`Network response was not ok: ${res.status}`) }
    return res
  }

  const fetchSubmissions = () => {
    fetch("https://sprout-scientific-test.glitch.me/getEmails", {})
      .then(handleServerErrors)
      .then(res => res.json())
      .then(response => {
        setIsLoaded(true)
        setItems(response)
        setError(null)
      },
        (error) => {
          setIsLoaded(true)
          setError(error)
        })
  }


  useEffect(() => { fetchSubmissions() }, [])

  const onSubmit = (data) => {
    console.log(data)
    // console.log(formState)
    const fileName = data['file-upload'][0].name
    const email = data.email
    const bodyData = { email: email, file_name: fileName }
    console.log(bodyData)

    fetch("https://sprout-scientific-test.glitch.me/addEmail", {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: { "Content-Type": "application/json" }
    })
      .then(handleServerErrors)
      .then(res => res.json())
      .then(response => {
        console.log(JSON.stringify(response))
        fetchSubmissions()
      },
        (error) => {
          console.log('post errror: ', error)
        }
      )
  }

  const handleReset = () => {
    reset()
    emailInputRef.current.focus()
  }

  let emailList

  if (error) {
    emailList = <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    emailList = <div>Loading...</div>
  } else (
    emailList =
    <ul>
      {items.map(item =>
        <li key={item.id}>
          {item.id} {item.email} {item.file_name} {new Date(`${item.created_at} UTC`).toLocaleString()}
        </li>)}
    </ul>
  )


  return (

    <Container maxWidth="sm" align="center">
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
              // autoFocus
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


            {/* <Button
              style={{ textTransform: 'none' }}
              variant="contained"
              color="primary"
              // className={classes.button}
              startIcon={<AddIcon />}
            >
              Upload File
            </Button> */}
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" disabled={!formState.isDirty || watchAllFields.email === ""} onClick={handleReset}>Reset</Button>
            <Button color="primary" type="submit">Email</Button>
          </Grid>
        </Grid>

        {errors.email && <p>{errors.email.message}</p>}

      </form>


      {emailList}
    </Container >
  )
}

export default App
