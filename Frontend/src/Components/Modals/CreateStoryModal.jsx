import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography,
  Card,
  Divider,
  Row,
  Col,
  Spin,
  Tag,
  Badge
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CalendarOutlined,
  EditOutlined,
  TagOutlined,
  CameraOutlined,
  PictureOutlined,
  FileTextOutlined,
  BookOutlined,
  ScheduleOutlined,
  BarsOutlined,
  AppstoreOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
  CloseOutlined,
  CheckOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

const themeColors = {
  primary: "#11847b",      // Teal-blue from your logo
  secondary: "#0A3B48",    // Dark teal from your logo
  accent: "#5FBDCE",       // Light teal accent from your logo
  background: "#F8FAFC",   // Light background that complements teal
  surface: "#F5F5F5",      // Light surface color
  cardBg: "#FFFFFF",       // Pure white for content blocks
  textPrimary: "#0A3B48",  // Dark teal from logo for primary text
  textSecondary: "#11847b", // Medium teal for secondary text
  border: "#CBD5E1",     // Light gray-blue border
  hover: "#1D4ED8",      // Darker blue for hover states
  danger: "#EF4444",     // Red for errors and warnings
  success: "#10B981",    // Green for success states (lighter than your logo green)
  neutral: "#94A3B8",    // Neutral gray-blue for inactive elements
  accentOrange: "#FF9800", // Orange accent from your logo
  accentPurple: "#9C27B0", // Purple accent from your logo
  shadow: "rgba(33, 150, 243, 0.1)", // Shadow color based on your logo blue
  gradient: "linear-gradient(145deg, #11847b 0%,rgba(28, 138, 169, 0.73) 100%)"
};


