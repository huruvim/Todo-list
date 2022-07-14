import React, {useState} from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField
} from '@material-ui/core';
import {useFormik} from 'formik';
import {useSelector} from 'react-redux';
import {login} from './auth-reducer';
import {Redirect} from 'react-router-dom';
import {useAppDispatch} from '../../utils/redux-utils';
import {selectIsLoggedIn} from '../../redux/selectors';
import {isEmail, isEmpty} from '../../utils/helpers';

interface FormikValues {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [captchaUrl, setCaptchaUrl] = useState('');

  const formik = useFormik<FormikValues>({
    validate: ({email, password, captcha}) => {
      if (isEmpty(email)) {
        return {
          email: 'Email is required'
        };
      }
      if (!isEmail(email)) {
        return {
          email: 'Invalid email address'
        };
      }
      if (isEmpty(password)) {
        return {
          password: 'Password is required'
        };
      }
      if (!isEmpty(captchaUrl) && captcha !== undefined && isEmpty(captcha)) {
        return {
          captcha: 'Captcha is required'
        };
      }
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
      captcha: undefined
    },
    onSubmit: async (values, formikHelpers) => {
      const action = await dispatch(login(values));
      if (login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          action.payload?.fieldsErrors?.map((error) => {
            if (error.field === 'captcha') {
              setCaptchaUrl(error.error);
              formikHelpers.setFieldValue(error.field, '');
            }
            formikHelpers.setFieldError(error.field, error.error);
          });
        }
      }
    }
  });

  if (isLoggedIn) {
    return <Redirect to={'/'} />;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{' '}
                <a
                  href={'https://social-network.samuraijs.com/'}
                  target={'_blank'}
                  rel="noopener noreferrer">
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div>{formik.errors.password}</div>
              )}
              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    {...formik.getFieldProps('rememberMe')}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              {captchaUrl.length > 0 && (
                <>
                  <img src={captchaUrl} alt="captcha" />
                  <TextField
                    type="captcha"
                    label="Captcha"
                    margin="normal"
                    {...formik.getFieldProps('captcha')}
                  />
                  {formik.errors.captcha && <div>{formik.errors.captcha}</div>}
                </>
              )}
              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
