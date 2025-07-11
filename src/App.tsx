import React, { useState, useEffect, useRef } from 'react';

const AWSResourceMapper = () => {
  const [selectedApp, setSelectedApp] = useState('App A');
  const [animationTime, setAnimationTime] = useState(0);
  const [highlightedFlow, setHighlightedFlow] = useState<string | null>(null);
  const [rotationX, setRotationX] = useState(-5);
  const [rotationY, setRotationY] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation loop for flow particles
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.02);
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
        
        setRotationX(-5 + mouseY * 6);
        setRotationY(2 + mouseX * 6);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // AWS service configurations with enhanced 3D styling
  const serviceIcons = {
    EC2: {
      color: '#FF9900',
      bgColor: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)',
      borderColor: '#FF9900',
      shadowColor: 'rgba(255, 153, 0, 0.4)',
      icon: '🖥️',
      label: 'EC2',
      category: 'Compute',
      depth: 40
    },
    S3: {
      color: '#3F90CF',
      bgColor: 'linear-gradient(135deg, #F0F8FF 0%, #B0E0E6 100%)',
      borderColor: '#3F90CF',
      shadowColor: 'rgba(63, 144, 207, 0.4)',
      icon: '📦',
      label: 'S3',
      category: 'Storage',
      depth: 50
    },
    RDS: {
      color: '#527FFF',
      bgColor: 'linear-gradient(135deg, #F5F7FF 0%, #C7D2FE 100%)',
      borderColor: '#527FFF',
      shadowColor: 'rgba(82, 127, 255, 0.4)',
      icon: '🗄️',
      label: 'RDS',
      category: 'Database',
      depth: 60
    },
    Lambda: {
      color: '#FF9900',
      bgColor: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)',
      borderColor: '#FF9900',
      shadowColor: 'rgba(255, 153, 0, 0.4)',
      icon: 'λ',
      label: 'Lambda',
      category: 'Compute',
      depth: 45
    },
    CloudWatch: {
      color: '#3F90CF',
      bgColor: 'linear-gradient(135deg, #F0F8FF 0%, #B0E0E6 100%)',
      borderColor: '#3F90CF',
      shadowColor: 'rgba(63, 144, 207, 0.4)',
      icon: '📊',
      label: 'CloudWatch',
      category: 'Monitor',
      depth: 35
    },
    APIGateway: {
      color: '#FF4B4B',
      bgColor: 'linear-gradient(135deg, #FFF5F5 0%, #FEB2B2 100%)',
      borderColor: '#FF4B4B',
      shadowColor: 'rgba(255, 75, 75, 0.4)',
      icon: '🌐',
      label: 'API Gateway',
      category: 'Network',
      depth: 30
    },
    ELB: {
      color: '#8C4FFF',
      bgColor: 'linear-gradient(135deg, #F8F5FF 0%, #D8B4FE 100%)',
      borderColor: '#8C4FFF',
      shadowColor: 'rgba(140, 79, 255, 0.4)',
      icon: '⚖️',
      label: 'Load Balancer',
      category: 'Network',
      depth: 30
    },
    VPC: {
      color: '#4CAF50',
      bgColor: 'linear-gradient(135deg, #F8FFF8 0%, #A7F3D0 100%)',
      borderColor: '#4CAF50',
      shadowColor: 'rgba(76, 175, 80, 0.3)',
      icon: '🏢',
      label: 'VPC',
      category: 'Network',
      depth: 10
    }
  };

  // Application configurations with left-middle-right layout
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
          x: 100, 
          y: 120, 
          z: 10,
          width: 1100, 
          height: 400, 
          type: 'container' 
        },
        // Left Column - Entry Points
        { 
          id: 'elb', 
          service: 'ELB', 
          x: 200, 
          y: 200, 
          z: 30,
          connections: [
            { to: 'ec2-1', label: 'HTTP/HTTPS', type: 'sync', throughput: '5K req/s' },
            { to: 'ec2-2', label: 'HTTP/HTTPS', type: 'sync', throughput: '5K req/s' }
          ] 
        },
        { 
          id: 'cloudwatch', 
          service: 'CloudWatch', 
          x: 200, 
          y: 350, 
          z: 35,
          connections: [] 
        },
        
        // Middle Column - Processing Layer
        { 
          id: 'ec2-1', 
          service: 'EC2', 
          x: 500, 
          y: 180, 
          z: 40,
          connections: [
            { to: 'rds', label: 'SQL Query', type: 'sync', throughput: '2K qps' },
            { to: 's3', label: 'File Read', type: 'async', throughput: '500MB/s' }
          ]
        },
        { 
          id: 'ec2-2', 
          service: 'EC2', 
          x: 500, 
          y: 320, 
          z: 40,
          connections: [
            { to: 'rds', label: 'SQL Query', type: 'sync', throughput: '3K qps' },
            { to: 's3', label: 'File Write', type: 'async', throughput: '800MB/s' }
          ]
        },
        
        // Right Column - Data Layer
        { 
          id: 'rds', 
          service: 'RDS', 
          x: 850, 
          y: 200, 
          z: 60,
          connections: [] 
        },
        { 
          id: 's3', 
          service: 'S3', 
          x: 850, 
          y: 350, 
          z: 50,
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
          x: 100, 
          y: 120, 
          z: 10,
          width: 1100, 
          height: 400, 
          type: 'container' 
        },
        // Left Column - API Layer
        { 
          id: 'api', 
          service: 'APIGateway', 
          x: 200, 
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
          x: 200, 
          y: 350, 
          z: 35,
          connections: [] 
        },
        
        // Middle Column - Serverless Processing
        { 
          id: 'lambda-1', 
          service: 'Lambda', 
          x: 500, 
          y: 180, 
          z: 45,
          connections: [
            { to: 's3', label: 'Data Store', type: 'sync', throughput: '300MB/s' }
          ]
        },
        { 
          id: 'lambda-2', 
          service: 'Lambda', 
          x: 500, 
          y: 320, 
          z: 45,
          connections: [
            { to: 's3', label: 'Data Process', type: 'async', throughput: '200MB/s' }
          ]
        },
        
        // Right Column - Storage
        { 
          id: 's3', 
          service: 'S3', 
          x: 850, 
          y: 250, 
          z: 50,
          connections: [] 
        }
      ],
      title: 'Serverless Application Architecture',
      description: 'Event-driven serverless architecture with API Gateway, Lambda, and monitoring',
      flowDescription: 'API requests trigger Lambda functions with CloudWatch monitoring and S3 integration'
    }
  };

  // Generate enhanced bent line paths with multiple control points
  const generateBentPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Create smooth curved path with multiple bends
    const midX1 = start.x + dx * 0.3;
    const midY1 = start.y;
    const midX2 = start.x + dx * 0.7;
    const midY2 = end.y;
    
    // Use quadratic bezier curves for smooth bends
    return `M ${start.x} ${start.y} 
            Q ${midX1 + 20} ${midY1 - 20} ${midX1} ${midY1} 
            L ${midX2} ${midY2} 
            Q ${midX2 + 20} ${midY2 + 20} ${end.x} ${end.y}`;
  };

  // Calculate connection points on smaller rectangle edges
  const getConnectionPoint = (resource: { x: number; y: number }, targetResource: { x: number; y: number }) => {
    const sourceRect = { x: resource.x, y: resource.y, width: 100, height: 70 };
    const targetRect = { x: targetResource.x, y: targetResource.y, width: 100, height: 70 };
    
    const sourceCenterX = sourceRect.x + sourceRect.width / 2;
    const sourceCenterY = sourceRect.y + sourceRect.height / 2;
    const targetCenterX = targetRect.x + targetRect.width / 2;
    const targetCenterY = targetRect.y + targetRect.height / 2;
    
    const dx = targetCenterX - sourceCenterX;
    const dy = targetCenterY - sourceCenterY;
    
    let startPoint, endPoint;
    
    // Always connect horizontally for left-middle-right layout
    if (dx > 0) {
      startPoint = { x: sourceRect.x + 100, y: sourceRect.y + 35 };
      endPoint = { x: targetRect.x, y: targetRect.y + 35 };
    } else {
      startPoint = { x: sourceRect.x, y: sourceRect.y + 35 };
      endPoint = { x: targetRect.x + 100, y: targetRect.y + 35 };
    }
    
    return { startPoint, endPoint };
  };

  const currentApp = applications[selectedApp];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center py-3 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600">
          <h1 className="text-2xl font-bold text-white mb-1">
            3D AWS Cloud Architecture
          </h1>
          <p className="text-slate-300 text-sm">
            Interactive 3D system architecture with clear connectivity flow
          </p>
        </div>

        {/* Application Selector */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-500 p-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Architecture Selection</h2>
              <p className="text-sm text-slate-300 mb-1">{currentApp.description}</p>
              <p className="text-xs text-blue-400 font-medium">Flow: {currentApp.flowDescription}</p>
            </div>
            <div className="flex gap-3">
              {Object.keys(applications).map((app) => (
                <button
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                    selectedApp === app
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500'
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
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 flex-1 overflow-hidden m-2 rounded-lg"
          style={{ 
            minHeight: '80vh',
            perspective: '2500px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-4 py-2 border-b border-slate-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{currentApp.title}</h2>
              <div className="flex items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-2 bg-blue-500 rounded"></div>
                  <span>Synchronous</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-2 bg-green-500 rounded opacity-75"></div>
                  <span>Asynchronous</span>
                </div>
                <div className="text-xs text-slate-400">Left → Middle → Right Flow</div>
              </div>
            </div>
          </div>
          
          <div 
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 flex-1"
            style={{ 
              height: 'calc(100% - 60px)', 
              minHeight: '700px',
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Enhanced Grid Background with 3D effect */}
            <div 
              className="absolute inset-0" 
              style={{ 
                transform: 'translateZ(-50px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <svg width="100%" height="100%" className="w-full h-full opacity-20">
                <defs>
                  <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                    <circle cx="0" cy="0" r="1" fill="#64748b"/>
                  </pattern>
                  <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid3d)" />
                <rect width="100%" height="100%" fill="url(#gridGradient)" />
              </svg>
            </div>

            {/* Column Separators */}
            <div className="absolute inset-0" style={{ transform: 'translateZ(5px)' }}>
              {/* Left Column */}
              <div className="absolute left-[150px] top-[100px] bottom-[100px] w-0.5 bg-gradient-to-b from-blue-500/30 to-blue-500/10"></div>
              <div className="absolute left-[120px] top-[80px] text-blue-400 text-sm font-semibold bg-slate-800/80 px-3 py-1 rounded-lg">
                Entry Layer
              </div>
              
              {/* Middle Column */}
              <div className="absolute left-[450px] top-[100px] bottom-[100px] w-0.5 bg-gradient-to-b from-green-500/30 to-green-500/10"></div>
              <div className="absolute left-[420px] top-[80px] text-green-400 text-sm font-semibold bg-slate-800/80 px-3 py-1 rounded-lg">
                Processing Layer
              </div>
              <div className="absolute left-[600px] top-[100px] bottom-[100px] w-0.5 bg-gradient-to-b from-green-500/30 to-green-500/10"></div>
              
              {/* Right Column */}
              <div className="absolute left-[800px] top-[100px] bottom-[100px] w-0.5 bg-gradient-to-b from-purple-500/30 to-purple-500/10"></div>
              <div className="absolute left-[780px] top-[80px] text-purple-400 text-sm font-semibold bg-slate-800/80 px-3 py-1 rounded-lg">
                Data Layer
              </div>
            </div>

            {/* VPC Container with enhanced 3D styling */}
            {currentApp.resources.find((r: { type: string }) => r.type === 'container') && (
              <div
                className="absolute border-2 border-dashed border-green-400 rounded-lg"
                style={{
                  left: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').x}px`,
                  top: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').y}px`,
                  width: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').width}px`,
                  height: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').height}px`,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%)',
                  backdropFilter: 'blur(8px)',
                  transform: 'translateZ(10px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: `
                    0 20px 40px rgba(34, 197, 94, 0.1),
                    inset 0 1px 0 rgba(34, 197, 94, 0.2)
                  `
                }}
              >
                <div 
                  className="absolute -top-12 left-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xl"
                  style={{
                    transform: 'translateZ(20px)',
                    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <span>VPC (Virtual Private Cloud)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced SVG for Connections with bent lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ 
                transform: 'translateZ(25px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <defs>
                {/* Enhanced Arrow Markers */}
                <marker
                  id="sync-arrow"
                  markerWidth="16"
                  markerHeight="16"
                  refX="14"
                  refY="8"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path 
                    d="M2,2 L2,14 L14,8 z" 
                    fill="#3b82f6" 
                    stroke="#1d4ed8" 
                    strokeWidth="1"
                    filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4))"
                  />
                </marker>
                
                <marker
                  id="async-arrow"
                  markerWidth="16"
                  markerHeight="16"
                  refX="14"
                  refY="8"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path 
                    d="M2,2 L2,14 L14,8 z" 
                    fill="#10b981" 
                    stroke="#059669" 
                    strokeWidth="1"
                    filter="drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))"
                  />
                </marker>

                {/* Glow filters */}
                <filter id="connectionGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                {/* Flow animation patterns */}
                <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="20" height="4">
                  <rect width="20" height="4" fill="none"/>
                  <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.8)">
                    <animate attributeName="cx" values="2;18;2" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </pattern>
              </defs>

              {/* Enhanced Connection Rendering with bent lines */}
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
                  const pathData = generateBentPath(startPoint, endPoint);
                  const flowId = `${resource.id}-${connection.to}`;
                  
                  const isSync = connection.type === 'sync';
                  const strokeColor = isSync ? '#3b82f6' : '#10b981';
                  const strokeWidth = highlightedFlow === flowId ? 6 : 4;

                  return (
                    <g key={flowId}>
                      {/* Background glow line */}
                      <path
                        d={pathData}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 4}
                        fill="none"
                        opacity="0.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Main connection line with enhanced styling */}
                      <path
                        d={pathData}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={isSync ? 'none' : '15,8'}
                        markerEnd={isSync ? "url(#sync-arrow)" : "url(#async-arrow)"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHighlightedFlow(flowId)}
                        onMouseLeave={() => setHighlightedFlow(null)}
                        opacity={highlightedFlow === flowId ? 1 : 0.85}
                        filter={highlightedFlow === flowId ? "url(#connectionGlow)" : "none"}
                        style={{ pointerEvents: 'stroke' }}
                      />

                      {/* Flow animation overlay */}
                      {highlightedFlow === flowId && (
                        <path
                          d={pathData}
                          stroke="url(#flowPattern)"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Enhanced Connection Label with better positioning */}
                      <g transform={`translate(${(startPoint.x + endPoint.x) / 2}, ${(startPoint.y + endPoint.y) / 2 - 20})`}>
                        <rect
                          x="-50"
                          y="-25"
                          width="100"
                          height="50"
                          rx="10"
                          fill="rgba(15, 23, 42, 0.95)"
                          stroke={strokeColor}
                          strokeWidth="2"
                          filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))"
                        />
                        <text
                          x="0"
                          y="-8"
                          textAnchor="middle"
                          className="text-xs font-bold fill-white"
                        >
                          {connection.label}
                        </text>
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          className="text-xs fill-slate-300"
                        >
                          {connection.throughput}
                        </text>
                        <text
                          x="0"
                          y="16"
                          textAnchor="middle"
                          className="text-xs font-bold"
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

            {/* Smaller AWS Resources with proper 3D layering */}
            <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              {currentApp.resources
                .filter((r: { type: string }) => r.type !== 'container')
                .sort((a, b) => (a.z || 0) - (b.z || 0))
                .map((resource: { service: string; id: string; x: number; y: number; z?: number; connections: any[] }) => {
                  const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                  const zDepth = resource.z || serviceConfig.depth;
                  
                return (
                  <div
                    key={resource.id}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${resource.x}px`,
                      top: `${resource.y}px`,
                      width: '100px',
                      height: '70px',
                      transform: `translateZ(${zDepth}px)`,
                      transformStyle: 'preserve-3d',
                      zIndex: Math.floor(zDepth)
                    }}
                  >
                    {/* Smaller Service Container with enhanced 3D effects */}
                    <div
                      className="w-full h-full rounded-lg shadow-2xl border-2 transition-all duration-300 group-hover:shadow-3xl group-hover:scale-110 flex flex-col justify-center items-center p-2 relative overflow-hidden"
                      style={{
                        background: serviceConfig.bgColor,
                        borderColor: serviceConfig.borderColor,
                        borderLeftWidth: '4px',
                        borderLeftColor: serviceConfig.color,
                        boxShadow: `
                          0 ${zDepth/3}px ${zDepth/2}px ${serviceConfig.shadowColor},
                          0 6px 12px rgba(0, 0, 0, 0.15),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                        transform: `
                          perspective(1000px) 
                          rotateX(${rotationX * 0.1}deg) 
                          rotateY(${rotationY * 0.1}deg)
                        `
                      }}
                    >
                      {/* Depth indicator */}
                      <div 
                        className="absolute top-0.5 right-0.5 text-xs font-bold px-1 py-0.5 rounded text-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${serviceConfig.color} 0%, ${serviceConfig.color}AA 100%)`,
                          fontSize: '8px'
                        }}
                      >
                        {zDepth}
                      </div>

                      {/* Service Icon */}
                      <div 
                        className="text-xl mb-1 transition-transform duration-300 group-hover:scale-125"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
                          transform: `translateZ(${zDepth/4}px)`
                        }}
                      >
                        {serviceConfig.icon}
                      </div>
                      
                      {/* Service Name */}
                      <div className="text-xs font-bold text-center text-gray-800 leading-tight mb-1">
                        {serviceConfig.label}
                      </div>
                      
                      {/* Service Category */}
                      <div 
                        className="text-xs px-2 py-0.5 rounded text-white font-semibold shadow-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${serviceConfig.color} 0%, ${serviceConfig.color}CC 100%)`,
                          fontSize: '9px'
                        }}
                      >
                        {serviceConfig.category}
                      </div>

                      {/* Connection Count Badge */}
                      {resource.connections.length > 0 && (
                        <div 
                          className="absolute -right-1 -top-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold shadow-lg"
                          style={{
                            transform: `translateZ(${zDepth/2}px)`,
                            fontSize: '8px'
                          }}
                        >
                          {resource.connections.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Hover Details */}
                    <div 
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl border border-slate-600"
                      style={{
                        transform: `translateX(-50%) translateZ(${zDepth + 20}px)`,
                        zIndex: 1000
                      }}
                    >
                      <div className="font-semibold text-white">{serviceConfig.label}</div>
                      <div className="text-slate-300 text-xs">{serviceConfig.category}</div>
                      <div className="text-blue-400 text-xs">Depth: {zDepth}px</div>
                      <div className="text-slate-400 text-xs">Links: {resource.connections.length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Architecture Summary */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 rounded-lg p-3 shadow-xl m-2">
          <h3 className="text-lg font-semibold text-white mb-2">Architecture Components</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Left Column Components */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 rounded-lg p-3 border border-blue-500/30">
              <h4 className="text-blue-400 font-semibold mb-2 text-sm">Entry Layer</h4>
              <div className="space-y-2">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x < 350)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        <span className="text-sm">{serviceConfig.icon}</span>
                        <span className="text-white font-medium">{serviceConfig.label}</span>
                        <span className="text-blue-400">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Middle Column Components */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 rounded-lg p-3 border border-green-500/30">
              <h4 className="text-green-400 font-semibold mb-2 text-sm">Processing Layer</h4>
              <div className="space-y-2">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x >= 350 && r.x < 750)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        <span className="text-sm">{serviceConfig.icon}</span>
                        <span className="text-white font-medium">{serviceConfig.label}</span>
                        <span className="text-green-400">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column Components */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 rounded-lg p-3 border border-purple-500/30">
              <h4 className="text-purple-400 font-semibold mb-2 text-sm">Data Layer</h4>
              <div className="space-y-2">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x >= 750)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        <span className="text-sm">{serviceConfig.icon}</span>
                        <span className="text-white font-medium">{serviceConfig.label}</span>
                        <span className="text-purple-400">({resource.connections.length})</span>
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