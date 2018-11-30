import { Component } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

import PersonOutlined from '@material-ui/icons/PersonOutlined';

import { TextField } from 'formik-material-ui';

import redirect from '@/utils/redirect';

@withStyles({
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: purple[500],
    justifySelf: 'center',
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    minWidth: 345,
    padding: '20px',
  },
  gridForm: {
    margin: '0 auto',
  },
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formField: {
    width: '100%',
  },
  button: {
    margin: '0 0 10px 10px',
  },
  buttonGreen: {
    backgroundColor: green[700],
  },
  loginText: {
    marginBottom: '10px',
  },
  '@media (max-width: 786px)': {
    card: {
      padding: '0 20px 0 10px',
      '-webkit-box-shadow': 'none',
      '-moz-box-shadow': 'none',
      'box-shadow': 'none',
    },
  },
})
@connect(
  () => ({}),
  ({ message: { setMessage } }) => ({ setMessage })
)
class RegisterForm extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    action: PropTypes.func.isRequired,

    setMessage: PropTypes.func.isRequired,
  };

  render() {
    const { classes, action: registerAction, setMessage } = this.props;

    return (
      <ApolloConsumer>
        {apolloClient => (
          <Formik
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .matches(
                  /^[a-z0-9_]{5,}[a-zA-Z]+[0-9]*$/,
                  'Username must be in lowercase form and no spaces'
                )
                .min(6, 'Username must be longer than 6 characters!')
                .max(15, 'Username must be less than 15 characters')
                .required('Username is required!'),
              email: Yup.string()
                .email()
                .required('Email is required!'),
              password: Yup.string()
                .min(6, 'Password must be longer than 6 characters!')
                .required('Password is required!'),
              passwordConfirm: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password does not match')
                .required('Password confirm is required'),
              firstName: Yup.string().required('First Name is required!'),
              lastName: Yup.string().required('Last Name is required!'),
            })}
            onSubmit={({ passwordConfirm, ...rest }, { setSubmitting }) => {
              registerAction({ variables: { input: rest } })
                .then(() => {
                  setSubmitting(false);
                  setMessage({
                    message: 'Registration Success!',
                    messageType: 'success',
                    timeout: 1000,
                    callback: () => {
                      setTimeout(() => {
                        apolloClient.cache.reset().then(() => {
                          redirect({}, '/login');
                        });
                      }, 2000);
                    },
                  });
                })
                .catch(err => {
                  const {
                    statusCode,
                    error,
                    message,
                  } = err.graphQLErrors[0].message;

                  setMessage({
                    message: `[${statusCode}] ${error} - ${message}`,
                    messageType: 'error',
                    timeout: 1500,
                  });

                  setSubmitting(false);
                });
            }}
            render={({ submitForm, isSubmitting }) => (
              <form className={classes.formContainer}>
                <Grid item xs={12} md={6} className={classes.gridForm}>
                  <Card className={classes.card}>
                    <CardContent>
                      <CardActions className={classes.center}>
                        <Avatar className={classes.avatar}>
                          <PersonOutlined />
                        </Avatar>
                      </CardActions>
                      <Field
                        id="username-field"
                        name="username"
                        type="text"
                        label="Username*"
                        helperText="More than 6 characters"
                        margin="normal"
                        className={classes.formField}
                        component={TextField}
                        autoComplete="true"
                      />
                      <Field
                        id="email-field"
                        name="email"
                        type="email"
                        label="Email*"
                        margin="normal"
                        className={classes.formField}
                        component={TextField}
                        autoComplete="true"
                      />
                      <Field
                        id="firstName-field"
                        name="firstName"
                        type="text"
                        label="First Name*"
                        margin="normal"
                        className={classes.formField}
                        component={TextField}
                        autoComplete="true"
                      />
                      <Field
                        id="lastName-field"
                        name="lastName"
                        type="text"
                        label="Last Name*"
                        margin="normal"
                        className={classes.formField}
                        component={TextField}
                        autoComplete="true"
                      />
                      <Field
                        id="password-field"
                        name="password"
                        type="password"
                        label="Password*"
                        helperText="More than 6 characters"
                        margin="normal"
                        className={classes.formField}
                        component={TextField}
                        autoComplete="true"
                      />
                      <Field
                        id="passwordConfirm-field"
                        name="passwordConfirm"
                        type="password"
                        label="Confirm Password*"
                        helperText="More than 6 characters"
                        margin="normal"
                        className={classes.formField}
                        component={TextField}
                        autoComplete="true"
                      />
                    </CardContent>
                    <CardActions className={classes.center}>
                      {isSubmitting && <LinearProgress />}
                      <Grid container spacing={16}>
                        <Grid item xs={12}>
                          <Button
                            className={classes.button}
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={submitForm}
                          >
                            Register
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            className={classes.loginText}
                          >
                            Already have an account?
                          </Typography>
                          <Button
                            className={classnames(
                              classes.button,
                              classes.buttonGreen
                            )}
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => Router.push('/login')}
                          >
                            Login
                          </Button>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              </form>
            )}
          />
        )}
      </ApolloConsumer>
    );
  }
}

export default RegisterForm;
