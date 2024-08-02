// pages.tsx
'use client';
import React, { useState } from 'react';
import ClimbingWall from './components/ClimbingWall'; // 确保路径正确
import RockWallPoints from './components/RockWallPoints'; // 引入新的组件

interface PointTime {
  timeInSeconds: number;
  timestamp: string;
}

const Home: React.FC = () => {
  
  const [inputHeight, setInputHeight] = useState<number>(12000); // 1200mm -> 12000mm
  const [inputWidth, setInputWidth] = useState<number>(3000); // 200mm -> 2000mm
  const [marginTop, setMarginTop] = useState<number>(0); // 20mm -> 200mm
  const [marginBottom, setMarginBottom] = useState<number>(185); // 20mm -> 200mm
  const [marginLeft, setMarginLeft] = useState<number>(125); // 20mm -> 200mm
  const [marginRight, setMarginRight] = useState<number>(0); // 20mm -> 200mm
  const [pointSpacing, setPointSpacing] = useState<number>(125); // 15mm -> 150mm
  const [horizontalBlankAfter, setHorizontalBlankAfter] = useState<number>(11);
  const [verticalBlankAfter, setVerticalBlankAfter] = useState<number>(10);
  const [horizontalBlankLength, setHorizontalBlankLength] = useState<number>(125); // 100mm -> 1000mm
  const [verticalBlankLength, setVerticalBlankLength] = useState<number>(245); // 100mm -> 1000mm
  const [showWall, setShowWall] = useState<boolean>(false);



  const defaultHighlightedLabels = [
    "R8B1", "R8E5", "R7E9", "R7A6", "R7D5", "R7G1", "R6E9", "R6H6",
    "R6B5", "R6A1", "R6E1", "R5A8", "R5C6", "L5I5", "L5L1", "R5A1",
    "L4H8", "R4C8", "R4C6", "L4M4", "R4G2", "R3C10", "R3E7", "R3E5",
    "R3A2", "L2I10", "R2D9", "L2M5", "L2I1", "L1M9", "L1H8", "L1H5", "L1M2", "R8A10"
  ];

  const [highlightedLabels, setHighlightedLabels] = useState<string[]>(defaultHighlightedLabels);
  const [labelsInput, setLabelsInput] = useState<string>(defaultHighlightedLabels.join('; '));



  const handleGenerateWall = () => {
    setShowWall(true); // 显示岩壁和点
  };



  const handleLabelsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelsInput(event.target.value);
  };

  const handleApplyLabels = () => {
    const labelsArray = labelsInput.split(';').map(label => label.trim()).filter(label => label !== '');
    setHighlightedLabels(labelsArray);
  };

  // 点击逻辑
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [touchTime, setTouchTime] = useState<string>('');

  const [pointTimes, setPointTimes] = useState<PointTime[]>([]);

  const handlePointClick = async (label: string) => {
    setSelectedPoint(label);
    setTouchTime('');
    try {
      const response = await fetch(`/api/point-times/${label}`);
      if (response.ok) {
        const times = await response.json();
        setPointTimes(times);
      } else {
        throw new Error('Failed to fetch times');
      }
    } catch (error) {
      console.error("Error fetching times for point:", error);
    }
  };



  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTouchTime(event.target.value);
  };

  const handleTimeSubmit = async () => {
    try {
        const response = await fetch('/api/point-times', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pointLabel: selectedPoint, timeInSeconds: parseFloat(touchTime) })
        });
        if (response.ok) {
            const newTime = await response.json();
            setPointTimes([...pointTimes, newTime]);  // 将新的时间记录添加到列表中
            console.log("Time saved successfully");
        } else {
            throw new Error('Failed to save time');
        }
    } catch (error) {
        console.error("Error:", error);
    }
};



  return (
    <div className="flex flex-col h-screen">
  <header className="bg-gray-200 text-center p-4">
    <h1>Welcome to the Climbing Wall Simulator</h1>
  </header>
  <div className="flex flex-grow overflow-hidden">
    {/* 左侧设置区 */}
    <div className="flex flex-col w-64 bg-gray-100 p-4 space-y-2">
       <label className="block">
           Wall Width (mm):
        <input
              type="number"
              value={inputWidth}
              className="mt-1 p-1 border rounded"
              onChange={e => setInputWidth(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Wall Height (mm):
            <input
              type="number"
              value={inputHeight}
              className="mt-1 p-1 border rounded"
              onChange={e => setInputHeight(parseFloat(e.target.value))}
            />
          </label>
          {/* <label className="block">
            Edge Margin Top (mm):
            <input
              type="number"
              value={marginTop}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginTop(parseFloat(e.target.value))}
            />
          </label> */}
          <label className="block">
            Edge Margin Bottom (mm):
            <input
              type="number"
              value={marginBottom}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginBottom(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Edge Margin Left (mm):
            <input
              type="number"
              value={marginLeft}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginLeft(parseFloat(e.target.value))}
            />
          </label>
          {/* <label className="block">
            Edge Margin Right (mm):
            <input
              type="number"
              value={marginRight}
              className="mt-1 p-1 border rounded"
              onChange={e => setMarginRight(parseFloat(e.target.value))}
            />
          </label> */}
          <label className="block">
            Point Spacing (mm):
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
            Horizontal Blank Length (mm):
            <input
              type="number"
              value={horizontalBlankLength}
              className="mt-1 p-1 border rounded"
              onChange={e => setHorizontalBlankLength(parseFloat(e.target.value))}
            />
          </label>
          <label className="block">
            Vertical Blank Length (mm):
            <input
              type="number"
              value={verticalBlankLength}
              className="mt-1 p-1 border rounded"
              onChange={e => setVerticalBlankLength(parseFloat(e.target.value))}
            />
          </label>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleGenerateWall}>
        Generate Wall
      </button>
      <input type="text" value={labelsInput} onChange={handleLabelsChange} placeholder="Highlight Labels" className="border p-1 rounded" />
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleApplyLabels}>
        Apply Highlight
      </button>
    </div>

    {/* 中间岩壁显示区 */}
    <div className="flex-grow overflow-auto">

        <div className="relative" style={{ width: `${inputWidth}px`, height: `${inputHeight}px` }}>
          <ClimbingWall widthmm={inputWidth} heightmm={inputHeight} />
          <RockWallPoints
            widthmm={inputWidth}
            heightmm={inputHeight}
            marginTop={marginTop}
            marginBottom={marginBottom}
            marginLeft={marginLeft}
            marginRight={marginRight}
            pointSpacing={pointSpacing}
            horizontalBlankAfter={horizontalBlankAfter}
            verticalBlankAfter={verticalBlankAfter}
            horizontalBlankLength={horizontalBlankLength}
            verticalBlankLength={verticalBlankLength}
            highlightedLabels={highlightedLabels}
            onPointClick={handlePointClick}
          />
        </div>
      
    </div>

    {/* 右侧时间记录区 */}
    <div className="flex flex-col w-64 bg-gray-100 p-4 space-y-2">
      {selectedPoint && (
        <div className="border rounded bg-white shadow p-4">
          <h3>Selected Point: {selectedPoint}</h3>
          <input type="text" value={touchTime} onChange={handleTimeChange} placeholder="Enter time (sec)" className="border p-1 rounded w-full" />
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleTimeSubmit}>
            Submit Time
          </button>
          <div className="mt-4">
            <h4>Previous Times:</h4>
            <ul>
              {pointTimes.map((time, index) => (
                <li key={index}>
                  {time.timeInSeconds} seconds - {new Date(time.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  </div>
  <footer className="bg-gray-200 text-center p-2">
    © 2024 Climbing Wall Simulator. All rights reserved.
  </footer>
</div>
  );
}

export default Home;