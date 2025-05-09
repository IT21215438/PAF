import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";
import { BookOutlined, TrophyOutlined, ToolOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
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
const CreateLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Learning Progress data object
      const LearningProgressData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await LearningProgressService.CreateLearningProgressModal(LearningProgressData);
      state.LearningProgresss = await LearningProgressService.getAllLearningProgresss();
      
      // Success message
      message.success("Learning Progress created successfully!");

      // Reset form and close modal
      form.resetFields();
      state.CreateLearningProgressModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);
      
      // Error message
      message.error("Failed to create Learning Progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    state.CreateLearningProgressModalOpened = false;
  };

  return (
    <Modal
      title={
        <div style={{ 
          borderBottom: `2px solid ${themeColors.secondary}`, 
          paddingBottom: 8,
          marginBottom: 8
        }}>
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Share Learning Progress
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Document your journey and inspire others
          </Text>
        </div>
      }
      footer={null}
      visible={snap.CreateLearningProgressModalOpened}
      onCancel={handleCancel}
      width={550}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "24px", 
        background: themeColors.cardBg,
        borderRadius: 12 
      }}
      style={{ 
        borderRadius: 16,
        overflow: "hidden" 
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        <Form.Item
          name="planName"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <BookOutlined style={{ marginRight: 8, color: themeColors.primary }} />
              <span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Progress Title</span>
              <Tooltip title="A brief title summarizing your learning achievement">
                <InfoCircleOutlined style={{ marginLeft: 8, color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please add a title" }]}
        >
          <Input 
            placeholder="Give a brief title for your progress update" 
            style={{ 
              borderRadius: 8, 
              borderColor: themeColors.border,
              padding: "10px 12px",
              fontSize: "15px",
              boxShadow: "none",
              transition: "all 0.3s ease"
            }} 
          />
        </Form.Item>
        
        <Form.Item
          name="description"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 500 }}>
                Learning Journey
              </span>
              <Tooltip title="Share the details of your learning experience">
                <InfoCircleOutlined style={{ color: themeColors.textSecondary }} />
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea 
            placeholder="Describe your recent learning progress in detail" 
            rows={4}
            style={{ 
              borderRadius: 8, 
              borderColor: themeColors.border,
              padding: "12px",
              fontSize: "15px",
              resize: "vertical",
              boxShadow: "none",
              transition: "all 0.3s ease"
            }}
          />
        </Form.Item>
        
        <div style={{ 
          background: themeColors.surface,
          padding: "16px",
          borderRadius: 12,
          marginBottom: 16,
          marginTop: 16
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: 12, 
            color: themeColors.primary,
            fontWeight: 600
          }}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            <span>Learning Resources & Achievements</span>
          </div>
          
          <Form.Item
            name="goal"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8, color: themeColors.textPrimary, fontWeight: 500 }}>
                  Tutorials & Resources Used
                </span>
              </div>
            }
            rules={[{ required: true, message: "Please enter tutorials" }]}
          >
            <Input 
              placeholder="Courses, tutorials, or books you used in this learning stage" 
              style={{ 
                borderRadius: 8,
                borderColor: themeColors.border,
                padding: "10px 12px",
                transition: "all 0.3s ease"
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="routines"
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                <ToolOutlined style={{ marginRight: 8, color: themeColors.secondary }} />
                <span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Skills Acquired</span>
              </div>
            }
            rules={[{ required: true, message: "Please enter Skills" }]}
          >
            <Input.TextArea 
              placeholder="List specific skills, techniques, or concepts you've mastered" 
              rows={3}
              style={{ 
                borderRadius: 8,
                borderColor: themeColors.border,
                padding: "12px",
                fontSize: "15px",
                resize: "vertical",
                transition: "all 0.3s ease"
              }}
            />
          </Form.Item>
        </div>
        
        <Divider style={{ margin: "16px 0", borderColor: themeColors.border }} />
        
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{ 
                borderRadius: 8,
                borderColor: themeColors.border,
                height: "40px",
                padding: "0 16px" 
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{
                background: themeColors.gradient,
                borderColor: themeColors.primary,
                borderRadius: 8,
                height: "40px",
                padding: "0 20px",
                boxShadow: "0 4px 12px rgba(71, 118, 230, 0.3)",
                transition: "all 0.3s ease"
              }}
            >
              {loading ? "Sharing..." : "Share Progress"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateLearningProgressModal;