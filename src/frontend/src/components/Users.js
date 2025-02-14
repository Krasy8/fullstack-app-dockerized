import React, { useState, useEffect } from 'react';
import {Badge, Empty, Popconfirm, Radio, Table, Tag} from "antd";
import {errorNotification, successNotification} from "./Notification";
import {deleteUser, getAllUsers} from "../client";


const deleteAppUser = (id, callback) => {
    deleteUser(id).then(() => {
        successNotification("User deleted", `User with id: ${id} has been deleted from the system`);
        callback();
    }).catch(err => {
        console.error(err.response);
        err.response.json().then(res => {
            errorNotification("Something went wrong...",
                `${res.message} [${res.status}] [${res.error}]`,
                "bottomLeft");
        });
    });
}

const usersColumns = fetchUsers => [
    {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
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
        title: 'Admin Code',
        dataIndex: 'adminCode',
        key: 'adminCode',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, user) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${user.userId}`}
                    onConfirm={() => deleteAppUser(user.userId, fetchUsers)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button key={`delete-${user.userId}`} value="small">Delete</Radio.Button>
                </Popconfirm>
            </Radio.Group>
    }
];


const Users = () => {
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchUsers = async () => {
        setFetching(true);
        try {
            const data = await getAllUsers();
            console.log("Fetching users:", data);
            if (!data || !Array(data)) {
                setUsers([]);
                return;
            }
            setUsers(data);
        } catch (err) {
            console.error("Fetch users error:", err);
            errorNotification("Something went wrong...", err.message || "Unable to fetch users");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const emptyUsers = (users) => {
        if (users.length <= 0) {
            return <Empty />
        }
    }

    return (
        <Table
            dataSource={users}
            columns={usersColumns(fetchUsers)}
            bordered
            title={() =>
                <>
                    <br /><br />
                    {emptyUsers(users)}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Tag>Number of Users</Tag>
                        <Badge count={users.length} showZero color="#52c41a" />
                    </div>
                </>
            }
            pagination={{
                pageSize: 50,
            }}
            scroll={{ y: 1500 }}
            rowKey={(user) => user.userId}
        />
    );
}

export default Users;
