import React, { useEffect, useState, useRef } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Router from 'next/router'
import SnackMessage from '../src/components/SnackMessage'
import Parse from 'parse'

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

function SignIn(props) {
  const { query } = props
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    identifier: '',
    password: '',
  })
  const [snack, setSnack] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackVariant, setSnackVariant] = useState('success')
  const passwordRef = useRef(null)

  useEffect(() => {
    if (query.signup === 'success') {
      setSnackMessage('Sign Up Success')
      setSnackVariant('success')
      setSnack(true)
    }
    Parse.serverURL = 'https://parseapi.back4app.com' // This is your Server URL
    Parse.initialize(
      process.env.APP_ID, // This is your Application ID
      process.env.JS_KEY, // This is your Javascript key
    )
  }, [])
  const onSnackClose = () => {
    setSnack(false)
  }

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
    const { identifier, password } = form
    Parse.User.logIn(identifier, password)
      .then(() => Router.push('/dashboard'))
      .catch(err => {
        passwordRef.current.focus()
        setInputs(inputs => ({
          ...inputs,
          password: '',
        }))
        setLoading(false)
        setSnack(true)
        setSnackVariant('error')
        setSnackMessage(err.message)
      })
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={formSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Username/Email Address'
            name='identifier'
            autoComplete='username'
            autoFocus
            value={inputs.identifier}
            onChange={handleInputChange}
          />
          <TextField
            inputRef={passwordRef}
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            autoComplete='current-password'
            value={inputs.password}
            onChange={handleInputChange}
          />
          {/* <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          /> */}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            disabled={loading}
            className={classes.submit}
          >
            Sign In
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
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

SignIn.getInitialProps = ({ query }) => {
  return { query }
}

export default SignIn
