import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LocationIcon from '@material-ui/icons/LocationOn'
import CakeIcon from '@material-ui/icons/Cake'
import MailIcon from '@material-ui/icons/Mail'
import PhoneIcon from '@material-ui/icons/Phone'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dashboard from '../../src/layout/dashboard'
import MaterialTable from '../../src/components/materialtable'
import firebase from '../../src/firebase'
import SnackMessage from '../../src/components/SnackMessage'

const membersRef = firebase.database().ref('members')
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
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([
    {
      id: '',
      name: '',
      address: '',
      city: '',
      province: '',
      cell_leader: '',
      birthday: '',
      email: '',
      number: '',
    },
  ])
  const [edit, setEdit] = useState(false)
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
    membersRef.on('value', data => {
      const arraydata = []
      const snapshot = data.val()
      Object.keys(snapshot).map(key => {
        const snapshotandid = {
          id: key,
          ...snapshot[key],
        }
        arraydata.push(snapshotandid)
      })
      setData(arraydata)
      setLoading(false)
    })
  }, [])
  function handleOpenForm() {
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
        title='Members'
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Cell Leader', field: 'cell_leader' },
        ]}
        isLoading={loading}
        data={data}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit Member',
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
                address,
                city,
                province,
                birthday,
                email,
                number,
              } = rowData
              const fullAddress = `${address}, ${city}, ${province}`
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
            Add New Member
          </Button>
        </Grid>
      </Grid>
      <AddMembers
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

function AddMembers(props) {
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
    setLoading(true)
    if (edit) {
      const id = inputs.id
      delete inputs.id
      membersRef.child(id).update(inputs, error => {
        setLoading(false)
        if (error) {
          setSnack(true)
          setSnackMessage(error.message)
          setSnackVariant('error')
        } else {
          setSnack(true)
          setSnackMessage('Edit Successful')
          setSnackVariant('success')
          openForm(false)
        }
      })
    } else {
      membersRef.push().set(inputs, error => {
        if (error) {
          setSnack(true)
          setSnackMessage(error.message)
          setSnackVariant('error')
        } else {
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
          setSnack(true)
          setSnackMessage('Member Added')
          setSnackVariant('success')
        }
        setLoading(false)
      })
    }
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
          {edit ? 'Edit' : 'Add'} Member
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
