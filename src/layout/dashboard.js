import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ContactsIcon from '@material-ui/icons/Contacts'
import PeopleIcon from '@material-ui/icons/People'
import HomeIcon from '@material-ui/icons/Home'
import AssignmentIcon from '@material-ui/icons/Assignment'
import MenuIcon from '@material-ui/icons/Menu'
import firebase from '../firebase'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}))

function DashboardLayout(props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [logoutbutton, setLogoutbutton] = useState(false)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setLoading(false)
      } else {
        Router.push('/signin')
      }
    })
  }, [])

  const logout = () => {
    setLogoutbutton(true)
    firebase
      .auth()
      .signOut()
      .then(() => {
        Router.push('/signin')
      })
      .catch(error => {
        console.log(error)
        setLogoutbutton(false)
      })
  }

  const toggleDrawer = open => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setDrawer(open)
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <CircularProgress size={40} className={classes.buttonProgress} />
      ) : (
        <React.Fragment>
          <AppBar position='static'>
            <Toolbar>
              <IconButton
                edge='start'
                className={classes.menuButton}
                color='inherit'
                aria-label='menu'
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' className={classes.title}>
                Grace City Church
              </Typography>
              <Button color='inherit' onClick={logout} disabled={logoutbutton}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <SwipeableDrawer
            open={drawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <List className={classes.list}>
              {drawerList.map(({ name, icon: Icon, path }) => (
                <Link href={`/dashboard${path}`} key={name}>
                  <ListItem button key={name}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </SwipeableDrawer>
          <main className={classes.content}>{props.children}</main>
        </React.Fragment>
      )}
    </div>
  )
}

const drawerList = [
  {
    name: 'Home',
    icon: HomeIcon,
    path: '',
  },
  {
    name: 'Members',
    icon: ContactsIcon,
    path: '/members',
  },
  {
    name: 'Attendance',
    icon: PeopleIcon,
    path: '/attendance',
  },
  {
    name: 'Cell Report',
    icon: AssignmentIcon,
    path: '/cellreport',
  },
]

export default DashboardLayout
