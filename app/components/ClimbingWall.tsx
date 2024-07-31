import React from 'react';

interface ClimbingWallProps {
  heightCm: number;
  widthCm: number;
}

const ClimbingWall: React.FC<ClimbingWallProps> = ({ heightCm, widthCm }) => {
  const widthVw = 50;
  const heightVw = (heightCm / widthCm) * widthVw;

  return (
    <div className="relative w-full max-w-[50vw] bg-gray-300 border border-black" style={{ height: `${heightVw}vw` }}>
      Climbing Wall: {widthCm / 100}m x {heightCm / 100}m
    </div>
  );
};

export default ClimbingWall;