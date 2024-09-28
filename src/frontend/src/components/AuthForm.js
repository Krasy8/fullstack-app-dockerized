import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Space } from 'antd';
import { GoogleOutlined, AppleOutlined } from '@ant-design/icons';
import './AuthForm.css'; // Import custom styles

const { TabPane } = Tabs;

const AuthForm = () => {
    const [form] = Form.useForm();

    const onLoginFinish = (values) => {
        console.log('Login values:', values);
        // Perform login logic here
    };

    const onRegisterFinish = (values) => {
        console.log('Registration values:', values);
        // Perform registration logic here
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
        // Trigger Google login here
    };

    const handleAppleLogin = () => {
        console.log('Apple login clicked');
        // Trigger Apple login here
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Login" key="1">
                        <Form
                            form={form}
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

                        <div style={{textAlign: 'center', marginTop: 20}}>
                            <Space direction="vertical" style={{width: '100%'}}>
                                <Button
                                    icon={<GoogleOutlined/>}
                                    onClick={handleGoogleLogin}
                                    style={{backgroundColor: '#DB4437', color: 'white'}}
                                    className="auth-social-button"
                                >
                                    Login with Google
                                </Button>

                                <Button
                                    icon={<AppleOutlined/>}
                                    onClick={handleAppleLogin}
                                    style={{backgroundColor: 'black', color: 'white'}}
                                    className="auth-social-button"
                                >
                                    Login with Apple
                                </Button>
                            </Space>
                        </div>
                    </TabPane>

                    <TabPane tab="Register" key="2">
                        <Form
                            form={form}
                            name="registerForm"
                            layout="vertical"
                            onFinish={onRegisterFinish}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{required: true, message: 'Please input your username!' }]}
                            >
                                <Input />
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default AuthForm;
