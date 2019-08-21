import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LocationIcon from '@material-ui/icons/LocationOn'
import CakeIcon from '@material-ui/icons/Cake'
import MailIcon from '@material-ui/icons/Mail'
import PhoneIcon from '@material-ui/icons/Phone'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dashboard from 'components/Dashboard'
import MaterialTable from 'components/MaterialTable'
import firebase from 'utils/firebase'
import SnackMessage from 'components/SnackMessage'

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

export default function Leaders() {
  const leaderCollection = firebase.firestore().collection('leaders')
  const classes = useStyles()
  const [form, openForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([
    {
      id: '',
      name: '',
      street: '',
      city: '',
      province: '',
      birthday: '',
      email: '',
      number: '',
      facebook: '',
    },
  ])
  const [edit, setEdit] = useState(false)
  const [inputs, setInputs] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    street: '',
    city: '',
    province: '',
    birthday: '',
    email: '',
    number: '',
    facebook: '',
  })
  const [snack, setSnack] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackVariant, setSnackVariant] = useState('success')

  const handleInputChange = e => {
    e.persist()
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    leaderCollection.onSnapshot(snapshot => {
      console.log(snapshot)
      setLoading(false)
    })
    // membersRef.on('value', data => {
    //   const arraydata = []
    //   const snapshot = data.val()
    //   Object.keys(snapshot).map(key => {
    //     const snapshotandid = {
    //       id: key,
    //       ...snapshot[key],
    //     }
    //     arraydata.push(snapshotandid)
    //   })
    //   setData(arraydata)
    //   setLoading(false)
    // })
  }, [])
  function handleOpenForm() {
    setInputs({
      id: '',
      lastName: '',
      firstName: '',
      middleInitial: '',
      street: '',
      city: '',
      province: '',
      birthday: '',
      email: '',
      number: '',
      facebook: '',
    })
    setEdit(false)
    openForm(true)
  }

  function closeForm() {
    openForm(false)
  }
  const onSnackClose = () => {
    setSnack(false)
  }
  return (
    <Dashboard>
      <MaterialTable
        title='Leaders'
        columns={[{ title: 'Name', field: 'name' }]}
        isLoading={loading}
        data={data}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit Leader',
            onClick: (_, rowData) => {
              setEdit(true)
              setInputs(rowData)
              openForm(true)
            },
          },
        ]}
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          actionsColumnIndex: -1,
        }}
        detailPanel={[
          {
            render: rowData => {
              const {
                street,
                city,
                province,
                birthday,
                email,
                number,
              } = rowData
              const fullAddress = `${street}, ${city}, ${province}`
              const parsedate = new Date(birthday)
              const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ]
              const bday = `${
                monthNames[parsedate.getMonth()]
              } ${parsedate.getDate()} ${parsedate.getFullYear()}`
              const items = [
                {
                  item: fullAddress,
                  icon: LocationIcon,
                },
                {
                  item: bday,
                  icon: CakeIcon,
                },
                {
                  item: email,
                  icon: MailIcon,
                },
                {
                  item: number,
                  icon: PhoneIcon,
                },
              ]
              return (
                <React.Fragment>
                  {items.map(({ item, icon: Icon }, key) => (
                    <ListItem dense key={key}>
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText>{item}</ListItemText>
                    </ListItem>
                  ))}
                </React.Fragment>
              )
            },
            tooltip: 'More Details',
          },
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
            Add New Leader
          </Button>
        </Grid>
      </Grid>
      <AddLeader
        open={form}
        closeForm={closeForm}
        openForm={openForm}
        inputs={inputs}
        setInputs={setInputs}
        handleInputChange={handleInputChange}
        edit={edit}
        setSnack={setSnack}
        setSnackMessage={setSnackMessage}
        setSnackVariant={setSnackVariant}
      />
      <SnackMessage
        open={snack}
        onClose={onSnackClose}
        message={snackMessage}
        variant={snackVariant}
        horizontal={'right'}
      />
    </Dashboard>
  )
}

