import React, { useEffect, useState } from "react";
import "../../Styles/center_section.css";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import LearningProgressBox from "./LearningProgressBox";
import LearningProgressCard from "./LearningProgressCard";
import CreaetSkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";
import { 
  Tabs, 
  Avatar, 
  Row, 
  Col,
  Typography,
  Space
} from "antd";
import {
  MessageOutlined,
  BookOutlined,
  ShareAltOutlined,
  TeamOutlined,
  BellOutlined,
  CodeOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Text } = Typography;

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [activeTab, setActiveTab] = useState("1");
  const [animateTab, setAnimateTab] = useState(false);

  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);

  // Animation effect when changing tabs
  const handleTabChange = (key) => {
    setAnimateTab(true);
    setActiveTab(key);
    setTimeout(() => {
      setAnimateTab(false);
    }, 500);
  };

  return (
    <div
      className="center"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px"
      }}
    >
      <nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          <CodeOutlined 
            style={{ 
              fontSize: "28px", 
              color: "#1890ff",
              animation: "pulse 2s infinite"
            }} 
          />
          codeZ
        </div>
        <Avatar
          style={{
            cursor: "pointer",
            border: "5px solid rgb(223, 27, 86)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.3s"
          }}
          onClick={() => {
            state.profileModalOpend = true;
          }}
          size={60}
          src={snap.currentUser?.image}
          className="avatar-hover"
        />
      </nav>

      <StoryBox />

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "16px"
        }}
      >
        <NotificationsDropdown />
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ width: "100%" }}
          tabBarStyle={{ marginBottom: "16px", fontWeight: "600" }}
        >
          <TabPane 
            tab={
              <Space>
                <MessageOutlined 
                  style={{ 
                    fontSize: "18px", 
                    color: activeTab === "1" ? "#1890ff" : "#8c8c8c",
                    transition: "color 0.3s" 
                  }}
                />
                <Text>Comment & Feedback</Text>
              </Space>
            } 
            key="1"
          >
            <div className={`tab-content ${animateTab && activeTab === "1" ? "fade-in" : ""}`}>
              <MyPost />
              <div>
                {snap.posts.map((post) => {
                  return <FriendsPost key={post?.id} post={post} />;
                })}
              </div>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <BookOutlined 
                  style={{ 
                    fontSize: "18px", 
                    color: activeTab === "2" ? "#52c41a" : "#8c8c8c",
                    transition: "color 0.3s" 
                  }}
                />
                <Text>Learning Progress</Text>
              </Space>
            } 
            key="2"
          >
            <div className={`tab-content ${animateTab && activeTab === "2" ? "fade-in" : ""}`}>
              <LearningProgressBox />
              <div>
                {snap.LearningProgresss.map((plan) => (
                  <LearningProgressCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <ShareAltOutlined 
                  style={{ 
                    fontSize: "18px", 
                    color: activeTab === "3" ? "#722ed1" : "#8c8c8c",
                    transition: "color 0.3s" 
                  }}
                />
                <Text>SkillShare</Text>
              </Space>
            } 
            key="3"
          >
            <div className={`tab-content ${animateTab && activeTab === "3" ? "fade-in" : ""}`}>
              <CreaetSkillShareBox />
              <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                {snap.SkillShares.map((plan) => (
                  <SkillShareCard key={plan.id} plan={plan} />
                ))}
              </Row>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <TeamOutlined 
                  style={{ 
                    fontSize: "18px", 
                    color: activeTab === "4" ? "#faad14" : "#8c8c8c",
                    transition: "color 0.3s" 
                  }}
                />
                <Text>Friends</Text>
              </Space>
            } 
            key="4"
          >
            <div className={`tab-content ${animateTab && activeTab === "4" ? "fade-in" : ""}`}>
              <FriendsSection />
            </div>
          </TabPane>
          
          {/* <TabPane 
            tab={
              <Space>
                <BellOutlined 
                  style={{ 
                    fontSize: "18px", 
                    color: activeTab === "5" ? "#f5222d" : "#8c8c8c",
                    animation: activeTab !== "5" ? "bell-bounce 2s infinite" : "none",
                    transition: "color 0.3s" 
                  }}
                />
                <Text>Notifications</Text>
              </Space>
            } 
            key="5"
          >
            <div className={`tab-content ${animateTab && activeTab === "5" ? "fade-in" : ""}`}>
              <NotificationsDropdown />
            </div>
          </TabPane> */}
        </Tabs>
      </div>

      {/* Add this CSS to your component or in your CSS file */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes bell-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          10% {
            transform: translateY(-4px);
          }
          20% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-2px);
          }
          40% {
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .avatar-hover:hover {
          transform: scale(1.05);
        }
        
        .ant-tabs-tab {
          transition: all 0.3s ease;
        }
        
        .ant-tabs-tab:hover {
          transform: translateY(-2px);
        }
        
        .ant-tabs-tab-active {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default CenterSection;