import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dashboard from '../../src/layout/dashboard'
import MaterialTable from '../../src/components/materialtable'
import firebase from '../../src/firebase'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))

export default function Members() {
  const classes = useStyles()
  const [form, openForm] = useState(false)
  function handleOpenForm() {
    openForm(true)
  }

  function closeForm() {
    openForm(false)
  }
  return (
    <Dashboard>
      <MaterialTable
        title='Members'
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Cell Leader', field: 'Cell Leader' },
        ]}
      />
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        justify='center'
      >
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            onClick={handleOpenForm}
          >
            Add New Member
          </Button>
        </Grid>
      </Grid>
      <AddMembers open={form} closeForm={closeForm} />
    </Dashboard>
  )
}

function AddMembers(props) {
  const { open, closeForm } = props
  const classes = useStyles()
  const [inputs, setInputs] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
    cell_leader: '',
    birthday: '',
    email: '',
    number: '',
  })

  const handleInputChange = e => {
    e.persist()
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(inputs)
    firebase
      .database()
      .ref()
      .child('members')
      .push()
      .set(inputs)
      .then(() => {
        console.log('Member Added')
        window.scrollTo(0, 0)
        setInputs({
          name: '',
          address: '',
          city: '',
          province: '',
          cell_leader: '',
          birthday: '',
          email: '',
          number: '',
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  const textfieldvariant = 'outlined'
  return (
    <div>
      <Dialog
        open={open}
        onClose={closeForm}
        aria-labelledby='form-dialog-title'
        scroll={'body'}
      >
        <DialogTitle id='form-dialog-title' color='primary'>
          Add New Member
        </DialogTitle>
        <DialogContent>
          <form
            className={classes.form}
            autoComplete='on'
            onSubmit={handleSubmit}
          >
            <TextField
              name='name'
              label='Name'
              autoComplete='name'
              autoFocus
              fullWidth
              margin='normal'
              required
              className={classes.textField}
              variant={textfieldvariant}
              inputProps={{ maxLength: 50 }}
              onChange={handleInputChange}
              value={inputs.name}
            />
            <TextField
              name='address'
              label='Street Address'
              className={classes.textField}
              autoComplete='street-address'
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 200 }}
              onChange={handleInputChange}
              value={inputs.address}
            />
            <TextField
              name='city'
              label='City/Municipality'
              className={classes.textField}
              autoComplete='address-level2'
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 20 }}
              onChange={handleInputChange}
              value={inputs.city}
            />
            <TextField
              name='province'
              label='Province'
              className={classes.textField}
              autoComplete='address-level1'
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 20 }}
              onChange={handleInputChange}
              value={inputs.province}
            />
            <TextField
              name='cell_leader'
              label='Cell Leader'
              className={classes.textField}
              fullWidth
              margin='normal'
              required
              variant={textfieldvariant}
              inputProps={{ maxLength: 50 }}
              onChange={handleInputChange}
              value={inputs.cell_leader}
            />
            <TextField
              name='birthday'
              label='Birthday'
              type='date'
              className={classes.textField}
              autoComplete='bday'
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              value={inputs.birthday}
            />
            <TextField
              name='email'
              label='Email'
              type='email'
              className={classes.textField}
              autoComplete='email'
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 50 }}
              onChange={handleInputChange}
              value={inputs.email}
            />
            <TextField
              name='number'
              label='Mobile Number (09*********)'
              className={classes.textField}
              autoComplete='tel'
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 11 }}
              onChange={handleInputChange}
              value={inputs.number}
            />
            <DialogActions>
              <Button color='secondary' size='large' type='submit'>
                Add
              </Button>
              <Button
                style={{ color: '#FF0000' }}
                size='large'
                onClick={closeForm}
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
