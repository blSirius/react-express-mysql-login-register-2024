import React from 'react'
import * as yup from "yup";
import { ErrorMessage, Formik, Form, Field } from "formik";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';


function Login() {

  const navigate = useNavigate();

  const handleLogin = async (values) => {

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: values.email,
        password: values.password
      });

      localStorage.setItem('@user', response.data.email);

      Swal.fire({
        text: response.data.msg,
        icon: "success"
      });

      navigate('/home');

    } catch (err) {

      Swal.fire({
        text: err.response.data.msg,
        icon: "error"
      });

    }
  };

  const validationLogin = yup.object().shape({
    email: yup
      .string()
      .email("Email invalid")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  })

  return (
    <div className='flex justify-center' >
      <div>
        <h4>Login Page</h4>
        <hr />

        <Formik
          initialValues={{}}
          onSubmit={handleLogin}
          validationSchema={validationLogin}
        >
          <Form>
            <div>
              <label>Your email</label>

              <Field
                type="email"
                name="email"
                placeholder="name@flowbite.com"
                className="border"
              />

              <ErrorMessage
                component="span"
                name="email"
                className="form-error"
              />

            </div>

            <div>
              <label>Your password</label>

              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="border"
              />

              <ErrorMessage
                component="span"
                name="password"
                className="form-error"
              />

            </div>

            <button type="submit" className='border' >Login</button>

          </Form>
        </Formik>

      </div>
    </div>
  )
}

export default Login