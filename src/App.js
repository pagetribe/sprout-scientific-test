import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Container, TextField, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './App.css'

function App() {
  const emailInputRef = useRef()
  const { register, handleSubmit, errors, formState, reset, watch } = useForm()
  const watchAllFields = watch()

  const onSubmit = (data) => {
    console.log(data)
    console.log(formState)
  }

  const handleReset = () => {
    reset()
    emailInputRef.current.focus()
  }

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
                    message: "Email is not valid."
                  }
                })
              }}
              // autoFocus
              error={!!errors.email}
              helperText={errors.email && errors.email.message}
            />

            {errors.email && <p>{errors.email.message}</p>}
          </Grid>
          <Grid item xs={6}>
            <Button
              style={{ textTransform: 'none' }}
              variant="contained"
              color="primary"
              // className={classes.button}
              startIcon={<AddIcon />}
            >
              Upload File
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" disabled={!formState.isDirty || watchAllFields.email === ""} onClick={handleReset}>Reset</Button>
            <Button color="primary" type="submit">Email</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default App
