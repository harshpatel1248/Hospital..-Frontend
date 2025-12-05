import { Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "../../hcss.css";  // if sidebar styles exist here

export default function SidebarMenu({ collapsed }) {

    const navigate = useNavigate();
    const location = useLocation();

    // 🔥 Menu Click Handler
    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    // 🔥 Menu Items with Doctors Submenu
    const menuItems = [
        { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
        {
            key: "doctor",
            icon: <UserOutlined />,
            label: "Doctor",
            children: [
                { key: "/doctor-onbording", label: "Doctor List" }
            ]
        },
        
        {
            key: "recipient",
            icon: <UserOutlined />,
            label: "Recipient",
            children: [
                { key: "/recipient-onboarding", label: "Recipient List" }
            ]
        },
        {
            key: "patitent",
            icon: <UserOutlined />,
            label: "Patients",
            children: [
                { key: "/patitent-onboarding", label: "Patitent List" }
            ]
        },


        { key: "/profile", icon: <UserOutlined />, label: "Profile" }
    ];

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={[location.pathname.startsWith("/doctor") ? "doctor" : ""]}
            items={menuItems}
            onClick={handleMenuClick}
        />
    );
}
