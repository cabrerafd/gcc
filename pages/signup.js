import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Parse from 'parse'
import Router from 'next/router'
import SnackMessage from '../src/components/SnackMessage'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function SignUp() {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })
  const [snack, setSnack] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackVariant, setSnackVariant] = useState('success')

  useEffect(() => {
    console.log('componentDidMount')
    Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
    Parse.initialize(
      process.env.APP_ID, // This is your Application ID
      process.env.JS_KEY, // This is your Javascript key
    )
  }, [])

  const handleInputChange = e => {
    e.persist()
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: [e.target.value],
    }))
  }

  const formSubmit = e => {
    e.preventDefault()
    setLoading(true)
    const form = inputs
    Object.keys(inputs).map((key, _) => {
      form[key] = inputs[key].toString()
    })
    const { firstName, lastName, username, email, password } = form
    const name = `${firstName} ${lastName}`
    const user = new Parse.User()
    user.set({ name, username, email, password })
    user
      .signUp()
      .then(result => {
        console.log(result)
        Router.push({
          pathname: '/signin',
          query: {
            signup: 'success',
          },
        })
      })
      .catch(err => {
        setInputs(inputs => ({
          ...inputs,
          password: '',
        }))
        setLoading(false)
        setSnack(true)
        setSnackVariant('error')
        setSnackMessage(err.message)
      })
    // user
    //   .save({ name, username, email, password })
    //   .then(() => {
    //     Router.push({
    //       pathname: '/signin',
    //       query: {
    //         signup: 'success',
    //       },
    //     })
    //   })
    //   .catch(err => {
    //     setLoading(false)
    //     setSnack(true)
    //     setSnackVariant('error')
    //     setSnackMessage(err.message)
    //   })
  }

  const onSnackClose = () => {
    setSnack(false)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          className={classes.avatar}
          alt='Grace City'
          src='../static/favicon.ico'
        />
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={formSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='firstName'
                label='First Name'
                autoComplete='given-name'
                autoFocus
                value={inputs.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='lastName'
                label='Last Name'
                autoComplete='family-name'
                value={inputs.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='username'
                label='Username'
                autoComplete='username'
                value={inputs.userName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='email'
                label='Email Address'
                autoComplete='email'
                value={inputs.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                value={inputs.password}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={true}
          >
            Sign Up
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              {/* <Link href='#' variant='body2'>
                Already have an account? Sign in
              </Link> */}
            </Grid>
          </Grid>
        </form>
      </div>
      <SnackMessage
        open={snack}
        onClose={onSnackClose}
        message={snackMessage}
        variant={snackVariant}
      />
    </Container>
  )
}
