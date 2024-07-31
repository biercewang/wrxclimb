import React from 'react';

interface RockWallPointsProps {
  heightCm: number;
  widthCm: number;
  edgeMargin: number; // 边缘距离
  pointSpacing: number; // 点与点之间的距离
  blankAfter: number; // 多少个点后有一个空白
}

const RockWallPoints: React.FC<RockWallPointsProps> = ({
  heightCm,
  widthCm,
  edgeMargin,
  pointSpacing,
  blankAfter
}) => {
  const numberOfRows = Math.floor((heightCm - 2 * edgeMargin) / pointSpacing);
  const numberOfColumns = Math.floor((widthCm - 2 * edgeMargin) / pointSpacing);

  return (
    <div style={{ position: 'relative', width: `${widthCm}px`, height: `${heightCm}px`, backgroundColor: 'lightgray' }}>
      {Array.from({ length: numberOfRows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', marginBottom: rowIndex === numberOfRows - 1 ? '0' : `${pointSpacing}px` }}>
          {Array.from({ length: numberOfColumns }).map((_, colIndex) => {
            const isBlank = ((colIndex + 1) % (blankAfter + 1) === 0);
            return (
              <div
                key={colIndex}
                style={{
                  width: '10px',
                  height: '10px',
                  marginLeft: colIndex === 0 ? `${edgeMargin}px` : `${pointSpacing}px`,
                  backgroundColor: isBlank ? 'transparent' : 'black'
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