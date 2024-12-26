import React, {useState, useEffect} from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

import {
    Breadcrumb,
    Layout,
    Menu,
    Table,
    theme,
    Badge,
    Tag,
    Flex,
    Avatar,
    Radio, Popconfirm
} from 'antd';

import ProgressSpin from "./Spin";
import {deleteStudent, getAllStudents} from "../client";
import AddStudent from "./AddNewStudent"
import {errorNotification, successNotification} from "./Notification";


const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined/>),
    getItem('Option 2', '2', <DesktopOutlined/>),
    getItem('User', 'sub1', <UserOutlined/>, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined/>),
];

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

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];


function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
            }).catch(err => {
            if (err.response) {
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("Something went wrong...",
                        `${res.message} [${res.status}] [${res.error}]`
                    );
                });
            } else {
                console.error('Fetch failed:', err); // Catch the undefined error
                errorNotification("Something went wrong...", err.message);
            }
        }).finally(() => setFetching(false));

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents().then(r => console.log(r));
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <ProgressSpin/>;
        }

        return <Table
            dataSource={students}
            columns={columns(fetchStudents)}
            bordered
            title={() =>
                <>
                    <AddStudent fetchStudents={fetchStudents} students={students} />
                    <Flex>
                        <Tag>Number of students</Tag>
                        <Badge count={students.length} showZero color="#52c41a"/>
                    </Flex>
                </>
            }
            pagination={{
                pageSize: 50,
            }}
            scroll={{y: 500}}
            rowKey={(student) => student.id}
        />;
    }
    console.log('MainLayout rendered')
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Students</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderStudents()}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    By Konrad Krasowski
                </Footer>
            </Layout>
        </Layout>
    );
}

export default MainLayout;
