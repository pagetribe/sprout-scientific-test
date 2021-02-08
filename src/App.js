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

  useEffect(() => {
    fetch("https://sprout-scientific-test.glitch.me/getDreams", {})
      .then(res => res.json())
      .then(response => {
        setIsLoaded(true)
        setItems(response)
      },
        (error) => {
          setIsLoaded(true)
          setError(error)
        })
  }, [])

  const onSubmit = (data) => {
    console.log(data)
    // console.log(formState)
    const fileName = data['file-upload'][0].name
    console.log("🚀 ~ file: App.js ~ line 16 ~ onSubmit ~ file", fileName)
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
          {item.id} {item.email} {item.file_name} {item.datetime}
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
