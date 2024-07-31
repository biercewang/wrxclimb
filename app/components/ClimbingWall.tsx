// ClimbingWall.tsx
import React from 'react';

interface ClimbingWallProps {
  widthCm: number;
  heightCm: number;
}

const ClimbingWall: React.FC<ClimbingWallProps> = ({ widthCm, heightCm }) => {
  return (
    <div style={{
      position: 'relative', // 设置相对定位
      width: `${widthCm}px`, 
      height: `${heightCm}px`, 
      backgroundColor: 'lightgray', 
      border: '1px solid black'
    }}>
      Climbing Wall: {widthCm / 100}m x {heightCm / 100}m
    </div>
  );
};

export default ClimbingWall;