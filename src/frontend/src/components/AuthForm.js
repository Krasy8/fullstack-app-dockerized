import React from 'react';
import {Tabs, Form, Input, Button, Space, message, Select} from 'antd';
import { GoogleOutlined, AppleOutlined } from '@ant-design/icons';
import './AuthForm.css';
import {loginAdmin, registerAdmin} from "../client";
import {useNavigate} from "react-router-dom"; // Import custom styles

const { TabPane } = Tabs;

const AuthForm = ({ onLoginSuccess }) => {
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();
    const navigate = useNavigate();

    const {Option} = Select;

    // const onLoginFinish = async (values) => {
    //     console.log('Login values:', values);
    //     try {
    //         await loginAdmin(values);
    //         message.success('Login successful');
    //         onLoginSuccess(); // Call the success handler
    //         // Redirect to the main page after successful login
    //         navigate('/authorized');
    //     } catch (error) {
    //         console.log('Login failed:', error);
    //         message.error('Login failed. Please check your credentials.');
    //     }
    // };

    const onLoginFinish = async (values) => {
        console.log('Login values:', values);
        try {
            const jwtToken = await loginAdmin(values);
            if (!jwtToken) {
                throw new Error('No token received');
            }

            message.success('Login successful');
            onLoginSuccess(); // Call the success handler
            navigate('/authorized'); // Redirect only if successful
        } catch (error) {
            console.log('Login failed:', error);
            message.error('Login failed. Please check your credentials.');
        }
    };

    // const onRegisterFinish = async (values) => {
    //     console.log('Register values:', values);
    //     try {
    //         await registerAdmin(values);
    //         message.success('Registration successful! Redirecting...');
    //         setTimeout(() => {
    //             navigate('/authorized'); // Redirect to the main page
    //         }, 1000);
    //         registerForm.resetFields();
    //     } catch (error) {
    //         console.log('Registration failed:', error);
    //         message.error('Registration failed. Please try again.');
    //     }
    // }

    const onRegisterFinish = async (values) => {
        console.log('Register values:', values);
        try {
            const jwtToken = await registerAdmin(values);
            if (!jwtToken) {
                throw new Error('No token received');
            }

            message.success('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/authorized'); // Redirect only if successful
            }, 1000);
            registerForm.resetFields();
        } catch (error) {
            console.log('Registration failed:', error);
            message.error(error.message || 'Registration failed. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
        // Trigger Google login here
    };

    const handleAppleLogin = () => {
        console.log('Apple login clicked');
        // Trigger Apple login here
    };

    const items = [
        {
            key: '1',
            label: 'Login',
            children: (
                <Form
                    form={loginForm}
                    name="loginForm"
                    layout="vertical"
                    onFinish={onLoginFinish}
                >
                    <Form.Item
                        label="Username or Email"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username or email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: '2',
            label: 'Register',
            children: (
                <Form
                    form={registerForm}
                    name="registerForm"
                    layout="vertical"
                    onFinish={onRegisterFinish}
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{
                            required: true, message: 'Please select your gender',
                        },]}
                    >
                        <Select placeholder="Please select an owner">
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="MALE">MALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Admin Code (Optional)"
                        name="adminCode"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div className="auth-container">
            <div className="auth-box">
                <Tabs defaultActiveKey="1" items={items} />
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                            icon={<GoogleOutlined />}
                            onClick={handleGoogleLogin}
                            style={{ backgroundColor: '#DB4437', color: 'white' }}
                            className="auth-social-button"
                        >
                            Login with Google
                        </Button>

                        <Button
                            icon={<AppleOutlined />}
                            onClick={handleAppleLogin}
                            style={{ backgroundColor: 'black', color: 'white' }}
                            className="auth-social-button"
                        >
                            Login with Apple
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
