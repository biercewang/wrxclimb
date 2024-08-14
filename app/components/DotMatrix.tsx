// DotMatrix.tsx
import React, { useState, useEffect } from 'react';

interface DotMatrixProps {
  gridWidth: number;   // 网格宽度，单位为厘米
  gridHeight: number;  // 网格高度，单位为厘米
  dotSpacing: number;  // 点与点之间的距离，单位为厘米
  edgeMargin: number;  // 点距离边缘的距离，单位为厘米
  blankAfter: number;  // 多少个点后有空白
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  gridWidth,
  gridHeight,
  dotSpacing,
  edgeMargin,
  blankAfter,
}) => {
  const [scale, setScale] = useState(10);

  useEffect(() => {
    const screenWidth = window.innerWidth; // 获取屏幕宽度
    const targetWidth = screenWidth - 2 * edgeMargin * scale; // 目标宽度为屏幕宽度减去边缘空白
    const newScale = targetWidth / (gridWidth * dotSpacing); // 计算新的缩放比例
    setScale(Math.max(newScale, 0.1)); // 确保至少有一个最小的缩放比例
    console.log(`Scale: ${newScale}, Dot Size: ${newScale * 10}px`);
  }, [gridWidth, gridHeight, dotSpacing, edgeMargin]);

  const pixelWidth = gridWidth * dotSpacing * scale;
  const pixelHeight = gridHeight * dotSpacing * scale;
  const pixelSpacing = dotSpacing * scale;
  const pixelMargin = edgeMargin * scale;

  const rows = Array.from({ length: Math.floor(gridHeight) }, (_, i) => i);
  const cols = Array.from({ length: Math.floor(gridWidth) }, (_, i) => i);

  return (
    <div style={{ padding: `${pixelMargin}px`, overflowY: 'auto', maxHeight: '100vh' }}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {cols.map((col, colIndex) => {
            const isVisible = (colIndex % (blankAfter + 1)) < blankAfter;
            return (
              <div
                key={colIndex}
                style={{
                  width: `${Math.max(scale * 10, 1)}px`, // 至少1像素
                  height: `${Math.max(scale * 10, 1)}px`,
                  backgroundColor: isVisible ? 'black' : 'transparent',
                  marginRight: colIndex === cols.length - 1 ? '0' : `${pixelSpacing}px`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DotMatrix;