// RockWallPoints.tsx
import React from 'react';
interface RockWallPointsProps {
  heightmm: number;
  widthmm: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  pointSpacing: number; 
  horizontalBlankAfter: number; // 横向多少点后有一个空白
  verticalBlankAfter: number;   // 纵向多少点后有一个空白
  horizontalBlankLength: number;  // 横向空白长度，单位厘米
  verticalBlankLength: number;  
}

// 设置默认属性值
const defaultProps: Partial<RockWallPointsProps> = {
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  pointSpacing: 15,
  horizontalBlankAfter: 5,
  verticalBlankAfter: 5,
  horizontalBlankLength: 5,// 横向空白长度，单位厘米
  verticalBlankLength: 5,  
};

const RockWallPoints: React.FC<RockWallPointsProps> = ({
  heightmm,
  widthmm,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  pointSpacing,
  horizontalBlankAfter,
  verticalBlankAfter,
  horizontalBlankLength,
  verticalBlankLength
}) => {
  const rows = Math.floor((heightmm - marginTop - marginBottom) / pointSpacing);
  const columns = Math.floor((widthmm - marginLeft - marginRight) / pointSpacing);

  return (
    <div style={{ position: 'absolute', top: `${marginTop}px`, left: `${marginLeft}px` }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            const isHorizontalBlank = ((colIndex + 1) % (horizontalBlankAfter + 1) === 0);
            const isVerticalBlank = ((rowIndex + 1) % (verticalBlankAfter + 1) === 0);
            return (
              <div
                key={colIndex}
                style={{
                  width: isHorizontalBlank ? `${horizontalBlankLength}px` : '10px',
                  height: isVerticalBlank ? `${verticalBlankLength}px` : '10px',
                  backgroundColor: isHorizontalBlank || isVerticalBlank ? 'transparent' : 'black',
                  marginRight: '5px',
                  marginBottom: '5px'
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default RockWallPoints;