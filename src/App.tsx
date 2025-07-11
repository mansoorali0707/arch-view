import React, { useState, useEffect, useRef } from 'react';

const AWSResourceMapper = () => {
  const [selectedApp, setSelectedApp] = useState('App A');
  const [animationTime, setAnimationTime] = useState(0);
  const [highlightedFlow, setHighlightedFlow] = useState<string | null>(null);
  const [rotationX, setRotationX] = useState(-2);
  const [rotationY, setRotationY] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation loop for flow particles
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.05);
    }, 50);
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
        
        setRotationX(-2 + mouseY * 3);
        setRotationY(1 + mouseX * 3);
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
          x: 80, 
          y: 100, 
          z: 5,
          width: 1340, 
          height: 400, 
          type: 'container' 
        },
        // Left Column - Entry Points
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
          y: 320, 
          z: 35,
          connections: [
            { to: 'ec2-1', label: 'Metrics', type: 'async', throughput: '1K/min' },
            { to: 'ec2-2', label: 'Metrics', type: 'async', throughput: '1K/min' }
          ] 
        },
        
        // Middle Column - Processing Layer
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
          y: 340, 
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
          x: 1150, 
          y: 180, 
          z: 50,
          connections: [] 
        },
        { 
          id: 's3', 
          service: 'S3', 
          x: 1150, 
          y: 320, 
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
          x: 80, 
          y: 100, 
          z: 5,
          width: 1340, 
          height: 400, 
          type: 'container' 
        },
        // Left Column - API Layer
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
          y: 340, 
          z: 35,
          connections: [
            { to: 'lambda-1', label: 'Logs', type: 'async', throughput: '2K/min' },
            { to: 'lambda-2', label: 'Logs', type: 'async', throughput: '2K/min' }
          ] 
        },
        
        // Middle Column - Serverless Processing
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
          y: 360, 
          z: 40,
          connections: [
            { to: 's3', label: 'Data Process', type: 'async', throughput: '200MB/s' }
          ]
        },
        
        // Right Column - Storage
        { 
          id: 's3', 
          service: 'S3', 
          x: 1150, 
          y: 270, 
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
    const blockWidth = 120;
    const blockHeight = 80;
    
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
        <div className="text-center py-3 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600">
          <h1 className="text-2xl font-bold text-white mb-1">
            AWS Cloud Architecture Visualizer
          </h1>
          <p className="text-slate-300 text-sm">
            Interactive 3D system architecture with animated data flow
          </p>
        </div>

        {/* Application Selector */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-500 p-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">{currentApp.title}</h2>
              <p className="text-sm text-slate-300 mb-1">{currentApp.description}</p>
              <p className="text-sm text-blue-400 font-medium">Flow: {currentApp.flowDescription}</p>
            </div>
            <div className="flex gap-3">
              {Object.keys(applications).map((app) => (
                <button
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
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
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 flex-1 overflow-hidden m-2 rounded-xl"
          style={{ 
            minHeight: '70vh',
            perspective: '1800px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-4 py-2 border-b border-slate-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{currentApp.title}</h2>
              <div className="flex items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                  <span>Synchronous</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-2 bg-green-500 rounded-full opacity-75"></div>
                  <span>Asynchronous</span>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 flex-1"
            style={{ 
              height: 'calc(100% - 50px)', 
              minHeight: '600px',
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0" 
              style={{ 
                transform: 'translateZ(-20px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <svg width="100%" height="100%" className="w-full h-full opacity-10">
                <defs>
                  <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid3d)" />
              </svg>
            </div>

            {/* Column Separators */}
            <div className="absolute inset-0" style={{ transform: 'translateZ(8px)' }}>
              <div className="absolute left-[320px] top-[80px] bottom-[80px] w-0.5 bg-gradient-to-b from-blue-500/30 to-blue-500/10"></div>
              <div className="absolute left-[280px] top-[60px] text-blue-400 text-sm font-bold bg-slate-800/90 px-3 py-1 rounded-lg border border-blue-500/30">
                Entry Layer
              </div>
              
              <div className="absolute left-[820px] top-[80px] bottom-[80px] w-0.5 bg-gradient-to-b from-green-500/30 to-green-500/10"></div>
              <div className="absolute left-[760px] top-[60px] text-green-400 text-sm font-bold bg-slate-800/90 px-3 py-1 rounded-lg border border-green-500/30">
                Processing Layer
              </div>
              
              <div className="absolute left-[1320px] top-[80px] bottom-[80px] w-0.5 bg-gradient-to-b from-purple-500/30 to-purple-500/10"></div>
              <div className="absolute left-[1260px] top-[60px] text-purple-400 text-sm font-bold bg-slate-800/90 px-3 py-1 rounded-lg border border-purple-500/30">
                Data Layer
              </div>
            </div>

            {/* VPC Container */}
            {currentApp.resources.find((r: { type: string }) => r.type === 'container') && (
              <div
                className="absolute border-2 border-dashed border-green-400 rounded-xl"
                style={{
                  left: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').x}px`,
                  top: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').y}px`,
                  width: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').width}px`,
                  height: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').height}px`,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)',
                  backdropFilter: 'blur(5px)',
                  transform: 'translateZ(5px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div 
                  className="absolute -top-10 left-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-xl border border-green-500"
                  style={{
                    transform: 'translateZ(15px)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <span>VPC</span>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Lines with Animations */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ 
                transform: 'translateZ(15px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <defs>
                {/* Smaller Arrow Markers */}
                <marker
                  id="sync-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path 
                    d="M1,1 L1,7 L7,4 z" 
                    fill="#3b82f6" 
                    stroke="#1d4ed8" 
                    strokeWidth="0.5"
                  />
                </marker>
                
                <marker
                  id="async-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path 
                    d="M1,1 L1,7 L7,4 z" 
                    fill="#10b981" 
                    stroke="#059669" 
                    strokeWidth="0.5"
                  />
                </marker>

                {/* Flow animation patterns */}
                <pattern id="flowPatternSync" patternUnits="userSpaceOnUse" width="20" height="4">
                  <rect width="20" height="4" fill="none"/>
                  <circle cx="2" cy="2" r="1.5" fill="rgba(59, 130, 246, 0.9)">
                    <animate attributeName="cx" values="2;18;2" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </pattern>

                <pattern id="flowPatternAsync" patternUnits="userSpaceOnUse" width="20" height="4">
                  <rect width="20" height="4" fill="none"/>
                  <circle cx="2" cy="2" r="1.5" fill="rgba(16, 185, 129, 0.9)">
                    <animate attributeName="cx" values="2;18;2" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                </pattern>
              </defs>

              {/* Connection Lines */}
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
                  const strokeWidth = highlightedFlow === flowId ? 4 : 3;

                  return (
                    <g key={flowId}>
                      {/* Background glow line */}
                      <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth + 3}
                        opacity="0.2"
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
                        strokeDasharray={isSync ? 'none' : '10,5'}
                        markerEnd={isSync ? "url(#sync-arrow)" : "url(#async-arrow)"}
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHighlightedFlow(flowId)}
                        onMouseLeave={() => setHighlightedFlow(null)}
                        opacity={highlightedFlow === flowId ? 1 : 0.8}
                        style={{ pointerEvents: 'stroke' }}
                      />

                      {/* Animated flow overlay */}
                      <line
                        x1={startPoint.x}
                        y1={startPoint.y}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke={isSync ? "url(#flowPatternSync)" : "url(#flowPatternAsync)"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity={highlightedFlow === flowId ? 1 : 0.6}
                      />

                      {/* Connection Info Label */}
                      {highlightedFlow === flowId && (
                        <g transform={`translate(${(startPoint.x + endPoint.x) / 2}, ${(startPoint.y + endPoint.y) / 2 - 20})`}>
                          <rect
                            x="-40"
                            y="-15"
                            width="80"
                            height="30"
                            rx="8"
                            fill="rgba(15, 23, 42, 0.95)"
                            stroke={strokeColor}
                            strokeWidth="1"
                            filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
                          />
                          <text
                            x="0"
                            y="-5"
                            textAnchor="middle"
                            className="text-xs font-bold fill-white"
                          >
                            {connection.label}
                          </text>
                          <text
                            x="0"
                            y="8"
                            textAnchor="middle"
                            className="text-xs fill-slate-300"
                          >
                            {connection.throughput}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })
              )}
            </svg>

            {/* AWS Resource Blocks */}
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
                      width: '120px',
                      height: '80px',
                      transform: `translateZ(${zDepth}px)`,
                      transformStyle: 'preserve-3d',
                      zIndex: Math.floor(zDepth)
                    }}
                  >
                    {/* Service Block */}
                    <div
                      className="w-full h-full rounded-lg shadow-xl border-2 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 flex flex-col justify-center items-center p-2 relative overflow-hidden"
                      style={{
                        background: serviceConfig.bgColor,
                        borderColor: serviceConfig.borderColor,
                        borderLeftWidth: '4px',
                        borderLeftColor: serviceConfig.color,
                        boxShadow: `
                          0 ${zDepth/3}px ${zDepth/2}px ${serviceConfig.shadowColor},
                          0 4px 8px rgba(0, 0, 0, 0.15)
                        `
                      }}
                    >
                      {/* Service Icon */}
                      <div 
                        className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
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
                        className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                        style={{ 
                          background: `linear-gradient(135deg, ${serviceConfig.color} 0%, ${serviceConfig.color}DD 100%)`,
                          fontSize: '9px'
                        }}
                      >
                        {serviceConfig.category}
                      </div>

                      {/* Connection Count Badge */}
                      {resource.connections.length > 0 && (
                        <div 
                          className="absolute -right-1 -top-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg border border-white"
                          style={{
                            fontSize: '9px'
                          }}
                        >
                          {resource.connections.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div 
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-slate-600"
                      style={{
                        transform: `translateX(-50%) translateZ(${zDepth + 20}px)`,
                        zIndex: 1000
                      }}
                    >
                      <div className="font-bold text-white">{serviceConfig.label}</div>
                      <div className="text-slate-300">{serviceConfig.category}</div>
                      <div className="text-blue-400">Connections: {resource.connections.length}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Architecture Summary */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 rounded-lg p-3 shadow-xl m-2">
          <h3 className="text-lg font-bold text-white mb-2">Architecture Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Left Column Components */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 rounded-lg p-3 border border-blue-500/30">
              <h4 className="text-blue-400 font-bold mb-2 text-sm">Entry Layer</h4>
              <div className="space-y-2">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x < 500)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        <span className="text-sm">{serviceConfig.icon}</span>
                        <span className="text-white font-semibold">{serviceConfig.label}</span>
                        <span className="text-blue-400 font-bold">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Middle Column Components */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 rounded-lg p-3 border border-green-500/30">
              <h4 className="text-green-400 font-bold mb-2 text-sm">Processing Layer</h4>
              <div className="space-y-2">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x >= 500 && r.x < 1000)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        <span className="text-sm">{serviceConfig.icon}</span>
                        <span className="text-white font-semibold">{serviceConfig.label}</span>
                        <span className="text-green-400 font-bold">({resource.connections.length})</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column Components */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 rounded-lg p-3 border border-purple-500/30">
              <h4 className="text-purple-400 font-bold mb-2 text-sm">Data Layer</h4>
              <div className="space-y-2">
                {currentApp.resources
                  .filter((r: { type: string; x: number }) => r.type !== 'container' && r.x >= 1000)
                  .map((resource: { service: string; id: string; connections: any[] }) => {
                    const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                    return (
                      <div key={resource.id} className="flex items-center gap-2 text-xs">
                        <span className="text-sm">{serviceConfig.icon}</span>
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