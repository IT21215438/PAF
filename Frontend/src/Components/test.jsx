import React, { useEffect } from "react";
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
import { Tabs, Avatar, Row, Col, Badge } from "antd";
import { CodeOutlined, BellOutlined, MessageOutlined, BookOutlined, ShareAltOutlined, TeamOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const CenterSection = () => {
  const snap = useSnapshot(state);
  
  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);
  
  return (
    <div className="center" style={{
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f9fafb"
    }}>
      <nav className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CodeOutlined className="text-pink-600 text-2xl" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            codeZ
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge count={5} size="small">
            <BellOutlined className="text-xl text-gray-600 cursor-pointer hover:text-pink-600 transition-colors" />
          </Badge>
          
          <Avatar
            className="cursor-pointer border-4 border-pink-500 shadow-lg hover:scale-105 transition-transform"
            onClick={() => {
              state.profileModalOpend = true;
            }}
            size={50}
            src={snap.currentUser?.image}
          />
        </div>
      </nav>
      
      <StoryBox />
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <Tabs
          defaultActiveKey="1"
          className="font-medium"
          tabBarStyle={{ 
            marginBottom: "20px", 
            borderBottom: "2px solid #f0f0f0" 
          }}
          tabBarGutter={30}
        >
          <TabPane 
            tab={
              <span className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <MessageOutlined />
                <span>Comment & Feedback</span>
              </span>
            } 
            key="1"
          >
            <MyPost />
            <div className="space-y-6 mt-4">
              {snap.posts.map((post) => (
                <FriendsPost key={post?.id} post={post} />
              ))}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <BookOutlined />
                <span>Learning Progress</span>
              </span>
            } 
            key="2"
          >
            <LearningProgressBox />
            <div className="space-y-4 mt-6">
              {snap.LearningProgresss.map((plan) => (
                <LearningProgressCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <ShareAltOutlined />
                <span>SkillShare</span>
              </span>
            } 
            key="3"
          >
            <CreaetSkillShareBox />
            <Row gutter={[24, 24]} className="mt-6">
              {snap.SkillShares.map((plan) => (
                <Col xs={24} sm={12} md={8} key={plan.id}>
                  <SkillShareCard plan={plan} />
                </Col>
              ))}
            </Row>
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <TeamOutlined />
                <span>Friends</span>
              </span>
            } 
            key="4"
          >
            <FriendsSection />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CenterSection;