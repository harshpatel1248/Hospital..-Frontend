import React, { useEffect, useState } from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Tag,
    Tooltip,
    Popconfirm,
    message,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../comman/Breadcrumbs";
import "../../hcss.css"

import {
    fetchPatients,
    deletePatient,
    resetPatientState,
} from "../../slices/patientSlice";

import { useNavigate } from "react-router-dom";

const PatientOnboardingList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        patients,
        total,
        page,
        limit,
        loading,
    } = useSelector((state) => state.patient);

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadPatients();
        return () => dispatch(resetPatientState());
    }, []);

    const loadPatients = (pageValue = 1, searchValue = "") => {
        dispatch(
            fetchPatients({
                page: pageValue,
                limit: 10,
                orderBy: "createdAt",
                order: "DESC",
                search: searchValue,
            })
        );
    };

    const handleSearch = () => loadPatients(1, search);

    const handleDelete = (id) => {
        dispatch(deletePatient(id))
            .unwrap()
            .then(() => {
                message.success("Deleted!");
                loadPatients(page, search);
            })
            .catch((err) => message.error(err));
    };

    const columns = [
        {
            title: "Full Name",
            key: "name",
            dataIndex: "name",
            width: 150,
            fixed: "left",
            ellipsis: true,
            sorter: (a, b) =>
                (`${a.firstName} ${a.lastName}`).localeCompare(
                    `${b.firstName} ${b.lastName}`
                ),
            render: (_, record) => (
                <Tooltip title={`${record.firstName} ${record.lastName}`}>
                    <span>
                        {record.firstName} {record.lastName}
                    </span>
                </Tooltip>
            ),
        },

        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 130,
            ellipsis: true,
            sorter: (a, b) => a.phone.localeCompare(b.phone),
            render: (value) => (
                <Tooltip title={value}>
                    <span>{value}</span>
                </Tooltip>
            ),
        },

        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            width: 100,
            ellipsis: true,
            sorter: (a, b) => a.gender.localeCompare(b.gender),
            render: (value) => (
                <Tooltip title={value?.toUpperCase()}>
                    <Tag color={value === "male" ? "blue" : "pink"}>
                        {value?.toUpperCase()}
                    </Tag>
                </Tooltip>
            ),
        },

        {
            title: "Case",
            dataIndex: "caseType",
            key: "caseType",
            width: 90,
            ellipsis: true,
            sorter: (a, b) => a.caseType.localeCompare(b.caseType),
            render: (value) => {
                const color =
                    value === "ipd"
                        ? "purple"
                        : value === "opd"
                            ? "green"
                            : "orange";

                return (
                    <Tooltip title={value?.toUpperCase()}>
                        <Tag color={color}>{value?.toUpperCase()}</Tag>
                    </Tooltip>
                );
            },
        },

        {
            title: "Phone",
            key: "altPhone",
            width: 170,
            ellipsis: true,
            sorter: (a, b) =>
                `${a.phone}${a.altPhone}`.localeCompare(`${b.phone}${b.altPhone}`),
            render: (record) => {
                const text = `${record.phone}${record.altPhone ? " / " + record.altPhone : ""}`;
                return (
                    <Tooltip title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
        },

        {
            title: "Address",
            key: "address",
            width: 220,
            ellipsis: true,
            sorter: (a, b) => {
                const addrA = `${a.address?.line1 || ""} ${a.address?.city || ""}`;
                const addrB = `${b.address?.line1 || ""} ${b.address?.city || ""}`;
                return addrA.localeCompare(addrB);
            },
            render: (record) => {
                const a = record.address;
                const text = `${a?.line1 || ""}, ${a?.city || ""}, ${a?.state || ""}`;
                return (
                    <Tooltip title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
        },

        {
            title: "Blood Group",
            dataIndex: "bloodGroup",
            key: "bloodGroup",
            width: 120,
            ellipsis: true,
            sorter: (a, b) => (a.bloodGroup || "").localeCompare(b.bloodGroup || ""),
            render: (value) => (
                <Tooltip title={value || "—"}>
                    <span>{value || "—"}</span>
                </Tooltip>
            ),
        },

        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            width: 100,
            ellipsis: true,
            sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
            render: (value) => {
                const color = value ? "green" : "red";
                const text = value ? "ACTIVE" : "INACTIVE";

                return (
                    <Tooltip title={text}>
                        <Tag color={color}>{text}</Tag>
                    </Tooltip>
                );
            },
        },

        {
            title: "Created On",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 140,
            ellipsis: true,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (value) => {
                const date = dayjs(value).format("DD MMM YYYY");
                return (
                    <Tooltip title={date}>
                        <span>{date}</span>
                    </Tooltip>
                );
            },
        },

        {
            title: "Updated On",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 140,
            ellipsis: true,
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            render: (value) => {
                const date = dayjs(value).format("DD MMM YYYY");
                return (
                    <Tooltip title={date}>
                        <span>{date}</span>
                    </Tooltip>
                );
            },
        },

        {
            title: "Actions",
            key: "actions",
            width: 130,
            fixed: "right",
            render: (_, record) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/view-patitent/${record._id}`)}
                        />
                    </Tooltip>

                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/add-edit-patitent/${record._id}`)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete patient?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Tooltip title="Delete">
                            <Button danger type="link" icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];



    return (
        <>
            <div>
                {/* Header Row */}
                <Breadcrumbs
                    title="Patitent List"
                    showBack={true}
                    backTo="/doctors"
                    items={[
                        { label: "Doctors", href: "/doctors" },
                    ]}
                />
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Input.Search
                            placeholder="Search patients..."
                            enterButton
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                        />

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="btn"
                            onClick={() => navigate("/add-edit-patitent")}
                        >
                            Add Patient
                        </Button>
                    </Space>
                </div>

                {/* Patient Table */}
            </div>

            <div className="table-scroll-container">
                <Table
                    className="fixed-pagination"
                    rowKey={(record) => record._id}
                    columns={columns}
                    dataSource={patients}
                    loading={loading}
                    style={{ textAlign: "left" }}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total,
                        onChange: (p) => loadPatients(p, search),
                    }}
                />
            </div>
        </>
    );
};

export default PatientOnboardingList;
