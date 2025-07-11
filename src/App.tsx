import React, { useState, useEffect, useRef } from 'react';

const AWSResourceMapper = () => {
  const [selectedApp, setSelectedApp] = useState('App A');
  const [animationTime, setAnimationTime] = useState(0);
  const [highlightedFlow, setHighlightedFlow] = useState<string | null>(null);
  const [rotationX, setRotationX] = useState(-3);
  const [rotationY, setRotationY] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation loop for flow particles
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.03);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for subtle 3D perspective
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = (e.clientX - centerX) / rect.width;
        const mouseY = (e.clientY - centerY) / rect.height;
        
        setRotationX(-3 + mouseY * 4);
        setRotationY(1 + mouseX * 4);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // AWS service configurations
  const serviceIcons = {
    EC2: {
      color: '#FF9900',
      bgColor: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)',
      borderColor: '#FF9900',
      shadowColor: 'rgba(255, 153, 0, 0.3)',
      icon: '🖥️',
      label: 'EC2',
      category: 'Compute'
    },
    S3: {
      color: '#3F90CF',
      bgColor: 'linear-gradient(135deg, #F0F8FF 0%, #B0E0E6 100%)',
      borderColor: '#3F90CF',
      shadowColor: 'rgba(63, 144, 207, 0.3)',
      icon: '📦',
      label: 'S3',
      category: 'Storage'
    },
    RDS: {
      color: '#527FFF',
      bgColor: 'linear-gradient(135deg, #F5F7FF 0%, #C7D2FE 100%)',
      borderColor: '#527FFF',
      shadowColor: 'rgba(82, 127, 255, 0.3)',
      icon: '🗄️',
      label: 'RDS',
      category: 'Database'
    },
    Lambda: {
      color: '#FF9900',
      bgColor: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)',
      borderColor: '#FF9900',
      shadowColor: 'rgba(255, 153, 0, 0.3)',
      icon: 'λ',
      label: 'Lambda',
      category: 'Serverless'
    },
    CloudWatch: {
      color: '#3F90CF',
      bgColor: 'linear-gradient(135deg, #F0F8FF 0%, #B0E0E6 100%)',
      borderColor: '#3F90CF',
      shadowColor: 'rgba(63, 144, 207, 0.3)',
      icon: '📊',
      label: 'CloudWatch',
      category: 'Monitor'
    },
    APIGateway: {
      color: '#FF4B4B',
      bgColor: 'linear-gradient(135deg, #FFF5F5 0%, #FEB2B2 100%)',
      borderColor: '#FF4B4B',
      shadowColor: 'rgba(255, 75, 75, 0.3)',
      icon: '🌐',
      label: 'API Gateway',
      category: 'Network'
    },
    ELB: {
      color: '#8C4FFF',
      bgColor: 'linear-gradient(135deg, #F8F5FF 0%, #D8B4FE 100%)',
      borderColor: '#8C4FFF',
      shadowColor: 'rgba(140, 79, 255, 0.3)',
      icon: '⚖️',
      label: 'Load Balancer',
      category: 'Network'
    },
    VPC: {
      color: '#4CAF50',
      bgColor: 'linear-gradient(135deg, #F8FFF8 0%, #A7F3D0 100%)',
      borderColor: '#4CAF50',
      shadowColor: 'rgba(76, 175, 80, 0.2)',
      icon: '🏢',
      label: 'VPC',
      category: 'Network'
    }
  };

  // Application configurations with full-width spread
  const applications: { [key: string]: {
    resources: any[];
    title: string;
    description: string;
    flowDescription: string;
  } } = {
    'App A': {
      resources: [
        { 
          id: 'vpc', 
          service: 'VPC', 
          x: 50, 
          y: 80, 
          z: 5,
          width: 1400, 
          height: 500, 
          type: 'container' 
        },
        // Left Column - Entry Points (spread vertically)
        { 
          id: 'elb', 
          service: 'ELB', 
          x: 150, 
          y: 180, 
          z: 30,
          connections: [
            { to: 'ec2-1', label: 'HTTP/HTTPS', type: 'sync', throughput: '5K req/s' },
            { to: 'ec2-2', label: 'HTTP/HTTPS', type: 'sync', throughput: '5K req/s' }
          ] 
        },
        { 
          id: 'cloudwatch', 
          service: 'CloudWatch', 
          x: 150, 
          y: 380, 
          z: 35,
          connections: [
            { to: 'ec2-1', label: 'Metrics', type: 'async', throughput: '1K/min' },
            { to: 'ec2-2', label: 'Metrics', type: 'async', throughput: '1K/min' }
          ] 
        },
        
        // Middle Column - Processing Layer (spread vertically)
        { 
          id: 'ec2-1', 
          service: 'EC2', 
          x: 650, 
          y: 160, 
          z: 40,
          connections: [
            { to: 'rds', label: 'SQL Query', type: 'sync', throughput: '2K qps' },
            { to: 's3', label: 'File Read', type: 'async', throughput: '500MB/s' }
          ]
        },
        { 
          id: 'ec2-2', 
          service: 'EC2', 
          x: 650, 
          y: 400, 
          z: 40,
          connections: [
            { to: 'rds', label: 'SQL Query', type: 'sync', throughput: '3K qps' },
            { to: 's3', label: 'File Write', type: 'async', throughput: '800MB/s' }
          ]
        },
        
        // Right Column - Data Layer (spread vertically)
        { 
          id: 'rds', 
          service: 'RDS', 
          x: 1150, 
          y: 180, 
          z: 50,
          connections: [] 
        },
        { 
          id: 's3', 
          service: 'S3', 
          x: 1150, 
          y: 380, 
          z: 45,
          connections: [] 
        }
      ],
      title: 'Web Application Architecture',
      description: 'Traditional 3-tier web application with load balancer, compute, and data layers',
      flowDescription: 'Traffic flows from ELB through EC2 instances to RDS and S3 storage with CloudWatch monitoring'
    },
    'App B': {
      resources: [
        { 
          id: 'vpc', 
          service: 'VPC', 
          x: 50, 
          y: 80, 
          z: 5,
          width: 1400, 
          height: 500, 
          type: 'container' 
        },
        // Left Column - API Layer (spread vertically)
        { 
          id: 'api', 
          service: 'APIGateway', 
          x: 150, 
          y: 200, 
          z: 30,
          connections: [
            { to: 'lambda-1', label: 'REST API', type: 'sync', throughput: '25K req/s' },
            { to: 'lambda-2', label: 'REST API', type: 'sync', throughput: '25K req/s' }
          ] 
        },
        { 
          id: 'cloudwatch', 
          service: 'CloudWatch', 
          x: 150, 
          y: 400, 
          z: 35,
          connections: [
            { to: 'lambda-1', label: 'Logs', type: 'async', throughput: '2K/min' },
            { to: 'lambda-2', label: 'Logs', type: 'async', throughput: '2K/min' }
          ] 
        },
        
        // Middle Column - Serverless Processing (spread vertically)
        { 
          id: 'lambda-1', 
          service: 'Lambda', 
          x: 650, 
          y: 180, 
          z: 40,
          connections: [
            { to: 's3', label: 'Data Store', type: 'sync', throughput: '300MB/s' }
          ]
        },
        { 
          id: 'lambda-2', 
          service: 'Lambda', 
          x: 650, 
          y: 420, 
          z: 40,
          connections: [
            { to: 's3', label: 'Data Process', type: 'async', throughput: '200MB/s' }
          ]
        },
        
        // Right Column - Storage (centered)
        { 
          id: 's3', 
          service: 'S3', 
          x: 1150, 
          y: 300, 
          z: 45,
          connections: [] 
        }
      ],
      title: 'Serverless Application Architecture',
      description: 'Event-driven serverless architecture with API Gateway, Lambda, and monitoring',
      flowDescription: 'API requests trigger Lambda functions with CloudWatch monitoring and S3 integration'
    }
  };

  // Calculate connection points for proper block sizing
  const getConnectionPoint = (resource: { x: number; y: number }, targetResource: { x: number; y: number }) => {
    const blockWidth = 140;
    const blockHeight = 90;
    
    const sourceRect = { x: resource.x, y: resource.y, width: blockWidth, height: blockHeight };
    const targetRect = { x: targetResource.x, y: targetResource.y, width: blockWidth, height: blockHeight };
    
    const sourceCenterX = sourceRect.x + sourceRect.width / 2;
    const sourceCenterY = sourceRect.y + sourceRect.height / 2;
    const targetCenterX = targetRect.x + targetRect.width / 2;
    const targetCenterY = targetRect.y + targetRect.height / 2;
    
    let startPoint, endPoint;
    
    // Connect from right edge to left edge for left-to-right flow
    if (targetCenterX > sourceCenterX) {
      startPoint = { x: sourceRect.x + blockWidth, y: sourceCenterY };
      endPoint = { x: targetRect.x, y: targetCenterY };
    } else {
      startPoint = { x: sourceRect.x, y: sourceCenterY };
      endPoint = { x: targetRect.x + blockWidth, y: targetCenterY };
    }
    
    return { startPoint, endPoint };
  };

  const currentApp = applications[selectedApp];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center py-4 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600">
          <h1 className="text-3xl font-bold text-white mb-2">
            AWS Cloud Architecture Visualizer
          </h1>
          <p className="text-slate-300 text-base">
            Interactive 3D system architecture with animated data flow
          </p>
        </div>

        {/* Application Selector */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">{currentApp.title}</h2>
              <p className="text-sm text-slate-300 mb-1">{currentApp.description}</p>
              <p className="text-sm text-blue-400 font-medium">Flow: {currentApp.flowDescription}</p>
            </div>
            <div className="flex gap-4">
              {Object.keys(applications).map((app) => (
                <button
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 border-2 ${
                    selectedApp === app
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 shadow-lg'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 border-slate-500 hover:border-blue-400'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main 3D Architecture Diagram */}
        <div 
          ref={containerRef}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 flex-1 overflow-hidden m-3 rounded-xl"
          style={{ 
            minHeight: '80vh',
            perspective: '2500px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-3 border-b border-slate-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">{currentApp.title}</h2>
              <div className="flex items-center gap-8 text-base text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3 bg-blue-500 rounded-full"></div>
                  <span>Synchronous Flow</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3 bg-green-500 rounded-full opacity-75"></div>
                  <span>Asynchronous Flow</span>
                </div>
                <div className="text-sm text-slate-400 font-medium">Left → Middle → Right Architecture</div>
              </div>
            </div>
          </div>
          
          <div 
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 flex-1"
            style={{ 
              height: 'calc(100% - 70px)', 
              minHeight: '700px',
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* Enhanced Grid Background */}
            <div 
              className="absolute inset-0" 
              style={{ 
                transform: 'translateZ(-30px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <svg width="100%" height="100%" className="w-full h-full opacity-15">
                <defs>
                  <pattern id="grid3d" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#475569" strokeWidth="1"/>
                    <circle cx="0" cy="0" r="1.5" fill="#64748b"/>
                  </pattern>
                  <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid3d)" />
                <rect width="100%" height="100%" fill="url(#gridGradient)" />
              </svg>
            </div>

            {/* Column Separators with Labels */}
            <div className="absolute inset-0" style={{ transform: 'translateZ(8px)' }}>
              {/* Left Column */}
              <div className="absolute left-[300px] top-[60px] bottom-[60px] w-1 bg-gradient-to-b from-blue-500/40 to-blue-500/10 rounded-full"></div>
              <div className="absolute left-[250px] top-[40px] text-blue-400 text-lg font-bold bg-slate-800/90 px-4 py-2 rounded-lg border border-blue-500/30">
                Entry Layer
              </div>
              
              {/* Middle Column */}
              <div className="absolute left-[800px] top-[60px] bottom-[60px] w-1 bg-gradient-to-b from-green-500/40 to-green-500/10 rounded-full"></div>
              <div className="absolute left-[730px] top-[40px] text-green-400 text-lg font-bold bg-slate-800/90 px-4 py-2 rounded-lg border border-green-500/30">
                Processing Layer
              </div>
              
              {/* Right Column */}
              <div className="absolute left-[1300px] top-[60px] bottom-[60px] w-1 bg-gradient-to-b from-purple-500/40 to-purple-500/10 rounded-full"></div>
              <div className="absolute left-[1240px] top-[40px] text-purple-400 text-lg font-bold bg-slate-800/90 px-4 py-2 rounded-lg border border-purple-500/30">
                Data Layer
              </div>
            </div>

            {/* VPC Container */}
            {currentApp.resources.find((r: { type: string }) => r.type === 'container') && (
              <div
                className="absolute border-3 border-dashed border-green-400 rounded-xl"
                style={{
                  left: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').x}px`,
                  top: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').y}px`,
                  width: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').width}px`,
                  height: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').height}px`,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%)',
                  backdropFilter: 'blur(10px)',
                  transform: 'translateZ(5px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: `
                    0 25px 50px rgba(34, 197, 94, 0.15),
                    inset 0 1px 0 rgba(34, 197, 94, 0.3)
                  `
                }}
              >
                <div 
                  className="absolute -top-16 left-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl text-base font-bold shadow-2xl border border-green-500"
                  style={{
                    transform: 'translateZ(25px)',
                    boxShadow: '0 15px 35px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏢</span>
                    <span>VPC (Virtual Private Cloud)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simple Animated Connection Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ 
                transform: 'translateZ(20px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <defs>
                {/* Enhanced Arrow Markers */}
                <marker
                  id="sync-arrow"
                  markerWidth="20"
                  markerHeight="20"
                  refX="18"
                  refY="10"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path 
                    d="M2,2 L2,18 L18,10 z" 
                    fill="#3b82f6" 
                    stroke="#1d4ed8" 
                    strokeWidth="1"
                    filter="drop-shadow(0 3px 6px rgba(59, 130, 246, 0.5))"
                  />
                </marker>
                
                <marker
                  id="async-arrow"
                  markerWidth="20"
                  markerHeight="20"
                  refX="18"
                  refY="10"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path 
                    d="M2,2 L2,18 L18,10 z" 
                    fill="#10b981" 
                    stroke="#059669" 
                    strokeWidth="1"
                    filter="drop-shadow(0 3px 6px rgba(16, 185, 129, 0.5))"
                  />
                </marker>

                {/* Flow animation patterns */}
                <pattern id="flowPatternSync" patternUnits="userSpaceOnUse" width="30" height="6">
                  <rect width="30" height="6" fill="none"/>
                  <circle cx="3" cy="3" r="2" fill="rgba(59, 130, 246, 0.8)">
                    <animate attributeName="cx" values="3;27;3" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                </pattern>

                <pattern id="flowPatternAsync" patternUnits="userSpaceOnUse" width="30" height="6">
                  <rect width="30" height="6" fill="none"/>
                  <circle cx="3" cy="3" r="2" fill="rgba(16, 185, 129, 0.8)">
                    <animate attributeName="cx" values="3;27;3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </pattern>
              </defs>

              {/* Simple Straight Connection Lines */}
              {currentApp.resources
                .filter((r: { type: string }) => r.type !== 'container')
                .map((resource: {
                  id: string;
                  x: number;
                  y: number;
                  connections: { to: string; label: string; type: string; throughput: string }[];
                }) =>
                resource.connections.map((connection, index) => {
                  const targetResource = currentApp.resources.find((r: { id: string }) => r.id === connection.to);
                  if (!targetResource) return null;

                  const { startPoint, endPoint } = getConnectionPoint(resource, targetResource);
                  const flowId = `${resource.id}-${connection.to}`;
                  
                  const isSync = connection.type === 'sync';
                  const strokeColor = isSync ? '#3b82f6' : '#10b981';
                  const strokeWidth = highlightedFlow === flowId ? 8 : 5;

                  return (
                    <g key={flowId}>
                      {/* Background glow line */}
                      <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 6}
                        opacity="0.3"
                        strokeLinecap="round"
                      />
                      
                      {/* Main connection line */}
                      <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={isSync ? 'none' : '20,10'}
                        markerEnd={isSync ? "url(#sync-arrow)" : "url(#async-arrow)"}
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHighlightedFlow(flowId)}
                        onMouseLeave={() => setHighlightedFlow(null)}
                        opacity={highlightedFlow === flowId ? 1 : 0.9}
                        style={{ pointerEvents: 'stroke' }}
                      />

                      {/* Flow animation overlay */}
                      {highlightedFlow === flowId && (
                        <line
                          x1={startPoint.x}
                          y1={startPoint.y}
                          x2={endPoint.x}
                          y2={endPoint.y}
                          stroke={isSync ? "url(#flowPatternSync)" : "url(#flowPatternAsync)"}
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Connection Label */}
                      <g transform={`translate(${(startPoint.x + endPoint.x) / 2}, ${(startPoint.y + endPoint.y) / 2 - 25})`}>
                        <rect
                          x="-60"
                          y="-30"
                          width="120"
                          height="60"
                          rx="12"
                          fill="rgba(15, 23, 42, 0.95)"
                          stroke={strokeColor}
                          strokeWidth="2"
                          filter="drop-shadow(0 6px 16px rgba(0, 0, 0, 0.5))"
                        />
                        <text
                          x="0"
                          y="-10"
                          textAnchor="middle"
                          className="text-sm font-bold fill-white"
                        >
                          {connection.label}
                        </text>
                        <text
                          x="0"
                          y="5"
                          textAnchor="middle"
                          className="text-sm fill-slate-300"
                        >
                          {connection.throughput}
                        </text>
                        <text
                          x="0"
                          y="20"
                          textAnchor="middle"
                          className="text-sm font-bold"
                          fill={strokeColor}
                        >
                          {isSync ? 'SYNC' : 'ASYNC'}
                        </text>
                      </g>
                    </g>
                  );
                })
              )}
            </svg>

            {/* Properly Sized AWS Resource Blocks */}
            <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              {currentApp.resources
                .filter((r: { type: string }) => r.type !== 'container')
                .sort((a, b) => (a.z || 0) - (b.z || 0))
                .map((resource: { service: string; id: string; x: number; y: number; z?: number; connections: any[] }) => {
                  const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                  const zDepth = resource.z || 30;
                  
                return (
                  <div
                    key={resource.id}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${resource.x}px`,
                      top: `${resource.y}px`,
                      width: '140px',
                      height: '90px',
                      transform: `translateZ(${zDepth}px)`,
                      transformStyle: 'preserve-3d',
                      zIndex: Math.floor(zDepth)
                    }}
                  >
                    {/* Enhanced Service Block */}
                    <div
                      className="w-full h-full rounded-xl shadow-2xl border-3 transition-all duration-300 group-hover:shadow-3xl group-hover:scale-110 flex flex-col justify-center items-center p-3 relative overflow-hidden"
                      style={{
                        background: serviceConfig.bgColor,
                        borderColor: serviceConfig.borderColor,
                        borderLeftWidth: '6px',
                        borderLeftColor: serviceConfig.color,
                        boxShadow: `
                          0 ${zDepth/2}px ${zDepth}px ${serviceConfig.shadowColor},
                          0 8px 16px rgba(0, 0, 0, 0.2),
                          inset 0 1px 0 rgba(255, 255, 255, 0.4)
                        `,
                        transform: `
                          perspective(1000px) 
                          rotateX(${rotationX * 0.1}deg) 
                          rotateY(${rotationY * 0.1}deg)
                        `
                      }}
                    >
                      {/* Service Icon */}
                      <div 
                        className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-125"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                          transform: `translateZ(${zDepth/3}px)`
                        }}
                      >
                        {serviceConfig.icon}
                      </div>
                      
                      {/* Service Name */}
                      <div className="text-sm font-bold text-center text-gray-800 leading-tight mb-1">
                        {serviceConfig.label}
                      </div>
                      
                      {/* Service Category */}
                      <div 
                        className="text-xs px-3 py-1 rounded-full text-white font-bold shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${serviceConfig.color} 0%, ${serviceConfig.color}DD 100%)`,
                          fontSize: '10px'
                        }}
                      >
                        {serviceConfig.category}
                      </div>

                      {/* Connection Count Badge */}
                      {resource.connections.length > 0 && (
                        <div 
                          className="absolute -right-2 -top-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-xl border-2 border-white"
                          style={{
                            transform: `translateZ(${zDepth/2}px)`,
                            fontSize: '10px'
                          }}
                        >
                          {resource.connections.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Hover Tooltip */}
                    <div 
                      className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl border border-slate-600"
                      style={{
                        transform: `translateX(-50%) translateZ(${zDepth + 30}px)`,
                        zIndex: 1000
                      }}
                    >
                      <div className="font-bold text-white text-base">{serviceConfig.label}</div>
                      <div className="text-slate-300 text-sm">{serviceConfig.category}</div>
                      <div className="text-blue-400 text-sm">Depth: {zDepth}px</div>
                      <div className="text-slate-400 text-sm">Connections: {resource.connections.length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Architecture Summary */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 rounded-xl p-4 shadow-2xl m-3">
          <h3 className="text-xl font-bold text-white mb-3">Architecture Overview</h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column Components */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 rounded-xl p-4 border border-blue-500/30">
              <h4 className="text-blue-400 font-bold mb-3 text-base">Entry Layer</h4>
              <div className="space-y-3">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x < 500)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{serviceConfig.icon}</span>
                        <span className="text-white font-semibold">{serviceConfig.label}</span>
                        <span className="text-blue-400 font-bold">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Middle Column Components */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 rounded-xl p-4 border border-green-500/30">
              <h4 className="text-green-400 font-bold mb-3 text-base">Processing Layer</h4>
              <div className="space-y-3">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x >= 500 && r.x < 1000)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{serviceConfig.icon}</span>
                        <span className="text-white font-semibold">{serviceConfig.label}</span>
                        <span className="text-green-400 font-bold">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column Components */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 rounded-xl p-4 border border-purple-500/30">
              <h4 className="text-purple-400 font-bold mb-3 text-base">Data Layer</h4>
              <div className="space-y-3">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x >= 1000)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{serviceConfig.icon}</span>
                        <span className="text-white font-semibold">{serviceConfig.label}</span>
                        <span className="text-purple-400 font-bold">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSResourceMapper;