// AdminCodes.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, Badge, Empty, Radio, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProgressSpin from "./Spin";
import { deleteAdminCode, getAllAdminCodes, generateAdminCode } from "../client";
import { errorNotification, successNotification } from "./Notification";

const removeAdminCode = (id, callback) => {
    deleteAdminCode(id).then(() => {
        successNotification("Admin Code deleted", `Admin Code with id: ${id} has been deleted from the system`);
        callback();
    }).catch(err => {
        console.error(err.response);
        err.response.json().then(res => {
            errorNotification("Something went wrong...",
                `${res.message} [${res.status}] [${res.error}]`,
                "bottomLeft"
            );
        });
    });
};

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
        render: (expirationDate, record) => {
            const isExpired = new Date(expirationDate) < new Date();
            const isUsed = !!record.usedAt;
            const cellClass = (isExpired && !isUsed) ? 'expired-unused' : '';
            return (
                <div className={cellClass}>
                    {expirationDate}
                </div>
            );
        }
    },
    {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
        render: (text, adminCode) => adminCode.userId ?? "N/A"
    },
    {
        title: 'Used At',
        dataIndex: 'usedAt',
        key: 'usedAt',
        render: (text, adminCode) => adminCode.usedAt ?? "N/A"
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, adminCode) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${adminCode.code}`}
                    onConfirm={() => removeAdminCode(adminCode.id, fetchAdminCodes)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button key={`delete-${adminCode.id}`} value="small">Delete</Radio.Button>
                </Popconfirm>
            </Radio.Group>
    }
];

const AdminCodes = () => {
    const [adminCodes, setAdminCodes] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchAdminCodes = async () => {
        setFetching(true);
        try {
            const data = await getAllAdminCodes();
            console.log("Fetching admin codes:", data);
            if (!data || !Array.isArray(data)) {
                setAdminCodes([]); // Fallback to an empty array if the response is invalid
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
        fetchAdminCodes();
    }, []);

    const emptyAdminCodes = (adminCodes) => {
        if (adminCodes.length <= 0) {
            return <Empty />;
        }
    };

    const generateNewAdminCode = async () => {
        try {
            await generateAdminCode();
            successNotification(
                "New Admin Code has been successfully generated",
                "A new Admin Code has been generated"
            );
            await fetchAdminCodes(); // Refresh the admin codes list
        } catch (err) {
            console.error("Add Admin Code error:", err);
            const errorMessage = err.message || "Unexpected error occurred";
            errorNotification("Something went wrong...", errorMessage, "bottomLeft");
        }
    };

    if (fetching) {
        return <ProgressSpin />;
    }

    return (
        <Table
            dataSource={adminCodes}
            columns={adminCodesColumns(fetchAdminCodes)}
            bordered
            title={() =>
                <>
                    <Button type="primary"
                            onClick={generateNewAdminCode}
                            icon={<PlusOutlined />}
                            style={{ marginRight: '10px' }}>
                        New Admin Code
                    </Button>
                    <br /><br />
                    {emptyAdminCodes(adminCodes)}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Tag>Number of Admin Codes</Tag>
                        <Badge count={adminCodes.length} showZero color="#52c41a" />
                    </div>
                </>
            }
            pagination={{
                pageSize: 50,
            }}
            scroll={{ y: 1500 }}
            rowKey={(adminCode) => adminCode.id}
        />
    );
};

export default AdminCodes;
