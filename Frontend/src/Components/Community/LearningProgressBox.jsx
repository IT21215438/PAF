import React, { useState } from "react";
import state from "../../Utils/Store";
import { useSnapshot } from "valtio";

// Theme colors (matching the previous components)
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

const LearningProgressBox = () => {
  const snap = useSnapshot(state);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="my_post"
      onClick={() => {
        state.CreateLearningProgressModalOpened = true;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: themeColors.gradient,
        padding: "16px 20px",
        borderRadius: "12px",
        boxShadow: isHovered 
          ? "0 8px 24px rgba(90, 155, 255, 0.2)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginBottom: "20px",
        color: "white",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent"}`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative circles matching the other components */}
      <div 
        style={{ 
          position: "absolute", 
          right: -20, 
          top: -20, 
          width: 100, 
          height: 100, 
          borderRadius: "50%", 
          background: "rgba(255,255,255,0.15)",
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.2)" : "scale(1)"
        }} 
      />
      
      <div 
        style={{ 
          position: "absolute", 
          left: 10, 
          bottom: -30, 
          width: 60, 
          height: 60, 
          borderRadius: "50%", 
          background: "rgba(255,255,255,0.15)",
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.2) translateX(10px)" : "scale(1)"
        }} 
      />

      <div
        className="post_top"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          position: "relative", 
          zIndex: 2 
        }}
      >
        <img
          alt="profile"
          src={snap.currentUser?.image}
          style={{
            width: "45px",
            height: "45px",
            marginRight: "15px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.7)",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            boxShadow: isHovered ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"
          }}
        />
        <input
          type="text"
          placeholder="What's your Learning Progress plan?"
          style={{
            flexGrow: 1,
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            color: themeColors.textPrimary,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            fontSize: "14px",
            transition: "all 0.3s ease",
            boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.04)",
            outline: "none"
          }}
          readOnly // Making input read-only since the whole component is clickable
          onClick={(e) => e.stopPropagation()} // Preventing input click from propagating
        />
      </div>
    </div>
  );
};

export default LearningProgressBox;