// StudentTable.js
import React, {useState, useEffect} from "react";
import {Table, Tag, Badge, Flex, Popconfirm, Radio} from "antd";
import ProgressSpin from "./Spin";
import AddStudent from "./AddNewStudent";
import {deleteStudent, getAllStudents} from "../client";
import {errorNotification, successNotification} from "./Notification";
import {UserOutlined} from "@ant-design/icons";
import {Avatar} from "antd";

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar style={{
            backgroundColor: '#fde3cf',
            color: '#f56a00',
        }}>
            {name.charAt(0)}
        </Avatar>
    }
    return <Avatar style={{
        backgroundColor: '#fde3cf',
        color: '#f56a00',
    }}>
        {`${name.charAt(0)}${name.charAt(name.length - 1)}`}
    </Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with id: ${studentId} has been deleted from the system`);
        callback();
    }).catch(err => {
        console.log(err.response)
        err.response.json().then(res => {
            console.log(res)
            errorNotification("Something went wrong...",
                `${res.message} [${res.status}] [${res.error}]]`,
                "bottomLeft"
            )
        });
    })
}

const studentColumns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.username}/>
    },
    {
        title: 'Student Id',
        dataIndex: 'studentId',
        key: 'studentId',
    },
    {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
        render: (text, student) => student.userId ?? "N/A",
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (text, student) => student.firstName ?? "N/A",
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        render: (text, student) => student.lastName ?? "N/A"
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.username}`}
                    onConfirm={() => removeStudent(student.studentId, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button key={`delete-${student.id}`} value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button key={`edit-${student.id}`} value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchStudents = async () => {
        setFetching(true);
        try {
            const data = await getAllStudents();
            setStudents(data || []);
        } catch (err) {
            console.error("Fetch students error:", err);
            errorNotification("Something went wrong...", err.message || "Unable to fetch students");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    if (fetching) {
        return <ProgressSpin/>;
    }

    return (
        <Table
            dataSource={students}
            columns={studentColumns(fetchStudents)}
            bordered
            title={() =>
                <>
                    <AddStudent fetchStudents={fetchStudents} students={students}/>
                    <Flex>
                        <Tag>Number of students</Tag>
                        <Badge count={students.length} showZero color="#52c41a"/>
                    </Flex>
                </>
            }
            pagination={{
                pageSize: 50,
            }}
            scroll={{y: 1500}}
            rowKey={(student) => student.id}
        />
    );
};

export default StudentTable;
