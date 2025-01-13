import React, {useState, useEffect} from 'react';
import {jwtDecode} from "jwt-decode";
import {
    BarcodeOutlined,
    FileOutlined, PlusOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
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
    Radio, Popconfirm, Button, Empty
} from 'antd';

import ProgressSpin from "./Spin";
import {deleteStudent, getAllStudents, fetchApi} from "../client";
import AddStudent from "./AddNewStudent"
import {errorNotification, successNotification} from "./Notification";

const { Header,
    Content,
    Footer,
    Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

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

function deleteAdminCode(id, fetchAdminCodes) {
    return undefined;
}

const adminCodesColumns = fetchAdminCodes => [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Expiration Date',
        dataIndex: 'expirationDate',
        key: 'expirationDate',
    },
    {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: 'Used At',
        dataIndex: 'usedAt',
        key: 'usedAt',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, adminCode) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${adminCode.code}`}
                    onConfirm={() => deleteAdminCode(adminCode.id, fetchAdminCodes)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
            </Radio.Group>
    }
];

function MainLayout( {handleLogout} ) {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('1'); // Track active tab
    const [userAuthorities, setUserAuthorities] = useState([]);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const [students, setStudents] = useState([]);
    const [adminCodes, setAdminCodes] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            const decodedJwt = jwtDecode(jwtToken);
            console.log("user authorities from jwt: ", decodedJwt);
            const authorities = decodedJwt.authorities;
            setUserAuthorities(authorities || []);
            console.log("user authorities after setting: ", userAuthorities);
        }
    }, []);

    const fetchStudents = async () => {
        setFetching(true);
        try {
            const data = await fetchApi("/students", { method: "GET" });
            console.log("Fetching students:", data);
            if (!data || !Array.isArray(data)) {
                setStudents([]); // Fallback to an emptyAdminCodes array if the response is invalid
                return;
            }
            setStudents(data);
        } catch (err) {
            console.error("Fetch students error:", err);
            errorNotification("Something went wrong...", err.message || "Unable to fetch students");
        } finally {
            setFetching(false);
        }
    };

    const fetchAdminCodes = async () => {
        setFetching(true);
        try {
            const data = await fetchApi("/master/admin-codes", { method: "GET" });
            console.log("Fetching admin codes:", data);
            if (!data || !Array.isArray(data)) {
                setAdminCodes([]); // Fallback to an emptyAdminCodes array if the response is invalid
                return;
            }
            setAdminCodes(data);
        } catch (err) {
            console.error("Fetch admin codes error:", err);
            errorNotification("Something went wrong...", err.message || "Unable to fetch admin codes");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents().then(r => console.log(r));

        if (userAuthorities.includes('ROLE_MASTER')) {
            fetchAdminCodes().then(r => console.log(r));
        }
    }, []);

    const renderStudents = () => {
        console.log(students);
        if (fetching) {
            return <ProgressSpin/>;
        }

        return <Table
            dataSource={students}
            columns={studentColumns(fetchStudents)}
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

    const emptyAdminCodes = (adminCodes) => {
        if (adminCodes.length <=0){
            return <Empty/>
        }
    }

    const handleAdminCodesTabClick = async () => {
        setActiveTab('2');
        await fetchAdminCodes();
    }

    const generateNewAdminCode = async () => {
        try {
            await fetchApi("/master/generate-admin-code", {
                method: "POST",
            });
            successNotification(
                "New Admin Code has been successfully generated",
                `A new Admin Code has been generated`
            );
            await fetchAdminCodes(); // Refresh the students list
        } catch (err) {
            console.error("Add Admin Code error:", err);
            const errorMessage = err.message || "Unexpected error occurred";
            errorNotification("Something went wrong...", errorMessage, "bottomLeft");
        }
    };

    const renderAdminCodes = () => {
        console.log(adminCodes);
        if (fetching) {
            return <ProgressSpin/>;
        }

        return <Table
            dataSource={adminCodes}
            columns={adminCodesColumns(fetchAdminCodes)}
            bordered
            title={() =>
                <>
                    <Button type="primary"
                            onClick={generateNewAdminCode}
                            icon={<PlusOutlined/>}
                            style={{marginRight: '10px'}}>
                        New Admin Code
                    </Button>
                    <br/><br/>
                    <>
                        {emptyAdminCodes(adminCodes)}
                    </>
                    <Flex>
                        <Tag>Number of Admin Codes</Tag>
                        <Badge count={adminCodes.length} showZero color="#52c41a"/>
                    </Flex>
                </>
            }
            pagination={{
                pageSize: 50,
            }}
            scroll={{y: 500}}
            rowKey={(adminCode) => adminCode.id}
        />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case '1':
                return renderStudents();
            case '2':
                return renderAdminCodes();
            default:
                return <div>Select a tab to view content.</div>;
        }
    }

    const breadCrumbTitle = () => {
        switch (activeTab) {
            case '1':
                return 'Students';
            case '2':
                return 'Admin Codes';
            default:
                return 'User';
        }
    }

    const isMasterUser = userAuthorities.includes('ROLE_MASTER');

    const menuItems = [
        getItem('Students', '1', <UsergroupAddOutlined/>),
        isMasterUser && getItem('Admin Codes', '2', <BarcodeOutlined/>),
        getItem('User', 'sub1', <UserOutlined/>, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Files', '9', <FileOutlined/>),
    ].filter(Boolean);

    console.log('MainLayout rendered')

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={menuItems}
                    onClick={handleAdminCodesTabClick} // update active tab
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}

                >
                    <Button
                        type="primary"
                        danger
                        onClick={handleLogout}
                        style={{ float: 'right', margin: '16px' }}
                    >
                        Log Out
                    </Button>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                        items={[
                            {
                                title: breadCrumbTitle(),
                            },
                            // {
                            //     title: <a href="">Application Center</a>,
                            // },
                            // {
                            //     title: <a href="">Application List</a>,
                            // },
                            // {
                            //     title: 'An Application',
                            // },
                        ]}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderContent()}
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
