import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {
    Button,
    Col,
    Drawer, Empty,
    Form,
    Input,
    Row,
    Select,
    Space
} from 'antd';

import {addNewStudent} from "../client";
import ProgressSpin from "./Spin";
import {successNotification, errorNotification} from "./Notification";


const {Option} = Select;
const returnSpin = () => {
    return <ProgressSpin/>;
}


function AddNewStudent({fetchStudents, students}) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [destroyOnClose, setDestroyOnClose] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onFinish = async (student) => {
        setSubmitting(true); // Indicate form submission state
        console.log(JSON.stringify(student, null, 2));

        try {
            // await fetchApi("/students", {
            //     method: "POST",
            //     body: JSON.stringify(student),
            // });
            await addNewStudent(student)
            console.log("New student added");

            successNotification(
                "New Student has been successfully added",
                `A new account for ${student.username} has been created on the system`
            );

            onClose(); // Close the form or modal
            fetchStudents(); // Refresh the students list
            setDestroyOnClose(true); // Reset form behavior
        } catch (err) {
            console.error("Add student error:", err);
            const errorMessage = err.message || "Unexpected error occurred";
            errorNotification("Something went wrong...", errorMessage, "bottomLeft");
        } finally {
            setSubmitting(false); // Stop form submission state
        }
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2))
    }

    const empty = (students) => {
        if (students.length <=0){
            return <Empty/>
        }
        return null;
    }

    return (
        <>
            <Button type="primary"
                    onClick={showDrawer}
                    icon={<PlusOutlined/>}
                    style={{marginRight: '10px'}}>
                New student
            </Button>
            <br/><br/>
            <>
                {empty(students)}
            </>

            <Drawer
                title="Create a new account"
                width={720}
                onClose={onClose}
                open={open}
                destroyOnClose={destroyOnClose}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <Form
                    layout="vertical"
                    onFinishFailed={onFinishFailed}
                    onFinish={onFinish}
                    requiredMark={true}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="username"
                                label="username"
                                rules={[{
                                    required: true, message: 'Please enter user name',
                                },]}
                            >
                                <Input placeholder="Please enter user name"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
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
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{
                                    required: true, message: 'Please choose the approver',
                                },]}
                            >
                                <Input placeholder="Please enter user email address"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button onClick={onClose}>
                                        Cancel
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        {submitting && returnSpin()}
                    </Row>
                </Form>
            </Drawer>
        </>);
}

export default AddNewStudent;
