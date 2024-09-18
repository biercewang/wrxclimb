// pages.tsx
'use client';
import { requestToBodyStream } from 'next/dist/server/body-streams';
import React, { useState } from 'react';

interface PointTime {
  pointLabel: string;
  timeInSeconds: number;
  timestamp: string;
  athleteName: string;
  bodyPart: '左手' | '右手' | '左脚' | '右脚';
  walltype: '儿童' | '成人';
  _id: string;
}

// 在组件外部定义一个格式化日期的函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

interface WallDimensions {
  width: number;
  height: number;
  marginBottom: number;
  marginLeft: number;
  pointSpacing: number;
  horizontalBlankAfter: number;
  verticalBlankAfter: number;
  horizontalBlankLength: number;
  verticalBlankLength: number;
  walltype: '儿童' | '成人';
}

interface HighlightedPoint {
  label: string;
  type: '终点' | '手点' | '脚点';
}

const Home: React.FC = () => {
  const [childWallDimensions, setChildWallDimensions] = useState<WallDimensions>({
    width: 3000,
    height: 12000,
    marginBottom: 185,
    marginLeft: 125,
    pointSpacing: 125,
    horizontalBlankAfter: 11,
    verticalBlankAfter: 10,
    horizontalBlankLength: 125,
    verticalBlankLength: 245,
    walltype: '儿童'
  });

  const [adultWallDimensions, setAdultWallDimensions] = useState<WallDimensions>({
    width: 3000,
    height: 15000,
    marginBottom: 185,
    marginLeft: 125,
    pointSpacing: 125,
    horizontalBlankAfter: 11,
    verticalBlankAfter: 10,
    horizontalBlankLength: 125,
    verticalBlankLength: 245,
    walltype: '成人'
  });

  const [wallDimensions, setWallDimensions] = useState<WallDimensions>(childWallDimensions);

  const [childHighlightedLabels, setChildHighlightedLabels] = useState<HighlightedPoint[]>([
    { label: "R8A10", type: '终点' },
    { label: "R8B1", type: '手点' },
    { label: "R8E5", type: '手点' },
    { label: "R7E9", type: '手点' },
    { label: "R7A6", type: '脚点' },
    { label: "R7D5", type: '手点' },
    { label: "R7G1", type: '手点' },
    { label: "R6E9", type: '手点' },
    { label: "R6H6", type: '脚点' },
    { label: "R6B5", type: '手点' },
    { label: "R6A1", type: '手点' },
    { label: "R6E1", type: '脚点' },
    { label: "R5A8", type: '手点' },
    { label: "R5C6", type: '脚点' },
    { label: "L5I5", type: '手点' },
    { label: "L5L1", type: '手点' },
    { label: "R5A1", type: '脚点' },
    { label: "L4H8", type: '脚点' },
    { label: "R4C8", type: '手点' },
    { label: "R4C6", type: '手点' },
    { label: "L4M4", type: '脚点' },
    { label: "R4G2", type: '手点' },
    { label: "R3C10", type: '手点' },
    { label: "R3E7", type: '手点' },
    { label: "R3E5", type: '脚点' },
    { label: "R3A2", type: '手点' },
    { label: "L2I10", type: '手点' },
    { label: "R2D9", type: '脚点' },
    { label: "L2M5", type: '手点' },
    { label: "L2I1", type: '手点' },
    { label: "L1M9", type: '手点' },
    { label: "L1H8", type: '手点' },
    { label: "L1H5", type: '脚点' },
    { label: "L1M2", type: '脚点' }
  ]);

  const [adultHighlightedLabels, setAdultHighlightedLabels] = useState<HighlightedPoint[]>([
    { label: "R10A10", type: '终点' },
    { label: "R10D3", type: '脚点' },
    { label: "L9M10", type: '手点' },
    { label: "L9M7", type: '脚点' },
    { label: "R9E7", type: '手点' },
    { label: "R9A2", type: '手点' },
    { label: "R8A10", type: '脚点' },
    { label: "L8C8", type: '手点' },
    { label: "R8A5", type: '脚点' },
    { label: "L8I3", type: '手点' },
    { label: "R8E1", type: '脚点' },
    { label: "L8L1", type: '手点' },
    { label: "R7B10", type: '脚点' },
    { label: "L7G9", type: '手点' },
    { label: "L7M4", type: '手点' },
    { label: "L7M1", type: '脚点' },
    { label: "L6F9", type: '手点' },
    { label: "L6L7", type: '手点' },
    { label: "R6D4", type: '脚点' },
    { label: "R6B3", type: '脚点' },
    { label: "L6H2", type: '手点' },
    { label: "R5E9", type: '手点' },
    { label: "L5E7", type: '脚点' },
    { label: "L5M6", type: '脚点' },
    { label: "R5C3", type: '手点' },
    { label: "L5H1", type: '脚点' },
    { label: "R5E1", type: '脚点' },
    { label: "R4A10", type: '脚点' },
    { label: "L4M8", type: '手点' },
    { label: "L4L5", type: '脚点' },
    { label: "R4B2", type: '手点' },
    { label: "L3M10", type: '手点' },
    { label: "L3M7", type: '脚点' },
    { label: "R3C6", type: '脚点' },
    { label: "L3G4", type: '手点' },
    { label: "L3G1", type: '脚点' },
    { label: "R2A9", type: '手点' },
    { label: "L2F8", type: '脚点' },
    { label: "R2B6", type: '脚点' },
    { label: "L2G3", type: '脚点' },
    { label: "R2G3", type: '手点' },
    { label: "R2F1", type: '手点' },
    { label: "R1A10", type: '脚点' },
    { label: "R1H9", type: '脚点' },
    { label: "R1F9", type: '脚点' },
    { label: "R1F4", type: '脚点' },
  ]);

  const [highlightedLabels, setHighlightedLabels] = useState<HighlightedPoint[]>(childHighlightedLabels);

  const [showWall, setShowWall] = useState<boolean>(false);
  const [labelsInput, setLabelsInput] = useState<string>(highlightedLabels.map(point => `${point.label}:${point.type}`).join('; '));
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [touchTime, setTouchTime] = useState<string>('');
  const [pointTimes, setPointTimes] = useState<PointTime[]>([]);
  const [athleteName, setAthleteName] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<'左手' | '右手' | '左脚' | '右脚'>('左手');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(0.5);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [showNonHighlightedPoints, setShowNonHighlightedPoints] = useState<boolean>(true);

  const handleGenerateWall = () => {
    setShowWall(true);
  };

  const handleLabelsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelsInput(event.target.value);
  };

  const handleApplyLabels = () => {
    const labelsArray = labelsInput.split(';').map(label => {
      const [labelText, type] = label.trim().split(':');
      return { label: labelText, type: type as '终点' | '手点' | '脚点' };
    }).filter(label => label.label !== '' && label.type);
    setHighlightedLabels(labelsArray);
    if (wallDimensions.walltype === '儿童') {
      setChildHighlightedLabels(labelsArray);
    } else {
      setAdultHighlightedLabels(labelsArray);
    }
  };

  const handlePointClick = async (label: string) => {
    setSelectedPoint(label);
    setTouchTime('');
    try {
      const response = await fetch(`/api/climbing-records/${label}`);
      if (response.ok) {
        const times = await response.json();
        // 对时间记录进行排序，从短到长
        const sortedTimes = times.sort((a: PointTime, b: PointTime) => a.timeInSeconds - b.timeInSeconds);
        setPointTimes(sortedTimes);
      } else {
        throw new Error('获取时间记录失败');
      }
    } catch (error) {
      console.error("获取点位时间记录时出错:", error);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTouchTime(event.target.value);
  };

  const handleAthleteNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAthleteName(event.target.value);
  };

  const handleBodyPartChange = (selectedPart: '左手' | '右手' | '左脚' | '右脚') => {
    setBodyPart(selectedPart);
  };

  const handleTimeSubmit = async () => {
    // 验证运动员姓名时间不为空
    if (!athleteName.trim()) {
      alert('请输入运动员姓名');
      return;
    }
    if (!touchTime.trim()) {
      alert('请输入触摸时间');
      return;
    }
    if (!selectedPoint) {
      alert('请选择一个岩点');
      return;
    }

    try {
      const body = JSON.stringify({
        pointLabel: selectedPoint,
        timeInSeconds: parseFloat(touchTime),
        athleteName,
        bodyPart,
        walltype: wallDimensions.walltype
      });

      // 添加这行来显示实际提交的 body
      console.log("提交的 body:", body);

      const response = await fetch('/api/climbing-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });

      if (response.ok) {
        const newTime = await response.json();
        setPointTimes(prevTimes => [...prevTimes, newTime]);
        setTouchTime(''); // 清空时间输入框
        console.log("时间保存成功");
        alert(`时间记录已成功保存（${wallDimensions.walltype}赛道）`);
      } else {
        throw new Error('保存时间失败');
      }
    } catch (error) {
      console.error("错误:", error);
      alert('保存时间时出错');
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  const handleDeleteRecord = async (id: string, athleteName: string, timeInSeconds: number) => {
    // 添加更详细的确认对话框
    if (!confirm(`确定要删除这条记录吗？\n运动员: ${athleteName}\n时间: ${timeInSeconds}秒\nID: ${id}`)) {
      return; // 如果用户取消，不执行除
    }

    try {
      const response = await fetch(`/api/climbing-records/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // 从本地状态中移除被删除的记录
        setPointTimes(prevTimes => prevTimes.filter(time => time._id !== id));
        console.log(`记录删除成功，ID: ${id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '删除记录失败');
      }
    } catch (error: unknown) {
      console.error("错误:", error);
      if (error instanceof Error) {
        alert(`删除失败: ${error.message}\nID: ${id}`);  // 添加错误反馈，包含ID
      } else {
        alert(`删除失败：发生未知错误\nID: ${id}`);
      }
    }
  };

  const ClimbingWall: React.FC<{ widthmm: number, heightmm: number }> = ({ widthmm, heightmm }) => (
    <div style={{
      position: 'relative',
      width: `${widthmm}px`,
      height: `${heightmm}px`,
      backgroundColor: 'lightgray',
      border: '1px solid black'
    }}>
      攀岩墙尺寸: {widthmm / 1000}m x {heightmm / 1000}m
    </div>
  );

  const RockWallPoints: React.FC<{
    widthmm: number;
    heightmm: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    pointSpacing: number;
    horizontalBlankAfter: number;
    verticalBlankAfter: number;
    horizontalBlankLength: number;
    verticalBlankLength: number;
    highlightedLabels: HighlightedPoint[];
    onPointClick: (label: string) => void;
    pointTimes: PointTime[];
    showNonHighlightedPoints: boolean;
  }> = ({
    widthmm,
    heightmm,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    pointSpacing,
    horizontalBlankAfter,
    verticalBlankAfter,
    horizontalBlankLength,
    verticalBlankLength,
    highlightedLabels,
    onPointClick,
    pointTimes,
    showNonHighlightedPoints
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
        let side = 'L'; // 从左侧开始

        while (x + pointSpacing <= widthmm - marginRight) {
          const columnIndex = columnCounter % columnsSequence.length;
          const pointLabel = `${side}${currentVerticalSection}${columnsSequence[columnIndex]}${sectionRowCounter}`;
          points.push({ x, y, label: pointLabel });
          columnCounter++;

          x += pointSpacing;
          // 处理水平空白
          if (columnCounter % horizontalBlankAfter === 0) {
            x += horizontalBlankLength;
            side = side === 'L' ? 'R' : 'L'; // 在空白后切换侧面
            currentHorizontalSection = side === 'R' ? 1 : currentHorizontalSection + 1; // 移动到右侧时重置部分计数器
          }
        }

        rowCounter++;
        y += pointSpacing;
        // 处理垂直空白和行部分循
        if (rowCounter % verticalBlankAfter === 0) {
          y += verticalBlankLength;
        }
        if (sectionRowCounter === 10) {
          sectionRowCounter = 1;
          currentVerticalSection++;
        } else {
          sectionRowCounter++;
        }
      }

      const getPointShape = (point: HighlightedPoint, isSelected: boolean) => {
        const fillColor = point.type === '终点' ? 'red' : point.type === '手点' ? 'blue' : 'green';
        const fill = isSelected ? fillColor : 'none';
        const stroke = fillColor;
        const strokeWidth = 4;

        switch (point.type) {
          case '终点':
            return (
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect x="5" y="5" width="90" height="90" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
              </svg>
            );
          case '手点':
            return (
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path
                  d="M50,3 L61,37 H97 L68,59 L79,95 L50,75 L21,95 L32,59 L3,37 H39 Z"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              </svg>
            );
          case '脚点':
            return (
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="50" r="45" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
              </svg>
            );
        }
      };

      return (
        <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '100%' }}>
          {points.map((point, index) => {
            const highlightedPoint = highlightedLabels.find(hl => hl.label === point.label);
            const isHighlighted = !!highlightedPoint;
            if (!isHighlighted && !showNonHighlightedPoints) {
              return null; // 如果是非高亮点且设置为不显示，则不渲染
            }
            const size = isHighlighted ? '100px' : '10px'; // 将高亮点的尺寸增加到 100px
            const offset = isHighlighted ? 50 : 5; // 调整偏移量以保持居中
            const pointTime = pointTimes.find(time => time.pointLabel === point.label);
            const isSelected = selectedPoint === point.label;

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${point.x - offset}px`,
                  bottom: `${point.y - offset}px`,
                  width: size,
                  height: size,
                  cursor: isHighlighted ? 'pointer' : 'default',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: isHighlighted ? '12px' : '0',
                  color: 'white',
                  zIndex: isHighlighted ? 2 : 1, // 确保高亮点在其他点之上
                }}
                onClick={() => isHighlighted && onPointClick(point.label)}
                onMouseEnter={() => setHoveredPoint(point.label)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {isHighlighted ? getPointShape(highlightedPoint, isSelected) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    border: '2px solid black',
                    borderRadius: '50%',
                  }}></div>
                )}
                {hoveredPoint === point.label && isHighlighted && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '8px 16px', // 增加内边距
                    borderRadius: '8px', // 增加圆角
                    fontSize: '28px', // 将字体大小从 14px 增加到 28px
                    whiteSpace: 'nowrap',
                    zIndex: 10
                  }}>
                    {point.label} - {highlightedPoint.type}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

  const switchWallType = (type: '儿童' | '成人') => {
    if (type === '儿童') {
      setWallDimensions(childWallDimensions);
      setHighlightedLabels(childHighlightedLabels);
    } else {
      setWallDimensions(adultWallDimensions);
      setHighlightedLabels(adultHighlightedLabels);
    }
  };

  const handleWallDimensionsChange = (newDimensions: Partial<WallDimensions>) => {
    const updatedDimensions = { ...wallDimensions, ...newDimensions };
    setWallDimensions(updatedDimensions);
    if (updatedDimensions.walltype === '儿童') {
      setChildWallDimensions(updatedDimensions);
    } else {
      setAdultWallDimensions(updatedDimensions);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-200 text-center p-4">
        <h1 className="text-xl font-bold mb-2">欢迎使用攀岩时间记录器</h1>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="mr-2">赛道类型：</span>
            {['儿童', '成人'].map((type) => (
              <button
                key={type}
                onClick={() => switchWallType(type as '儿童' | '成人')}
                className={`px-3 py-1 rounded mr-2 ${wallDimensions.walltype === type ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center mb-2 sm:mb-0">
            <label htmlFor="scale-slider" className="mr-2">岩壁缩放：</label>
            <input
              id="scale-slider"
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={scale}
              onChange={handleScaleChange}
              className="w-32"
            />
            <span className="ml-2">{scale.toFixed(1)}x</span>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={toggleSettings}
          >
            {showSettings ? "隐藏设置" : "修改岩壁参数"}
          </button>
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        {/* 岩壁显示区 */}
        <div className="flex-grow overflow-auto min-w-0">
          <div className="flex justify-center">
            <div
              className="relative"
              style={{
                width: `${wallDimensions.width}px`,
                height: `${wallDimensions.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top center'
              }}
            >
              <ClimbingWall widthmm={wallDimensions.width} heightmm={wallDimensions.height} />
              <RockWallPoints
                widthmm={wallDimensions.width}
                heightmm={wallDimensions.height}
                marginTop={0}
                marginBottom={wallDimensions.marginBottom}
                marginLeft={wallDimensions.marginLeft}
                marginRight={0}
                pointSpacing={wallDimensions.pointSpacing}
                horizontalBlankAfter={wallDimensions.horizontalBlankAfter}
                verticalBlankAfter={wallDimensions.verticalBlankAfter}
                horizontalBlankLength={wallDimensions.horizontalBlankLength}
                verticalBlankLength={wallDimensions.verticalBlankLength}
                highlightedLabels={highlightedLabels}
                onPointClick={handlePointClick}
                pointTimes={pointTimes}
                showNonHighlightedPoints={showNonHighlightedPoints}
              />
            </div>
          </div>
        </div>

        {/* 右侧区域 */}
        <div className="w-full sm:w-1/3 bg-gray-100 flex flex-col overflow-hidden" style={{ minWidth: '300px' }}>
          {/* 设置区和时间记录区共享同一个容器 */}
          <div className="flex-grow overflow-y-auto">
            {/* 设置区 */}
            <div className={`${showSettings ? 'block' : 'hidden'} p-4`}>
              <div className="space-y-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">赛道类型:</label>
                  <div className="mt-2 flex justify-left">
                    {['儿童', '成人'].map((type) => (
                      <button
                        key={type}
                        onClick={() => switchWallType(type as '儿童' | '成人')}
                        className={`px-3 py-1 rounded ${wallDimensions.walltype === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show-non-highlighted"
                    checked={showNonHighlightedPoints}
                    onChange={(e) => setShowNonHighlightedPoints(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="show-non-highlighted" className="text-sm font-medium text-gray-700">显示/隐藏岩孔</label>
                </div>
                <label className="block">
                  自定义岩壁参数：
                </label>

                {/* 其他设置选项 */}
                <label className="block">
                  岩壁宽度 (mm):
                  <input
                    type="number"
                    value={wallDimensions.width}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ width: parseFloat(e.target.value) })}
                  />
                </label>
                <label className="block">
                  岩壁高度 (mm):
                  <input
                    type="number"
                    value={wallDimensions.height}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ height: parseFloat(e.target.value) })}
                  />
                </label>
                <label className="block">
                  底部边距 (mm):
                  <input
                    type="number"
                    value={wallDimensions.marginBottom}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ marginBottom: parseFloat(e.target.value) })}
                  />
                </label>
                <label className="block">
                  左侧边距 (mm):
                  <input
                    type="number"
                    value={wallDimensions.marginLeft}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ marginLeft: parseFloat(e.target.value) })}
                  />
                </label>
                <label className="block">
                  点间距 (mm):
                  <input
                    type="number"
                    value={wallDimensions.pointSpacing}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ pointSpacing: parseFloat(e.target.value) })}
                  />
                </label>
                <label className="block">
                  水平空白后 (点):
                  <input
                    type="number"
                    value={wallDimensions.horizontalBlankAfter}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ horizontalBlankAfter: parseInt(e.target.value) })}
                  />
                </label>
                <label className="block">
                  垂直空白后 (点):
                  <input
                    type="number"
                    value={wallDimensions.verticalBlankAfter}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ verticalBlankAfter: parseInt(e.target.value) })}
                  />
                </label>
                <label className="block">
                  水平空白长度 (mm):
                  <input
                    type="number"
                    value={wallDimensions.horizontalBlankLength}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ horizontalBlankLength: parseFloat(e.target.value) })}
                  />
                </label>
                <label className="block">
                  垂直空白长度 (mm):
                  <input
                    type="number"
                    value={wallDimensions.verticalBlankLength}
                    className="mt-1 p-1 border rounded"
                    onChange={e => handleWallDimensionsChange({ verticalBlankLength: parseFloat(e.target.value) })}
                  />
                </label>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleGenerateWall}>
                  生成岩壁
                </button>
                <label className="block">
                  <input
                    type="text"
                    value={labelsInput}
                    onChange={handleLabelsChange}
                    placeholder="输入格式：标签:类型; 例如 R8A10:终点; R8B1:手点; R7E9:脚点"
                    className="border p-1 rounded w-full"
                  />
                </label>
                <label className="block">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleApplyLabels}>
                    应用高亮
                  </button>
                </label>

                {/* 添加显示/隐藏非高亮点的勾选框 */}

              </div>
            </div>

            {/* 时间记录区 */}
            <div className={`${showSettings ? 'hidden' : 'block'} p-4`}>
              {/* 运动员姓名输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">运动员姓名</label>
                <input
                  type="text"
                  value={athleteName}
                  onChange={handleAthleteNameChange}
                  placeholder="输入运动员姓名"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              {/* 时间填列区域 - 始终显示 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">触摸时间 (秒)</label>
                <input
                  type="text"
                  value={touchTime}
                  onChange={handleTimeChange}
                  placeholder="输入时间 (秒)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">使用部位</label>
                <div className="mt-2 flex justify-between">
                  {['左手', '右手', '左脚', '右脚'].map((part) => (
                    <button
                      key={part}
                      onClick={() => handleBodyPartChange(part as '左手' | '右手' | '左脚' | '右脚')}
                      className={`px-3 py-1 rounded ${bodyPart === part ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                        }`}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleTimeSubmit}
                disabled={!selectedPoint || !athleteName.trim() || !touchTime.trim()}
              >
                提交
              </button>

              {selectedPoint && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">岩点编号: {selectedPoint}({highlightedLabels.find(hl => hl.label === selectedPoint)?.type})</h3>
                  {/* 显选中点的时间记录 */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">时间记录:</h4>
                    <ul className="space-y-2">
                      {pointTimes
                        .filter(time => time.pointLabel === selectedPoint && time.walltype === wallDimensions.walltype)
                        .map((time, index) => (
                          <li key={index} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                            <div>
                              <div><strong>运动员:</strong> {time.athleteName}</div>
                              <div><strong>使用部位:</strong> {time.bodyPart}</div>
                              <div className="flex items-center">
                                <strong>时间:</strong> {time.timeInSeconds} 秒
                                <button
                                  onClick={() => handleDeleteRecord(time._id, time.athleteName, time.timeInSeconds)}
                                  className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                >
                                  删除
                                </button>
                              </div>
                              <div><strong>记录日期:</strong> {formatDate(time.timestamp)}</div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 text-center p-2">
        © 2024 攀岩墙模拟器。保留所有权利。
      </footer>
    </div>
  );
}

export default Home;