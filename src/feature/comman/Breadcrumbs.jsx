import React from "react";
import { Breadcrumb } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function Breadcrumbs({
    title,
    items = [],
    showBack = true,
    backTo = null
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) navigate(backTo);
        else navigate(-1);
    };

    return (
        <div style={{ padding: "8px 12px", marginBottom:8, borderBottom:"1px solid #e0e0e0" }}>

            {/* Title Row */}
            {title && (
                <h2 style={{ fontWeight: 600, marginBottom: 10 }}>
                    {title}
                </h2>
            )}

            {/* Breadcrumb Row */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Breadcrumb separator=" / ">
                    {showBack && (
                        <Breadcrumb.Item>
                            <span
                                onClick={handleBack}
                                style={{ 
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontWeight: 500
                                }}
                            >
                                <ArrowLeftOutlined />
                                Back
                            </span>
                        </Breadcrumb.Item>
                    )}

                    {items.map((item, i) => (
                        <Breadcrumb.Item key={i}>
                            {item.href ? (
                                <Link to={item.href}>{item.label}</Link>
                            ) : (
                                item.label
                            )}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
        </div>
    );
}
