import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  table: {
    minWidth: 550,
  },
  tablecell: {
    fontSize: '0.6em',
    textAlign: 'left'
    // width: 300,
    // minWidth: 300,
  },
  narrowCell: {
    'width': '5px',
  }
});


export default function SubmissionsList(props) {
  const classes = useStyles()
  const { error, items, isLoaded } = props
  console.log(items)

  const renderContent = () => {
    if (error) {
      return <div>Error: {error.message}</div>
    }
    else if (!isLoaded) {
      return (
        <div><CircularProgress size={15} /> Loading submissions...</div>
      )
    }
    else {
      return (
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
      )
    }
  }

  return (
    renderContent()
  )
}