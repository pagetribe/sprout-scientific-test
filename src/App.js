import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button, Box, TextField, Grid, Fab, Grow, Typography, createMuiTheme, ThemeProvider, Divider, makeStyles } from '@material-ui/core'
import teal from '@material-ui/core/colors/teal'
import AddIcon from '@material-ui/icons/Add'
import './App.css'
import LinearProgressWithLabel from './components/LinearProgressWithLabel'
import SubmissionsList from './components/SubmissionsList'

function App() {
  const emailInputRef = useRef()
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [fetchSubmissionsError, setfetchSubmissionsError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { register, handleSubmit, errors, formState, reset, watch } = useForm()
  const watchAllFields = watch()

  const fetchSubmissions = () => {
    axios.get("https://sprout-scientific-test.glitch.me/getEmails")
      .then(response => {
        setIsLoaded(true)
        setItems(response.data)
        setfetchSubmissionsError(null)
      })
      .catch(error => {
        // console.error(error)
        setIsLoaded(true)
        setfetchSubmissionsError(error)
      })
  }

  // useEffect(() => { fetchSubmissions() }, [])
  useEffect(() => {
    const source = axios.CancelToken.source()
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("https://sprout-scientific-test.glitch.me/getEmails", {
          cancelToken: source.token
        })
        setIsLoaded(true)
        setItems(response.data)
        setfetchSubmissionsError(null)
      } catch (error) {
        if (axios.isCancel(error)) {
          // console.log('cancelled get request - caught cancel')
        } else {
          setIsLoaded(true)
          setfetchSubmissionsError(error)
        }
      }
    }
    fetchSubmissions()
    return () => {
      source.cancel()
    }

  }, [])

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
        // console.log(JSON.stringify(response))
        resetForm()
        setShowSuccessMessage(true)
        fetchSubmissions()
        setTimeout(() => setShowSuccessMessage(false), 3000)
        setError(null)
      })
      .catch(error => {
        if (!window.navigator.onLine) {
          setError({ message: 'Attachment failed to upload. Check you connection.' })
          console.log('Attachment failed to upload. Check you connection.')
        } else {
          setError({ message: 'Server failure. Try again.' })
          console.log('Server failure. Try again.')
        }
        console.log('post error: ', error)
      })
  }

  const handleReset = () => {
    reset()
    emailInputRef.current.focus()
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: teal[500],
      },
      secondary: {
        main: "#00e5ff",
      },
    },
    typography: {
      allVariants: {
        color: '#131313'
      },
    },
  })

  theme.overrides = {
    MuiButton: {
      root: {
        borderRadius: 2,
        textTransform: 'none',
        padding: '10px 31px',
      }
    }
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    backgroundContainer: {
      background: "#E5E3E3",
      [theme.breakpoints.down('xs')]: {
        marginTop: "16px",
      },
      marginTop: "30px",
      maxWidth: "670px",
      padding: "30px",
    },
    submissionsBackgroundContainer: {
      [theme.breakpoints.down('xs')]: {
        padding: "0px 28px",
      },
      maxWidth: "670px",
    },
    uploadButton: {
      [theme.breakpoints.down('xs')]: {
        marginRight: "0px",
      },
    }
  }))

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Box display="flex" justifyContent="center">
          <Grid container item spacing={3} xs={11} sm={10} className={classes.backgroundContainer}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ display: 'contents' }}>

              <Grid item xs={8} sm={7}>
                <TextField id="standard-basic" label="Enter an email ID" name="email" type="email" fullWidth
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

              <Grid item xs={4} sm={5} style={{ textAlign: "right" }}>
                <Box mt={1} mr={2} className={classes.uploadButton}>
                  <label htmlFor="file-upload">
                    <input ref={register}
                      data-testid="file-upload"
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      style={{ display: 'none' }}
                    ></input>
                    <Fab color="primary" aria-label="add" size="small" component="span">
                      <AddIcon />
                    </Fab>
                  </label>
                </Box>
              </Grid>

              <Box width='100%' px={1} py={5}>
                <Grow in={showProgress}>
                  <Grid item container xs={12} justify="center">
                    <Grid item xs={12} style={{ textAlign: "left" }}>
                      <Typography variant="subtitle2">{fileName ? fileName : 'no file'}</Typography>
                    </Grid>
                    <Grid item xs={12} >
                      {showProgress ? <LinearProgressWithLabel value={progress} /> : <>'&nbsp'</>}
                    </Grid>
                  </Grid>
                </Grow>

                <Grow in={showSuccessMessage}>
                  <Grid item container xs={12} justify="center">
                    <Typography variant="subtitle2">{showSuccessMessage ? 'Success! Email Sent' : <>'&nbsp'</>}</Typography>
                  </Grid>
                </Grow>

                <Grid item container xs={12} justify="center" style={{ textAlign: "center" }}>
                  {error && <Typography variant="subtitle2" color="error">{error.message}</Typography>}
                </Grid>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={6} container justify="flex-end">
                  <Button color="primary" variant="contained" disableElevation disabled={!formState.isDirty || watchAllFields.email === ""} onClick={handleReset}>Reset</Button>
                </Grid>
                <Grid item xs={6} container justify="flex-start">
                  <Button color="primary" variant="contained" type="submit">Email</Button>
                </Grid>
              </Grid>
            </form>
          </Grid>{/* end grey wrapper background div */}
        </Box>


        <Box display="flex" justifyContent="center">
          <Grid container item spacing={3} xs={11} sm={10} className={classes.submissionsBackgroundContainer}>
            <Grid item xs={12} style={{ textAlign: "center", padding: 0 }}>
              <Box mt={8}>
                <Divider variant="middle" />
                <Box mt={3} mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Submissions List
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <SubmissionsList error={fetchSubmissionsError} items={items} isLoaded={isLoaded} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </ThemeProvider >
  )
}

export default App
