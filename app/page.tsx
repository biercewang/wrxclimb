
'use client';
import React, { useState } from 'react';
import ClimbingWall from './components/ClimbingWall'; // 确保路径正确
import RockWallPoints from './components/RockWallPoints'; // 引入新的组件

const Home: React.FC = () => {
  const [inputHeight, setInputHeight] = useState<number>(1200);
  const [inputWidth, setInputWidth] = useState<number>(200);
  const [marginTop, setMarginTop] = useState<number>(20);
  const [marginBottom, setMarginBottom] = useState<number>(20);
  const [marginLeft, setMarginLeft] = useState<number>(20);
  const [marginRight, setMarginRight] = useState<number>(20);
  const [pointSpacing, setPointSpacing] = useState<number>(15);
  const [horizontalBlankAfter, setHorizontalBlankAfter] = useState<number>(5);
  const [verticalBlankAfter, setVerticalBlankAfter] = useState<number>(5);
  const [horizontalBlankLength, setHorizontalBlankLength] = useState<number>(10);  // 新增横向空白长度，单位为厘米
  const [verticalBlankLength, setVerticalBlankLength] = useState<number>(10);    // 新增纵向空白长度，单位为厘米
  const [showWall, setShowWall] = useState<boolean>(false);

  const handleGenerateWall = () => {
    setShowWall(true); // 显示岩壁和点
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-200 text-center p-4">
        <h1>Welcome to the Climbing Wall Simulator</h1>
      </header>
      <div className="flex-grow flex justify-center items-start p-4 overflow-auto">
        <div className="space-y-2 mr-4">
          <label className="block">
            Wall Width (cm):
            <input
              type="number"
              value={inputWidth}
              className="mt-1 p-1 border rounded"
              onChange={e => setInputWidth(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Wall Height (cm):
            <input
              type="number"
              value={inputHeight}
              className="mt-1 p-1 border rounded"
              onChange={e => setInputHeight(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Edge Margin Top (cm):
            <input
              type="number"
              value={marginTop}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginTop(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Edge Margin Bottom (cm):
            <input
              type="number"
              value={marginBottom}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginBottom(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Edge Margin Left (cm):
            <input
              type="number"
              value={marginLeft}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginLeft(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Edge Margin Right (cm):
            <input
              type="number"
              value={marginRight}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginRight(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Point Spacing (cm):
            <input
              type="number"
              value={pointSpacing}
              className="mt-1 p-1 border rounded"
              onChange={e => setPointSpacing(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Horizontal Blank After (points):
            <input
              type="number"
              value={horizontalBlankAfter}
              className="mt-1 p-1 border rounded"
              onChange={e => setHorizontalBlankAfter(parseInt(e.target.value))}
            />
          </label>
          <label className="block">
            Vertical Blank After (points):
            <input
              type="number"
              value={verticalBlankAfter}
              className="mt-1 p-1 border rounded"
              onChange={e => setVerticalBlankAfter(parseInt(e.target.value))}
            />
          </label>
          <label className="block">
            Horizontal Blank Length (cm):
            <input
              type="number"
              value={horizontalBlankLength}
              className="mt-1 p-1 border rounded"
              onChange={e => setHorizontalBlankLength(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Vertical Blank Length (cm):
            <input
              type="number"
              value={verticalBlankLength}
              className="mt-1 p-1 border rounded"
              onChange={e => setVerticalBlankLength(parseFloat(e.target.value))}
            />
          </label>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleGenerateWall}
          >
            Generate Wall
          </button>
        </div>
        {showWall && inputWidth > 0 && inputHeight > 0 && (
          <div className="relative" style={{ width: `${inputWidth}px`, height: `${inputHeight}px` }}>
            <ClimbingWall widthCm={inputWidth} heightCm={inputHeight} />
            <RockWallPoints
              widthCm={inputWidth}
              heightCm={inputHeight}
              marginTop={marginTop}
              marginBottom={marginBottom}
              marginLeft={marginLeft}
              marginRight={marginRight}
              pointSpacing={pointSpacing}
              horizontalBlankAfter={horizontalBlankAfter}
              verticalBlankAfter={verticalBlankAfter}
              horizontalBlankLength={horizontalBlankLength}
              verticalBlankLength={verticalBlankLength}
            />
          </div>
        )}
      </div>
      <footer className="bg-gray-200 text-center p-2">
        © 2024 Climbing Wall Simulator. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;