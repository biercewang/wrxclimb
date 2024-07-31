
'use client';
import React, { useState } from 'react';
import ClimbingWall from './components/climbingWall'; // 确保路径正确

const Home: React.FC = () => {
  const [inputHeight, setInputHeight] = useState<number>(0);
  const [inputWidth, setInputWidth] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [showWall, setShowWall] = useState<boolean>(false);  // 控制岩壁显示

  const handleGenerateWall = () => {
    setWidth(inputWidth);  // 更新实际用于显示的宽度
    setHeight(inputHeight); // 更新实际用于显示的高度
    setShowWall(true); // 显示岩壁
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
              onChange={e => setInputWidth(parseInt(e.target.value))}
            />
          </label>
          <label className="block">
            Wall Height (cm):
            <input
              type="number"
              value={inputHeight}
              className="mt-1 p-1 border rounded"
              onChange={e => setInputHeight(parseInt(e.target.value))}
            />
          </label>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleGenerateWall}
          >
            Generate Wall
          </button>
        </div>
        {showWall && width > 0 && height > 0 && (
          <ClimbingWall widthCm={width} heightCm={height} />
        )}
      </div>
      <footer className="bg-gray-200 text-center p-2">
        © 2024 Climbing Wall Simulator. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;

