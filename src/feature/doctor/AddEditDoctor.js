import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Row,
    Col,
    Card,
    Button,
    InputNumber,
    Upload,
    message,
    Checkbox,
    Spin,
    Select
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fetchDoctorById, updateDoctor, createDoctor } from "../../slices/doctorSlice";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../comman/Breadcrumbs";
import doctorService from "../../services/doctorService";

export default function AddEditDoctor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [oldImage, setOldImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [specLoading, setSpecLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [deptLoading, setDeptLoading] = useState(false);
    const [degrees, setDegrees] = useState([]);
    const [degreeLoading, setDegreeLoading] = useState(false);




    // <-- NEW LOADER

    const buildImageUrl = (img) => {
        if (!img) return null;

        // Full URL already?
        if (img.startsWith("http")) return img;

        // Backend returned "/uploads/users/xyz.png"
        if (img.startsWith("/uploads/users/")) {
            return `${process.env.REACT_APP_API_URL}${img}`;
        }

        // Backend returned only filename "xyz.png"
        return `${process.env.REACT_APP_API_URL}/uploads/users/${img}`;
    };

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            dispatch(fetchDoctorById(id))
                .unwrap()
                .then((res) => {
                    const doctor = res.doctor?.doctor || res.doctor;
                    if (!doctor) return;

                    form.setFieldsValue({
                        name: doctor.name,
                        email: doctor.email,
                        phone: doctor.phone,
                        specialization: doctor.specialization,
                        department: doctor.department,
                        experience: doctor.experience,
                        fees: doctor.fees,
                        education: doctor.education,
                        availability: doctor.availability,
                    });

                    if (doctor.image) {
                        setPreview(buildImageUrl(doctor.image));
                        setOldImage(doctor.image);
                    }
                })
                .catch(() => message.error("Failed to load doctor"))
                .finally(() => setLoading(false));
        }
    }, [isEdit, id, dispatch, form]);

    const fetchSpecializations = () => {
        setSpecLoading(true);

        doctorService.getSpecializations()
            .then((res) => {
                setSpecializations(res.specializations || []);
            })
            .finally(() => setSpecLoading(false));
    };

    const fetchDepartments = () => {
        setDeptLoading(true);
        doctorService.getDepartments()
            .then((res) => {
                setDepartments(res.departments || []);
            })
            .finally(() => setDeptLoading(false));
    };

    const fetchDegreesList = async () => {
        try {
            setDegreeLoading(true);
            const res = await doctorService.getDegrees({ page: 1, limit: 200 }); // get full list
            setDegrees(res.degrees || []);
        } catch (error) {
            setDegrees([]);
        } finally {
            setDegreeLoading(false);
        }
    };


    // 📌 Image selection
    const handleImageChange = (info) => {
        const file = info.file;

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return message.error("Only image files allowed");
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    // 📌 Submit form
    const onFinish = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();

            if (imageFile) {
                formData.append("image", imageFile);
            } else if (isEdit && oldImage && !preview) {
                formData.append("image", "");
            }

            Object.keys(values).forEach((key) => {
                if (key === "education" || key === "availability") {
                    formData.append(key, JSON.stringify(values[key]));
                } else {
                    formData.append(key, values[key]);
                }
            });

            let result;

            // 🔵 UPDATE DOCTOR
            if (isEdit) {
                result = await dispatch(updateDoctor({ id, data: formData })).unwrap();

                if (result?.doctor?.image) {
                    setPreview(buildImageUrl(result.doctor.image));
                }

                return message.success({
                    content: "Doctor updated successfully!",
                    duration: 1,
                    onClose: () => navigate("/doctor-onbording")
                });
            }

            // 🟢 CREATE DOCTOR
            result = await dispatch(createDoctor(formData)).unwrap();

            if (result?.doctor?.image) {
                setPreview(buildImageUrl(result.doctor.image));
            }

            return message.success({
                content: "Doctor created successfully!",
                duration: 1,
                onClose: () => navigate("/doctor-onbording")
            });

        } catch (error) {
            const backendMsg =
                error?.response?.data?.details?.[0] ||
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong!";

            message.error(backendMsg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading && (
                <Spin fullscreen size="large" tip="Loading..." />
            )}
            <Breadcrumbs
                title={isEdit ? "Edit Doctor" : "Add New Doctor"}
                showBack={true}
                backTo="/doctors"
                items={[
                    { label: "Doctors", href: "/doctors" },
                    { label: isEdit ? "Edit Doctor" : "Add New Doctor" }
                ]}
            />


            <div className="doctor-form-wrapper patient-wrapper" style={{ opacity: loading ? 0.5 : 1 }}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    {/* IMAGE UPLOAD */}
                    <Card className="doctor-card">
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={() => false}
                            accept="image/*"
                            onChange={handleImageChange}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="doctor"
                                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                                />
                            ) : (
                                <div>
                                    <PlusOutlined style={{ fontSize: 24 }} />
                                    <div>Upload Doctor Photo</div>
                                </div>
                            )}
                        </Upload>

                    </Card>

                    {/* BASIC INFO */}
                    <Card title="Basic Information" className="doctor-card">
                        <Row gutter={15}>
                            <Col span={8}>
                                <Form.Item
                                    label="Doctor Name"
                                    name="name"
                                    rules={[{ required: true, message: "Doctor name is required" }]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: "Email is required" },
                                        { type: "email", message: "Enter a valid email" },
                                    ]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    rules={[
                                        { required: true, message: "Phone number is required" },
                                        { len: 10, message: "Phone must be 10 digits" },
                                    ]}
                                >
                                    <Input maxLength={10} disabled={loading} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* PROFESSIONAL INFO */}
                    <Card title="Professional Info" className="doctor-card">
                        <Row gutter={15}>
                            <Col span={6}>
                                <Form.Item
                                    name="specialization"
                                    label="Specialization"
                                    rules={[{ required: true, message: "Specialization is required" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Specialization"
                                        loading={loading || specLoading}
                                        disabled={loading}
                                        allowClear
                                        onClick={() => {
                                            // Fetch only once OR always fetch if you want
                                            if (specializations.length === 0) {
                                                fetchSpecializations();
                                            }
                                        }}
                                    >
                                        {specializations.map((item) => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="department"
                                    label="Department"
                                    rules={[{ required: true, message: "Department is required" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Department"
                                        loading={deptLoading}
                                        disabled={loading}
                                        allowClear
                                        onClick={() => {
                                            if (departments.length === 0) {
                                                fetchDepartments();   // 🔥 Hit API on click
                                            }
                                        }}
                                    >
                                        {departments.map((item) => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>


                            <Col span={6}>
                                <Form.Item
                                    name="experience"
                                    label="Experience"
                                    rules={[{ required: true, message: "Experience is required" }]}
                                >
                                    <InputNumber style={{ width: "100%" }} disabled={loading} />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item
                                    name="fees"
                                    label="Consultation Fees"
                                    rules={[{ required: true, message: "Consultation fee is required" }]}
                                >
                                    <InputNumber style={{ width: "100%" }} disabled={loading} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* EDUCATION */}
                    <Card title="Education" className="doctor-card">
                        <Row gutter={15}>
                            <Col span={6}>
                                <Form.Item
                                    name={["education", 0, "degree"]}
                                    label="Degree"
                                    rules={[{ required: true, message: "Degree is required" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Degree"
                                        loading={degreeLoading}
                                        disabled={degreeLoading}
                                        allowClear
                                        onClick={() => {
                                            if (degrees.length === 0) {
                                                fetchDegreesList();   // 🔥 API hit on click (load once)
                                            }
                                        }}
                                    >
                                        {degrees.map((item) => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>


                            <Col span={6}>
                                <Form.Item
                                    name={["education", 0, "institute"]}
                                    label="Institute"
                                    rules={[{ required: true, message: "Institute is required" }]}
                                >
                                    <Input disabled={loading} />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item
                                    name={["education", 0, "year"]}
                                    label="Year"
                                    rules={[{ required: true, message: "Year is required" }]}
                                >
                                    <InputNumber style={{ width: "100%" }} disabled={loading} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* AVAILABILITY */}
                    <Card title="Availability" className="doctor-card">
                        <Row gutter={10}>
                            {[
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                            ].map((day) => (
                                <Col span={3} key={day}>
                                    <Form.Item name={["availability", day]} valuePropName="checked">
                                        <Checkbox disabled={loading}>{day}</Checkbox>
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    </Card>

                    {/* SUBMIT */}
                    <div style={{ textAlign: "right", marginTop: 10 }}>
                        <Button type="primary" htmlType="submit" disabled={loading} className="btn">
                            {loading ? "Processing..." : isEdit ? "Update Doctor" : "Create Doctor"}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
}