function AddLeader(props) {
  const leaderCollection = firebase.firestore().collection('leader')
  const {
    open,
    openForm,
    closeForm,
    inputs,
    setInputs,
    handleInputChange,
    edit,
    setSnack,
    setSnackMessage,
    setSnackVariant,
  } = props
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const handleSubmit = e => {
    e.preventDefault()
    console.log(inputs)
    setLoading(false)
    // const {
    //   firstName,
    //   lastName,
    //   middleInitial,
    //   street,
    //   city,
    //   province,
    // } = inputs
    // inputs.name = {
    //   first: firstName,
    //   last: lastName,
    //   middle: middleInitial,
    // }
    // inputs.address = {
    //   street,
    //   city,
    //   province,
    // }
    // delete inputs.firstName
    // delete inputs.lastName
    // delete inputs.middleInitial
    // delete inputs.street
    // delete inputs.city
    // delete inputs.province
    // if (edit) {
    //   const id = inputs.id
    //   delete inputs.id
    //   membersCollection
    //     .doc(id)
    //     .update(inputs)
    //     .then(() => {
    //       setSnack(true)
    //       setSnackMessage('Edit Successful')
    //       setSnackVariant('success')
    //       openForm(false)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //       setSnack(true)
    //       setSnackMessage('Error editing member.')
    //       setSnackVariant('error')
    //     })
    //     .finally(() => {
    //       setLoading(false)
    //     })
    //   // membersRef.child(id).update(inputs, error => {
    //   //   setLoading(false)
    //   //   if (error) {
    //   //     setSnack(true)
    //   //     setSnackMessage(error.message)
    //   //     setSnackVariant('error')
    //   //   } else {
    //   //     setSnack(true)
    //   //     setSnackMessage('Edit Successful')
    //   //     setSnackVariant('success')
    //   //     openForm(false)
    //   //   }
    //   // })
    // } else {
    //   membersCollection
    //     .add(inputs)
    //     .then(() => {
    //       setInputs({
    //         id: '',
    //         lastName: '',
    //         firstName: '',
    //         middleInitial: '',
    //         address: '',
    //         city: '',
    //         province: '',
    //         leader: '',
    //         birthday: '',
    //         email: '',
    //         number: '',
    //         facebook: '',
    //       })
    //       setSnack(true)
    //       setSnackMessage('Member Added')
    //       setSnackVariant('success')
    //     })
    //     .catch(error => {
    //       console.log(error)
    //       setSnack(true)
    //       setSnackMessage('Error adding member.')
    //       setSnackVariant('error')
    //     })
    //     .finally(() => {
    //       setLoading(false)
    //     })
    //   // membersRef.push().set(inputs, error => {
    //   //   if (error) {
    //   //     setSnack(true)
    //   //     setSnackMessage(error.message)
    //   //     setSnackVariant('error')
    //   //   } else {
    //   //     setInputs({
    //   //       name: '',
    //   //       address: '',
    //   //       city: '',
    //   //       province: '',
    //   //       cell_leader: '',
    //   //       birthday: '',
    //   //       email: '',
    //   //       number: '',
    //   //     })
    //   //     setSnack(true)
    //   //     setSnackMessage('Member Added')
    //   //     setSnackVariant('success')
    //   //   }
    //   //   setLoading(false)
    //   // })
    // }
  }

  const textfieldvariant = 'outlined'
  return (
    <div>
      <Dialog
        open={open}
        onClose={closeForm}
        aria-labelledby='form-dialog-title'
        scroll={'body'}
        fullScreen
      >
        <DialogTitle id='form-dialog-title' color='primary'>
          {edit ? 'Edit' : 'Add'} Leader
        </DialogTitle>
        <DialogContent>
          <DialogContentText>All fields with * are required.</DialogContentText>
          <form
            className={classes.form}
            autoComplete='on'
            onSubmit={handleSubmit}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='lastName'
                  label='Last Name'
                  autoComplete='family-name'
                  autoFocus
                  fullWidth
                  margin='normal'
                  required
                  className={classes.textField}
                  variant={textfieldvariant}
                  inputProps={{ maxLength: 50 }}
                  onChange={handleInputChange}
                  value={inputs.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='firstName'
                  label='First Name'
                  autoComplete='given-name'
                  fullWidth
                  margin='normal'
                  required
                  className={classes.textField}
                  variant={textfieldvariant}
                  inputProps={{ maxLength: 50 }}
                  onChange={handleInputChange}
                  value={inputs.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name='middleInitial'
                  label='Middle Initial'
                  fullWidth
                  margin='normal'
                  className={classes.textField}
                  variant={textfieldvariant}
                  inputProps={{ maxLength: 2 }}
                  onChange={handleInputChange}
                  value={inputs.middleInitial}
                />
              </Grid>
            </Grid>
            <TextField
              name='street'
              label='Street Address'
              className={classes.textField}
              autoComplete='street-address'
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 200 }}
              onChange={handleInputChange}
              value={inputs.street}
              required
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
              required
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
              required
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
              required
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
              required
            />
            <TextField
              name='facebook'
              label='Facebook Username (if any)'
              className={classes.textField}
              fullWidth
              margin='normal'
              variant={textfieldvariant}
              inputProps={{ maxLength: 50 }}
              onChange={handleInputChange}
              value={inputs.facebook}
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
              required
            />
            <DialogActions>
              <Button
                color='secondary'
                size='large'
                type='submit'
                disabled={loading}
              >
                {edit ? 'Edit' : 'Add'}
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

AddLeader.propTypes = {
  open: PropTypes.bool.isRequired,
  openForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  inputs: PropTypes.object.isRequired,
  setInputs: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  setSnack: PropTypes.func.isRequired,
  setSnackMessage: PropTypes.func.isRequired,
  setSnackVariant: PropTypes.func.isRequired,
}
