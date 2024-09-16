// pages.tsx
'use client';
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

const Home: React.FC = () => {
  const [wallDimensions, setWallDimensions] = useState({
    width: 3000,
    height: 12000,
    marginBottom: 185,
    marginLeft: 125,
    pointSpacing: 125,
    horizontalBlankAfter: 11,
    verticalBlankAfter: 10,
    horizontalBlankLength: 125,
    verticalBlankLength: 245,
    walltype: '儿童' as '儿童' | '成人' // 添加 walltype 到 wallDimensions
  });

  const [showWall, setShowWall] = useState<boolean>(false);
  const [highlightedLabels, setHighlightedLabels] = useState<string[]>([
    "R8B1", "R8E5", "R7E9", "R7A6", "R7D5", "R7G1", "R6E9", "R6H6",
    "R6B5", "R6A1", "R6E1", "R5A8", "R5C6", "L5I5", "L5L1", "R5A1",
    "L4H8", "R4C8", "R4C6", "L4M4", "R4G2", "R3C10", "R3E7", "R3E5",
    "R3A2", "L2I10", "R2D9", "L2M5", "L2I1", "L1M9", "L1H8", "L1H5", "L1M2", "R8A10"
  ]);
  const [labelsInput, setLabelsInput] = useState<string>(highlightedLabels.join('; '));
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [touchTime, setTouchTime] = useState<string>('');
  const [pointTimes, setPointTimes] = useState<PointTime[]>([]);
  const [athleteName, setAthleteName] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<'左手' | '右手' | '左脚' | '右脚'>('左手');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const handleGenerateWall = () => {
    setShowWall(true);
  };

  const handleLabelsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelsInput(event.target.value);
  };

  const handleApplyLabels = () => {
    const labelsArray = labelsInput.split(';').map(label => label.trim()).filter(label => label !== '');
    setHighlightedLabels(labelsArray);
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
    // 验证运动员姓名和时间不为空
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
      const response = await fetch('/api/climbing-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pointLabel: selectedPoint,
          timeInSeconds: parseFloat(touchTime),
          athleteName,
          bodyPart,
          walltype: wallDimensions.walltype // 使用当前选择的赛道类型
        })
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
      return; // 如果用户取消，则不执行删除操作
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

  const ClimbingWall: React.FC<{widthmm: number, heightmm: number}> = ({ widthmm, heightmm }) => (
    <div style={{
      position: 'relative',
      width: `${widthmm}px`, 
      height: `${heightmm}px`, 
      backgroundColor: 'lightgray', 
      border: '1px solid black'
    }}>
      攀岩: {widthmm / 100}m x {heightmm / 100}m
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
    highlightedLabels: string[];
    onPointClick: (label: string) => void;
    pointTimes: PointTime[];
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
    pointTimes
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

    return (
      <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '100%' }}>
        {points.map((point, index) => {
          const isHighlighted = highlightedLabels.includes(point.label);
          const size = isHighlighted ? '50px' : '10px'; // 增大高亮点的尺寸
          const offset = isHighlighted ? 15 : 5; // 调整偏移量以保持居中
          const pointTime = pointTimes.find(time => time.pointLabel === point.label);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${point.x - offset}px`,
                bottom: `${point.y - offset}px`,
                width: size,
                height: size,
                backgroundColor: isHighlighted ? 'transparent' : 'black',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: isHighlighted ? '12px' : '0',
                color: 'white',
                zIndex: isHighlighted ? 2 : 1, // 确保高亮点在其他点之上
              }}
              onClick={() => onPointClick(point.label)}
              onMouseEnter={() => setHoveredPoint(point.label)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {isHighlighted && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'red',
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 3 }}>{point.label}</span>
                </>
              )}
              {pointTime && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap'
                }}>
                  {pointTime.athleteName} - {pointTime.bodyPart} - {pointTime.timeInSeconds}秒
                </div>
              )}
              {hoveredPoint === point.label && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  zIndex: 4
                }}>
                  {point.label}
                  {isHighlighted && (
                    <>
                      <br />
                      {pointTimes
                        .filter(time => time.pointLabel === point.label)
                        .map((time, index) => (
                          <div key={index}>
                            {time.athleteName} - {time.bodyPart} - {time.timeInSeconds}秒
                          </div>
                        ))}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-200 text-center p-4 flex justify-between items-center">
        <h1>欢迎使用攀岩墙模拟器</h1>
        <div className="flex items-center">
          <span className="mr-4">当前赛道：{wallDimensions.walltype}</span>
          <label htmlFor="scale-slider" className="mr-2">缩放：</label>
          <input
            id="scale-slider"
            type="range"
            min="0.1"
            max="2"
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
      </header>
      <div className="flex flex-grow overflow-hidden">
        {/* 中间岩壁显示区 */}
        <div className="flex-grow overflow-auto">
          <div 
            className="relative" 
            style={{ 
              width: `${wallDimensions.width}px`, 
              height: `${wallDimensions.height}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
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
            />
          </div>
        </div>

        {/* 右侧区域 - 增加宽度 */}
        <div className="w-1/3 bg-gray-100 overflow-hidden relative">
          {/* 设置区 */}
          <div className={`absolute top-0 left-0 w-full h-full bg-gray-100 p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="space-y-2">
              <label className="block">
                岩壁宽度 (mm):
                <input
                  type="number"
                  value={wallDimensions.width}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, width: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block">
                岩壁高度 (mm):
                <input
                  type="number"
                  value={wallDimensions.height}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, height: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block">
                底部边距 (mm):
                <input
                  type="number"
                  value={wallDimensions.marginBottom}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, marginBottom: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block">
                左侧边距 (mm):
                <input
                  type="number"
                  value={wallDimensions.marginLeft}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, marginLeft: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block">
                点间距 (mm):
                <input
                  type="number"
                  value={wallDimensions.pointSpacing}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, pointSpacing: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block">
                水平空白后 (点):
                <input
                  type="number"
                  value={wallDimensions.horizontalBlankAfter}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, horizontalBlankAfter: parseInt(e.target.value) })}
                />
              </label>
              <label className="block">
                垂直空白后 (点):
                <input
                  type="number"
                  value={wallDimensions.verticalBlankAfter}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, verticalBlankAfter: parseInt(e.target.value) })}
                />
              </label>
              <label className="block">
                水平空白长度 (mm):
                <input
                  type="number"
                  value={wallDimensions.horizontalBlankLength}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, horizontalBlankLength: parseFloat(e.target.value) })}
                />
              </label>
              <label className="block">
                垂直空白长度 (mm):
                <input
                  type="number"
                  value={wallDimensions.verticalBlankLength}
                  className="mt-1 p-1 border rounded"
                  onChange={e => setWallDimensions({ ...wallDimensions, verticalBlankLength: parseFloat(e.target.value) })}
                />
              </label>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleGenerateWall}>
                生成岩壁
              </button>
              <input type="text" value={labelsInput} onChange={handleLabelsChange} placeholder="高亮标签" className="border p-1 rounded" />
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleApplyLabels}>
                应用高亮
              </button>
              
              {/* 添加赛道类型选择 */}
              <label className="block">
                赛道类型:
                <div className="mt-2 flex justify-between">
                  {['儿童', '成人'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWallDimensions({ ...wallDimensions, walltype: type as '儿童' | '成人' })}
                      className={`px-3 py-1 rounded ${
                        wallDimensions.walltype === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </div>

          {/* 时间记录区 */}
          <div className={`p-4 overflow-y-auto h-full ${showSettings ? 'hidden' : 'block'}`}>
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
                    className={`px-3 py-1 rounded ${
                      bodyPart === part ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
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
              提交时间 ({wallDimensions.walltype}赛道)
            </button>

            {selectedPoint && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">选中点: {selectedPoint}</h3>
                {/* 显��选中点的时间记录 */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">之前的时间 ({wallDimensions.walltype}赛道):</h4>
                  <ul className="space-y-2">
                    {pointTimes
                      .filter(time => time.pointLabel === selectedPoint && time.walltype === wallDimensions.walltype)
                      .map((time, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                          <div>
                            <div><strong>运动员:</strong> {time.athleteName}</div>
                            <div><strong>使用部位:</strong> {time.bodyPart}</div>
                            <div><strong>时间:</strong> {time.timeInSeconds} 秒</div>
                            <div><strong>记录日期:</strong> {formatDate(time.timestamp)}</div>
                            <div><strong>墙面类型:</strong> {time.walltype}</div>
                          </div>
                          <button
                            onClick={() => handleDeleteRecord(time._id, time.athleteName, time.timeInSeconds)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            删除
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
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