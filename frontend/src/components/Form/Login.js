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

import setCookie from '@/utils/setCookie';
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
  media: {
    objectFit: 'cover',
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
  registrationText: {
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
class LoginForm extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    action: PropTypes.func.isRequired,

    setMessage: PropTypes.func.isRequired,
  };

  render() {
    const { classes, action: loginAction, setMessage } = this.props;

    return (
      <ApolloConsumer>
        {apolloClient => (
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .min(6, 'Username must be longer than 6 characters!')
                .max(15, 'Username must be less than 15 characters')
                .required('Username is required!'),
              password: Yup.string()
                .min(6, 'Password must be longer than 6 characters!')
                .required('Password is required!'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              loginAction({ variables: { input: values } })
                .then(payload => {
                  setSubmitting(false);
                  setMessage({
                    message: 'Login Success!',
                    messageType: 'success',
                    timeout: 350,
                    callback: () => {
                      setTimeout(() => {
                        setCookie('token', payload.data.login.accessToken, {
                          maxAge: 60 * 60,
                        });
                        apolloClient.cache.reset().then(() => {
                          redirect({}, '/');
                        });
                      }, 300);
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
                <Grid item xs={12} md={12} className={classes.gridForm}>
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
                            Login
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            className={classes.registrationText}
                          >
                            Do not have an account?
                          </Typography>
                          <Button
                            className={classnames(
                              classes.button,
                              classes.buttonGreen
                            )}
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => Router.push('/register')}
                          >
                            Register
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

export default LoginForm;
