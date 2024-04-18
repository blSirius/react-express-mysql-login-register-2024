import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const userContext = createContext();

export function Context({ children }) {

    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem('@user');

            if (!token) {
                return false;
            }

            const response = await axios.post('http://localhost:3000/decodeToken', { token });
            return response.data.currentUser;

        } catch (err) {
            console.log(err.message)
            return false
        }
    }


    const login = async (values) => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email: values.email,
                password: values.password
            });

            localStorage.setItem('@user', response.data.email);

            return { status: 'ok', result: response.data.msg };

        } catch (err) {
            return { status: 'error', result: err.response.data.msg };
        }
    };

    return (
        <userContext.Provider value={{ getCurrentUser, login }} >
            {children}
        </userContext.Provider>
    )
}