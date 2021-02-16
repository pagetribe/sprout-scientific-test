import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles({
  table: {
    minWidth: 550,
    backgroundColor: '#eceff1',
  },
  tablecell: {
    fontSize: '0.6em',
    textAlign: 'left'
  },
});


export default function SubmissionsList(props) {
  const classes = useStyles()
  const { error, items, isLoaded } = props
  const hasNoSubmissions = items.length === 0 && isLoaded

  const renderLoadingSpinner = () => (
    <Grid container spacing={1}>
      <Grid item xs={12}><CircularProgress size={20} /></Grid>
      <Grid item xs={12}>Loading submissions...</Grid>
    </Grid>
  )

  const renderTable = () => (
    <Fade in={!!isLoaded} timeout={600}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="submission list">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tablecell} style={{ width: '5%' }} >ID</TableCell>
              <TableCell className={classes.tablecell} align="right">email</TableCell>
              <TableCell className={classes.tablecell} align="right">file name</TableCell>
              <TableCell className={classes.tablecell} align="right">create at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} >
                <TableCell className={classes.tablecell} style={{ width: '5%' }}>{row.id}</TableCell>
                <TableCell className={classes.tablecell} align="right">{row.email}</TableCell>
                <TableCell className={classes.tablecell} align="right">{row.file_name}</TableCell>
                <TableCell className={classes.tablecell} align="right">{new Date(`${row.created_at} UTC`).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fade>
  )

  const renderContent = () => {
    if (error) {
      return <Grid item xs={12}>Error: {error.message}</Grid>
    }
    else if (!isLoaded) {
      return renderLoadingSpinner()
    }
    else if (hasNoSubmissions) {
      return (
        <Fade in={hasNoSubmissions}>
          <Typography variant="body2" color="textSecondary">
            No submissions yet. <br />Enter an email and add a file.
          </Typography>
        </Fade >
      )
    }
    else {
      return renderTable()
    }
  }

  return (
    renderContent()
  )
}

SubmissionsList.propTypes = {
  error: PropTypes.object,
  items: PropTypes.array.isRequired,
  isLoaded: PropTypes.bool.isRequired
}