const uploader = new UploadFileService();
const { Option } = Select;
const { Text, Title } = Typography;

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "",
    timeDuration: 30,
    intensity: "",
    image: ""
  });

  // Define difficulty options with their colors
  const difficultyOptions = [
    { value: "No Efforts", label: "Beginner", color: "#52c41a" },
    { value: "Mid Efforts", label: "Easy", color: "#1890ff" },
    { value: "Moderate Efforts", label: "Intermediate", color: "#faad14" },
    { value: "Severe Efforts", label: "Advanced", color: "#f5222d" },
    { value: "Maximal Efforts", label: "Expert", color: "#722ed1" }
  ];

  // Get selected difficulty color
  const getDifficultyColor = () => {
    const selectedDifficulty = difficultyOptions.find(option => option.value === formData.intensity);
    return selectedDifficulty ? selectedDifficulty.color : themeColors.primary;
  };

  // Duration markers for slider
  const durationMarks = {
    0: '0',
    15: '15',
    30: '30',
    45: '45',
    60: '60',
    90: '90',
    120: '120'
  };

  // Function to get intensity color based on duration
  const getIntensityColor = (duration, type = '') => {
    if (type === 'bg') {
      // Return background colors for Tag component
      if (duration < 15) return '#f6ffed';  // Light green bg
      if (duration < 30) return '#e6f7ff';  // Light blue bg
      if (duration < 60) return '#fff7e6';  // Light orange bg
      return '#fff1f0';                     // Light red bg
    } else if (type === 'text') {
      // Return text colors for Tag component
      if (duration < 15) return '#52c41a';  // Green text
      if (duration < 30) return '#1890ff';  // Blue text
      if (duration < 60) return '#faad14';  // Orange text
      return '#f5222d';                     // Red text
    } else {
      // Return normal colors for other elements
      if (duration < 15) return '#52c41a';  // Light green
      if (duration < 30) return '#1890ff';  // Blue
      if (duration < 60) return '#faad14';  // Orange
      return '#f5222d';                     // Red
    }
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 4,
            height: 24,
            background: themeColors.primary,
            marginRight: 12,
            borderRadius: 2
          }} />
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Create Learning Plan
          </Title>
        </div>
      }
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      width={650}
      bodyStyle={{ 
        padding: '20px', 
        backgroundColor: themeColors.background,
        borderRadius: '10px'
      }}
      footer={null}
      centered
    >
      <Card 
        bordered={false} 
        style={{ 
          background: 'linear-gradient(to bottom, #ffffff, #f9f9fd)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          maxHeight: '75vh',
          overflow: 'auto',
          padding: '8px'
        }}
      >
        <Form 
          form={form} 
          layout="vertical"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px' 
          }}
        >
          <Row gutter={24}>
            <Col span={24}>
              {uploadedImage ? (
                <div style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  <img
                    style={{ 
                      width: "100%", 
                      height: "250px",
                      objectFit: 'cover'
                    }}
                    src={uploadedImage}
                    alt="Learning Plan"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '40px 16px 16px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                  }}>
                    <Upload
                      accept="image/*"
                      onChange={handleFileChange}
                      showUploadList={false}
                      beforeUpload={() => false}
                    >
                      <Button 
                        icon={<CameraOutlined />} 
                        type="primary"
                        ghost
                        style={{ 
                          borderColor: 'white', 
                          color: 'white',
                          borderRadius: '8px',
                          backdropFilter: 'blur(4px)',
                          background: 'rgba(255,255,255,0.15)'
                        }}
                      >
                        Change Cover
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                <div style={{
                  marginBottom: '20px',
                  border: `2px dashed ${themeColors.borderLight}`,
                  borderRadius: '16px',
                  padding: '50px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.02)'
                }}>
                  {imageUploading ? (
                    <div style={{ textAlign: 'center' }}>
                      <Spin size="large" />
                      <div style={{ marginTop: '12px' }}>
                        <Text>Uploading image...</Text>
                      </div>
                    </div>
                  ) : (
                    <Upload
                      accept="image/*"
                      onChange={handleFileChange}
                      showUploadList={false}
                      beforeUpload={() => false}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <PictureOutlined style={{ fontSize: '36px', color: themeColors.primary, marginBottom: '12px' }} />
                        <div>
                          <Text strong style={{ fontSize: '16px' }}>Upload Cover Image</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '13px' }}>Recommended 16:9 ratio</Text>
                        </div>
                      </div>
                    </Upload>
                  )}
                </div>
              )}
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={16}>
              <Form.Item label={
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                  <FileTextOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Plan Title
                </span>
              } name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
                <Input
                  placeholder="Enter your learning plan title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ borderRadius: '8px', height: '42px' }}
                  prefix={<BookOutlined style={{ color: themeColors.textLight }} />}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                  <CalendarOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Schedule Date
                </span>
              } name="timestamp">
                <DatePicker
                  placeholder="Select date"
                  style={{ width: "100%", borderRadius: '8px', height: '42px' }}
                  value={formData.timestamp}
                  onChange={handleDateChange}
                  suffixIcon={<ScheduleOutlined style={{ color: themeColors.primary }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <BarsOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
              Learning Category
            </span>
          } name="exerciseType">
            <Input
              placeholder="What type of learning activity?"
              name="exerciseType"
              value={formData.exerciseType}
              onChange={handleInputChange}
              style={{ borderRadius: '8px', height: '42px' }}
              prefix={<AppstoreOutlined style={{ color: themeColors.textLight }} />}
            />
          </Form.Item>
          
          <Divider style={{ margin: '4px 0', background: themeColors.borderLight }} />
          
          <Form.Item 
            label={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                  <FieldTimeOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Session Duration
                </span>
                <Tag 
                  color={getIntensityColor(formData.timeDuration, 'bg')}
                  style={{ 
                    color: getIntensityColor(formData.timeDuration, 'text'),
                    borderRadius: '12px',
                    padding: '2px 12px',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  {formData.timeDuration} minutes
                </Tag>
              </div>
            }
            name="timeDuration"
            style={{ marginBottom: 0 }}
          >
            <div style={{ 
              backgroundColor: 'white',
              padding: '18px 16px',
              borderRadius: '12px',
              border: `1px solid ${themeColors.borderLight}`,
              background: 'rgba(0,0,0,0.02)'
            }}>
              <Slider
                min={0}
                max={120}
                step={15}
                value={formData.timeDuration}
                marks={durationMarks}
                tooltip={{ formatter: value => `${value} min` }}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    timeDuration: value,
                  });
                }}
                trackStyle={{ backgroundColor: themeColors.primary }}
                handleStyle={{ borderColor: themeColors.primary, boxShadow: `0 0 0 5px rgba(${themeColors.primaryRgb}, 0.12)` }}
              />
            </div>
          </Form.Item>

          <Form.Item label={
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <ThunderboltOutlined 
                style={{ 
                  marginRight: '8px', 
                  color: formData.intensity ? getDifficultyColor() : themeColors.primary 
                }} 
              />
              Difficulty Level
            </span>
          } name="intensity">
            <Select
              placeholder="Select difficulty level"
              style={{ width: "100%", borderRadius: '8px', height: '42px' }}
              value={formData.intensity}
              onChange={handleIntensityChange}
              suffixIcon={
                <ThunderboltOutlined 
                  style={{ 
                    color: formData.intensity ? getDifficultyColor() : themeColors.primary 
                  }} 
                />
              }
              dropdownStyle={{ borderRadius: '8px' }}
            >
              {difficultyOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge color={option.color} style={{ marginRight: '8px' }} />
                    {option.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label={
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <FileTextOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
              Description
            </span>
          } name="description">
            <Input.TextArea
              placeholder="Add details about this learning plan (goals, materials needed, etc.)..."
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '16px',
              gap: '12px'
            }}
          >
            <Button 
              key="cancel" 
              onClick={() => (state.createWorkoutStatusModalOpened = false)}
              style={{
                borderRadius: '8px',
                height: '42px',
                width: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              key="create"
              type="primary"
              onClick={handleCreateWorkoutStory}
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                borderColor: 'transparent',
                borderRadius: '8px',
                height: '42px',
                width: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)"
              }}
              icon={<CheckOutlined />}
            >
              Create Learning Plan
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default CreateStoryModal;