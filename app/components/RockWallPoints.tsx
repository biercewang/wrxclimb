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
  horizontalBlankAfter: number;
  verticalBlankAfter: number;
  horizontalBlankLength: number;
  verticalBlankLength: number;
  highlightedLabels: string[]; // 新增属性
  onPointClick: (label: string) => void;
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
  verticalBlankLength,
  highlightedLabels, // 接收新属性
  onPointClick 

}) => {
  const points = [];
  const columnsSequence = 'ABCDEFGHILM'.split('');

  let y = marginBottom;
  let rowCounter = 0;
  let sectionRowCounter = 1;
  let currentVerticalSection = 1;

  while (y + pointSpacing <= heightmm - marginTop) {
    let x = marginLeft;
    let columnCounter = 0;
    let currentHorizontalSection = 1;
    let side = 'L'; // Start with left side

    while (x + pointSpacing <= widthmm - marginRight) {
      const columnIndex = columnCounter % columnsSequence.length;
      const pointLabel = `${side}${currentVerticalSection}${columnsSequence[columnIndex]}${sectionRowCounter}`;
      points.push({ x, y, label: pointLabel });
      columnCounter++;

      x += pointSpacing;
      // Handle horizontal blank
      if (columnCounter % horizontalBlankAfter === 0) {
        x += horizontalBlankLength;
        side = side === 'L' ? 'R' : 'L'; // Toggle side after the blank
        currentHorizontalSection = side === 'R' ? 1 : currentHorizontalSection + 1; // Reset section counter when moving to the right
      }
    }

    rowCounter++;
    y += pointSpacing;
    // Handle vertical blank and row section cycling
    if (rowCounter % verticalBlankAfter === 0) {
      y += verticalBlankLength;
    }
    if (sectionRowCounter == 10) {
      sectionRowCounter = 1;
      currentVerticalSection++;
    } else {
      sectionRowCounter++;
    }
  }

  return (
    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '100%' }}>
      {points.map((point, index) => {
        const isHighlighted = highlightedLabels.includes(point.label);
        const size = isHighlighted ? '100px' : '10px'; // 点的尺寸
        const offset = isHighlighted ? 45 : 0; // 根据是否高亮来设置偏移量
        const style: React.CSSProperties = {
          position: 'absolute',
          left: `${point.x - offset}px`, // 调整位置以使点以中心为放大点
          bottom: `${point.y - offset}px`, // 调整位置以使点以中心为放大点
          width: size,
          height: size,
          backgroundColor: isHighlighted ? 'red' : 'black',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
          cursor: isHighlighted ? 'pointer' : 'default' // 添加手形光标
        };

        return (
          <div key={index} style={style} onClick={isHighlighted ? () => onPointClick(point.label) : undefined}>
            {point.label}
          </div>
        );
      })}
    </div>
  );
};

export default RockWallPoints;