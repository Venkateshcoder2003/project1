
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./contact.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { useAuth } from './auth';

const Contact = () => {

    const { storeTokenINLS } = useAuth();
    const [inputvalue, setInputvalue] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        mobile: "",
        message: ""
    });

    const getvalue = (e) => {
        const { name, value } = e.target;
        setInputvalue(() => {
            return {
                ...inputvalue,
                [name]: value
            }
        });
    }

    const sentUserdata = (e) => {
        e.preventDefault();

        const { fname, lname, email, password, mobile, message } = inputvalue;
        if (fname === "") {
            toast.error("First Name is required");
        } else if (lname === "") {
            toast.error("Last Name is required");
        } else if (email === "") {
            toast.error("Email is required");
        } else if (!email.includes("@")) {
            toast.error("Invalid email");
        } else if (password === "") {
            toast.error("Password is required");
        } else if (mobile === "") {
            toast.error("Mobile Number is required");
        } else {
            axios.post("http://localhost:6002/register", {
                fname, lname, email, password, mobile, message
            })
                .then(res => {
                    const data = res.data;
                    if (data.status === 201) {
                        toast.success("Your Response Submitted(Check Mail)");
                        toast.success("Registration Successful.")
                        setInputvalue({
                            fname: "",
                            lname: "",
                            email: "",
                            password: "",
                            mobile: "",
                            message: ""
                        });
                        if (data.token) {
                            console.log("Storing token:", data.token);
                            storeTokenINLS(data.token);
                            console.log("Token stored in localStorage");
                        }
                    }
                    else {
                        toast.error("Failed to submit your response");
                    }
                })
                .catch(error => {
                    toast.error("Failed to submit your response. Please try again.");
                    console.error("Axios error:", error);
                });
        }
    }

    return (
        <>
            <div className="container mb-3 contact">
                <h2 className='text-center'>ContactUS</h2>
                <div className="container mt-2">
                    <Form className='row mt-2'>
                        <Form.Group className="mb-3 col-lg-6" controlId="formBasicFname">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name='fname' value={inputvalue.fname} onChange={getvalue} />
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="formBasicLname">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name='lname' value={inputvalue.lname} onChange={getvalue} />
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name='email' value={inputvalue.email} onChange={getvalue} />
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name='password' value={inputvalue.password} onChange={getvalue} />
                        </Form.Group>
                        <Form.Group className="mb-3 col-lg-6" controlId="formBasicMobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type="text" name='mobile' value={inputvalue.mobile} onChange={getvalue} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={getvalue} value={inputvalue.message} name="message" />
                        </Form.Group>
                        <div className='d-flex justify-content-center'>
                            <Button variant="primary" className='col-lg-6' type="submit" onClick={sentUserdata}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default Contact;



