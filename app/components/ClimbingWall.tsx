// ClimbingWall.tsx
import React from 'react';

interface ClimbingWallProps {
  widthmm: number;
  heightmm: number;
}

const ClimbingWall: React.FC<ClimbingWallProps> = ({ widthmm, heightmm }) => {
  return (
    <div style={{
      position: 'relative', // 设置相对定位
      width: `${widthmm}px`, 
      height: `${heightmm}px`, 
      backgroundColor: 'lightgray', 
      border: '1px solid black'
    }}>
      Climbing Wall: {widthmm / 100}m x {heightmm / 100}m
    </div>
  );
};

export default ClimbingWall;