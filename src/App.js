import React from 'react'
import { Button, Container, TextField, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './App.css'

function App() {
  return (

    <Container maxWidth="sm" align="center">
      <form noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField id="standard-basic" label="Enter an email ID" />
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
            <Button color="primary" disabled>Reset</Button>
            <Button color="primary">Email</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default App
