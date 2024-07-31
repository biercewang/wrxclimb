// RockWallPoints.tsx
import React from 'react';

interface RockWallPointsProps {
  heightmm: number;  // Total height of the climbing wall in millimeters
  widthmm: number;   // Total width of the climbing wall in millimeters
  marginTop: number; // Margin at the top in millimeters
  marginBottom: number; // Margin at the bottom in millimeters
  marginLeft: number; // Margin on the left side in millimeters
  marginRight: number; // Margin on the right side in millimeters
  pointSpacing: number; // Spacing between points in millimeters
  horizontalBlankAfter: number; // Number of points after which to leave a horizontal blank
  verticalBlankAfter: number; // Number of points after which to leave a vertical blank
  horizontalBlankLength: number; // Length of the horizontal blank in millimeters
  verticalBlankLength: number; // Length of the vertical blank in millimeters
}

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
    <div style={{ position: 'absolute', bottom: `${marginBottom}px`, left: `${marginLeft}px`, width: `${widthmm - marginLeft - marginRight}px`, height: `${heightmm - marginTop - marginBottom}px` }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            const isHorizontalBlank = ((colIndex + 1) % (horizontalBlankAfter + 1) === 0) && colIndex > 0;
            const isVerticalBlank = ((rowIndex + 1) % (verticalBlankAfter + 1) === 0) && rowIndex > 0;

            const leftOffset = colIndex * (pointSpacing + (isHorizontalBlank ? horizontalBlankLength : 0));
            const bottomOffset = rowIndex * (pointSpacing + (isVerticalBlank ? verticalBlankLength : 0));

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  position: 'absolute',
                  left: `${leftOffset}px`,
                  bottom: `${bottomOffset}px`,
                  width: '10px',
                  height: '10px',
                  backgroundColor: isHorizontalBlank || isVerticalBlank ? 'transparent' : 'black'
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