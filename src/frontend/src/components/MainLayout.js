import React, {useState, useEffect} from 'react';
import '../css/customCSS.css';
import {jwtDecode} from "jwt-decode";
import {
    BarcodeOutlined,
    FileOutlined, TeamOutlined,
    UsergroupAddOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';

import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Button
} from 'antd';

import Students from "./Students";
import AdminCodes from './AdminCodes';


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

function MainLayout( {handleLogout} ) {

    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('1'); // Track active tab
    const [userAuthorities, setUserAuthorities] = useState([]);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

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

    const renderContent = () => {
        switch (activeTab) {
            case '1':
                return <Students />//renderStudents();
            case '2':
                return <AdminCodes />//renderAdminCodes();
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
                    onClick={({key}) => setActiveTab(key)}
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
                        shape="round"
                        icon={<LogoutOutlined/>}
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
