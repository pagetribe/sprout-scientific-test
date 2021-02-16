import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button, Container, Box, TextField, Grid, Fab, Grow, Typography, createMuiTheme, ThemeProvider, Divider, makeStyles, Paper } from '@material-ui/core'
import teal from '@material-ui/core/colors/teal'
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

              <Box width='100%' px={2} py={5}>
                <Grid container>
                  <Grow in={showProgress}>
                    <Grid container>
                      <Grid item xs={12} style={{ textAlign: "left" }}>
                        <Typography variant="subtitle2">{fileName ? fileName : 'no file'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgressWithLabel value={progress} />
                      </Grid>
                    </Grid>
                  </Grow>
                  <Grow in={showSuccessMessage}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Success! Email Sent</Typography>
                    </Grid>
                  </Grow>
                  {errors.email && <Typography variant="subtitle2">{errors.email.message}</Typography>}
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


          </Grid>{/* grey wrapper background div */}

        </Box>

        <Box display="flex" justifyContent="center">
          <Grid container item spacing={3} xs={11} sm={10}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Box mt={8} mb={2}>
                <Box mb={4}><Divider variant="middle" /></Box>
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Submissions List
                  </Typography>
                </Box>
                <SubmissionsList error={error} items={items} isLoaded={isLoaded} />
                {/* <Grid item style={{ textAlign: "center" }}>
                </Grid> */}
              </Box>
            </Grid>
          </Grid>
        </Box>

      </div>
    </ThemeProvider >
  )




  // return (
  //   <ThemeProvider theme={theme}>
  //     <Container align="center" justify="center">
  //       <Box width={631} bgcolor="#E5E3E3" mt={5} p={5}>
  //         <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>

  //           <Grid container spacing={3}>
  //             <Grid item xs={6}>
  //               <TextField id="standard-basic" label="Enter an email ID" name="email" type="email" fullWidth
  //                 inputRef={(e) => {
  //                   emailInputRef.current = e
  //                   register(e, {
  //                     required: true,
  //                     pattern: {
  //                       value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
  //                       message: "Email Invalid."
  //                     }
  //                   })
  //                 }}
  //                 error={!!errors.email}
  //                 helperText={errors.email && errors.email.message}
  //               />
  //             </Grid>
  //             <Grid item xs={6} style={{ textAlign: "right" }}>
  //               <Box mt={1} mr={2}>
  //                 <label htmlFor="file-upload">
  //                   <input ref={register}
  //                     id="file-upload"
  //                     name="file-upload"
  //                     type="file"
  //                     style={{ display: 'none' }}
  //                   ></input>
  //                   <Fab color="primary" aria-label="add" size="small" component="span">
  //                     <AddIcon />
  //                   </Fab>
  //                 </label>
  //               </Box>
  //             </Grid>


  //             <Box width='100%' px={2} py={5}>
  //               <Grid container>
  //                 <Grow in={showProgress}>
  //                   <Grid container>
  //                     <Grid item xs={12} style={{ textAlign: "left" }}>
  //                       <Typography variant="subtitle2">{fileName ? fileName : 'no file'}</Typography>
  //                     </Grid>
  //                     <Grid item xs={12}>
  //                       <LinearProgressWithLabel value={progress} />
  //                     </Grid>
  //                   </Grid>
  //                 </Grow>
  //                 <Grow in={showSuccessMessage}>
  //                   <Grid item xs={12}>
  //                     <Typography variant="subtitle2">Success! Email Sent</Typography>
  //                   </Grid>
  //                 </Grow>
  //                 {errors.email && <Typography variant="subtitle2">{errors.email.message}</Typography>}
  //               </Grid>
  //             </Box>


  //             <Grid container spacing={3}>
  //               <Grid item xs={6} container justify="flex-end">
  //                 <Button color="primary" variant="contained" disableElevation disabled={!formState.isDirty || watchAllFields.email === ""} onClick={handleReset}>Reset</Button>
  //               </Grid>
  //               <Grid item xs={6} container justify="flex-start">
  //                 <Button color="primary" variant="contained" type="submit">Email</Button>
  //               </Grid>
  //             </Grid>
  //           </Grid>

  //         </form>

  //         <Box mt={8}>
  //           <Box mb={4}><Divider variant="middle" /></Box>
  //           <Box mb={2}>
  //             <Typography variant="subtitle2" gutterBottom>
  //               Submissions List
  //             </Typography>
  //           </Box>
  //           <SubmissionsList error={error} items={items} isLoaded={isLoaded} />
  //         </Box>
  //       </Box >
  //     </Container >
  //   </ThemeProvider >
  // )
}

export default App
