import React from 'react'
import axios from 'axios';
import * as yup from "yup";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { ErrorMessage, Formik, Form, Field } from "formik";

function Register() {

    const navigate = useNavigate();

    const handleRegister = async (values) => {

        try {
            const response = await axios.post('http://localhost:3000/register', {
                email: values.email,
                password: values.password
            });

            Swal.fire({
                text: response.data.msg,
                icon: "success"
            });

            navigate('/login');
        } catch (err) {

            Swal.fire({
                text: err.response.data.msg,
                icon: "error"
            });
        }
    };

    const validationRegister = yup.object().shape({
        email: yup
            .string()
            .email("Email invalid")
            .required("Email is required"),
        password: yup
            .string()
            .min(6, "Password must be at least 6 characters long")
            .required("Password is required"),
        confirmation: yup
            .string()
            .oneOf([yup.ref("password"), null], "The passwords are different")
            .required("Password confirmation is mandatory")
    });

    return (
        <div className='flex justify-center' >
            <div>
                <h4>Register Page</h4>
                <Formik
                    initialValues={{}}
                    onSubmit={handleRegister}
                    validationSchema={validationRegister}
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
                                className="form-error text-red-600"
                            />

                        </div>

                        <div >
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
                                className="form-error text-red-600"
                            />

                        </div>

                        <div>
                            <label>Confirm password</label>

                            <Field
                                type="password"
                                name="confirmation"
                                placeholder="Confirm Password"
                                className="border"
                            />

                            <ErrorMessage
                                component="span"
                                name="confirmation"
                                className="form-error text-red-600"
                            />

                        </div>

                        <button type="submit" className='border' >Register </button>

                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Register