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
        
        setRotationX(-5 + mouseY * 3);
        setRotationY(2 + mouseX * 3);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // AWS service configurations with 3D styling
  const serviceIcons = {
    EC2: {
      color: '#FF9900',
      bgColor: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)',
      borderColor: '#FF9900',
      shadowColor: 'rgba(255, 153, 0, 0.3)',
      icon: '🖥️',
      label: 'Amazon EC2',
      category: 'Compute',
      depth: 20
    },
    S3: {
      color: '#3F90CF',
      bgColor: 'linear-gradient(135deg, #F0F8FF 0%, #B0E0E6 100%)',
      borderColor: '#3F90CF',
      shadowColor: 'rgba(63, 144, 207, 0.3)',
      icon: '📦',
      label: 'Amazon S3',
      category: 'Storage',
      depth: 25
    },
    RDS: {
      color: '#527FFF',
      bgColor: 'linear-gradient(135deg, #F5F7FF 0%, #C7D2FE 100%)',
      borderColor: '#527FFF',
      shadowColor: 'rgba(82, 127, 255, 0.3)',
      icon: '🗄️',
      label: 'Amazon RDS',
      category: 'Database',
      depth: 30
    },
    Lambda: {
      color: '#FF9900',
      bgColor: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4B5 100%)',
      borderColor: '#FF9900',
      shadowColor: 'rgba(255, 153, 0, 0.3)',
      icon: 'λ',
      label: 'AWS Lambda',
      category: 'Compute',
      depth: 22
    },
    CloudWatch: {
      color: '#3F90CF',
      bgColor: 'linear-gradient(135deg, #F0F8FF 0%, #B0E0E6 100%)',
      borderColor: '#3F90CF',
      shadowColor: 'rgba(63, 144, 207, 0.3)',
      icon: '📊',
      label: 'CloudWatch',
      category: 'Monitoring',
      depth: 18
    },
    APIGateway: {
      color: '#FF4B4B',
      bgColor: 'linear-gradient(135deg, #FFF5F5 0%, #FEB2B2 100%)',
      borderColor: '#FF4B4B',
      shadowColor: 'rgba(255, 75, 75, 0.3)',
      icon: '🌐',
      label: 'API Gateway',
      category: 'Networking',
      depth: 15
    },
    ELB: {
      color: '#8C4FFF',
      bgColor: 'linear-gradient(135deg, #F8F5FF 0%, #D8B4FE 100%)',
      borderColor: '#8C4FFF',
      shadowColor: 'rgba(140, 79, 255, 0.3)',
      icon: '⚖️',
      label: 'Load Balancer',
      category: 'Networking',
      depth: 15
    },
    VPC: {
      color: '#4CAF50',
      bgColor: 'linear-gradient(135deg, #F8FFF8 0%, #A7F3D0 100%)',
      borderColor: '#4CAF50',
      shadowColor: 'rgba(76, 175, 80, 0.2)',
      icon: '🏢',
      label: 'VPC',
      category: 'Network',
      depth: 5
    }
  };

  // Application configurations with proper positioning
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
          y: 100, 
          z: 0,
          width: 1300, 
          height: 500, 
          type: 'container' 
        },
        { 
          id: 'elb', 
          service: 'ELB', 
          x: 100, 
          y: 250, 
          z: 15,
          connections: [{ to: 'ec2', label: 'HTTP/HTTPS', type: 'sync', throughput: '10K req/s' }] 
        },
        { 
          id: 'ec2', 
          service: 'EC2', 
          x: 400, 
          y: 250, 
          z: 20,
          connections: [
            { to: 'rds', label: 'SQL Query', type: 'sync', throughput: '5K qps' },
            { to: 's3', label: 'File Upload', type: 'async', throughput: '1GB/s' }
          ]
        },
        { 
          id: 'rds', 
          service: 'RDS', 
          x: 700, 
          y: 180, 
          z: 30,
          connections: [] 
        },
        { 
          id: 's3', 
          service: 'S3', 
          x: 700, 
          y: 320, 
          z: 25,
          connections: [] 
        },
        { 
          id: 'cloudwatch', 
          service: 'CloudWatch', 
          x: 1000, 
          y: 250, 
          z: 18,
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
          y: 100, 
          z: 0,
          width: 1300, 
          height: 500, 
          type: 'container' 
        },
        { 
          id: 'api', 
          service: 'APIGateway', 
          x: 100, 
          y: 250, 
          z: 15,
          connections: [{ to: 'lambda', label: 'REST API', type: 'sync', throughput: '50K req/s' }] 
        },
        { 
          id: 'lambda', 
          service: 'Lambda', 
          x: 400, 
          y: 250, 
          z: 22,
          connections: [
            { to: 'cloudwatch', label: 'Metrics', type: 'async', throughput: '1K events/s' },
            { to: 's3', label: 'Data Store', type: 'sync', throughput: '500MB/s' }
          ]
        },
        { 
          id: 'cloudwatch', 
          service: 'CloudWatch', 
          x: 700, 
          y: 180, 
          z: 18,
          connections: [] 
        },
        { 
          id: 's3', 
          service: 'S3', 
          x: 700, 
          y: 320, 
          z: 25,
          connections: [] 
        }
      ],
      title: 'Serverless Application Architecture',
      description: 'Event-driven serverless architecture with API Gateway, Lambda, and monitoring',
      flowDescription: 'API requests trigger Lambda functions with CloudWatch monitoring and S3 integration'
    }
  };

  // Generate straight line paths with bends
  const generateStraightPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Create L-shaped path with one bend
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal first, then vertical
      const bendX = start.x + dx * 0.7;
      return `M ${start.x} ${start.y} L ${bendX} ${start.y} L ${bendX} ${end.y} L ${end.x} ${end.y}`;
    } else {
      // Vertical first, then horizontal
      const bendY = start.y + dy * 0.7;
      return `M ${start.x} ${start.y} L ${start.x} ${bendY} L ${end.x} ${bendY} L ${end.x} ${end.y}`;
    }
  };

  // Calculate connection points on rectangle edges
  const getConnectionPoint = (resource: { x: number; y: number }, targetResource: { x: number; y: number }) => {
    const sourceRect = { x: resource.x, y: resource.y, width: 160, height: 100 };
    const targetRect = { x: targetResource.x, y: targetResource.y, width: 160, height: 100 };
    
    const sourceCenterX = sourceRect.x + sourceRect.width / 2;
    const sourceCenterY = sourceRect.y + sourceRect.height / 2;
    const targetCenterX = targetRect.x + targetRect.width / 2;
    const targetCenterY = targetRect.y + targetRect.height / 2;
    
    const dx = targetCenterX - sourceCenterX;
    const dy = targetCenterY - sourceCenterY;
    
    let startPoint, endPoint;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        startPoint = { x: sourceRect.x + 160, y: sourceRect.y + 50 };
        endPoint = { x: targetRect.x, y: targetRect.y + 50 };
      } else {
        startPoint = { x: sourceRect.x, y: sourceRect.y + 50 };
        endPoint = { x: targetRect.x + 160, y: targetRect.y + 50 };
      }
    } else {
      if (dy > 0) {
        startPoint = { x: sourceRect.x + 80, y: sourceRect.y + 100 };
        endPoint = { x: targetRect.x + 80, y: targetRect.y };
      } else {
        startPoint = { x: sourceRect.x + 80, y: sourceRect.y };
        endPoint = { x: targetRect.x + 80, y: targetRect.y + 100 };
      }
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
            Interactive 3D system architecture with straight-line flow visualization
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
            perspective: '1500px',
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
            {/* Grid Background */}
            <div className="absolute inset-0" style={{ transform: 'translateZ(-30px)' }}>
              <svg width="100%" height="100%" className="w-full h-full opacity-20">
                <defs>
                  <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid3d)" />
              </svg>
            </div>

            {/* VPC Container */}
            {currentApp.resources.find((r: { type: string }) => r.type === 'container') && (
              <div
                className="absolute border-2 border-dashed border-green-400 rounded-lg"
                style={{
                  left: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').x}px`,
                  top: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').y}px`,
                  width: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').width}px`,
                  height: `${currentApp.resources.find((r: { type: string }) => r.type === 'container').height}px`,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                  backdropFilter: 'blur(5px)',
                  transform: 'translateZ(5px)',
                  zIndex: 1
                }}
              >
                <div className="absolute -top-8 left-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span>🏢</span>
                    <span>VPC (Virtual Private Cloud)</span>
                  </div>
                </div>
              </div>
            )}

            {/* SVG for Connections */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              style={{ 
                zIndex: 2,
                transform: 'translateZ(10px)'
              }}
            >
              <defs>
                {/* Arrow Markers */}
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
                  />
                </marker>
              </defs>

              {/* Connection Rendering */}
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
                  const pathData = generateStraightPath(startPoint, endPoint);
                  const flowId = `${resource.id}-${connection.to}`;
                  
                  const isSync = connection.type === 'sync';
                  const strokeColor = isSync ? '#3b82f6' : '#10b981';
                  const strokeWidth = highlightedFlow === flowId ? 4 : 3;

                  return (
                    <g key={flowId}>
                      {/* Connection Line */}
                      <path
                        d={pathData}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={isSync ? 'none' : '10,5'}
                        markerEnd={isSync ? "url(#sync-arrow)" : "url(#async-arrow)"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHighlightedFlow(flowId)}
                        onMouseLeave={() => setHighlightedFlow(null)}
                        opacity={highlightedFlow === flowId ? 1 : 0.8}
                      />

                      {/* Connection Label */}
                      <g transform={`translate(${(startPoint.x + endPoint.x) / 2}, ${(startPoint.y + endPoint.y) / 2})`}>
                        <rect
                          x="-50"
                          y="-25"
                          width="100"
                          height="50"
                          rx="8"
                          fill="rgba(15, 23, 42, 0.9)"
                          stroke={strokeColor}
                          strokeWidth="1"
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
                          y="6"
                          textAnchor="middle"
                          className="text-xs fill-slate-300"
                        >
                          {connection.throughput}
                        </text>
                        <text
                          x="0"
                          y="18"
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

            {/* AWS Resources */}
            <div className="relative" style={{ zIndex: 3 }}>
              {currentApp.resources
                .filter((r: { type: string }) => r.type !== 'container')
                .map((resource: { service: string; id: string; x: number; y: number; z?: number; connections: any[] }) => {
                  const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
                  const zDepth = resource.z || 0;
                return (
                  <div
                    key={resource.id}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${resource.x}px`,
                      top: `${resource.y}px`,
                      width: '160px',
                      height: '100px',
                      transform: `translateZ(${zDepth}px)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Service Container */}
                    <div
                      className="w-full h-full rounded-lg shadow-xl border-2 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 flex flex-col justify-center items-center p-3 relative"
                      style={{
                        background: serviceConfig.bgColor,
                        borderColor: serviceConfig.borderColor,
                        borderLeftWidth: '4px',
                        borderLeftColor: serviceConfig.color,
                        boxShadow: `
                          0 10px 25px ${serviceConfig.shadowColor},
                          0 4px 10px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `
                      }}
                    >
                      {/* Service Icon */}
                      <div className="text-2xl mb-1">{serviceConfig.icon}</div>
                      
                      {/* Service Name */}
                      <div className="text-xs font-bold text-center text-gray-800 leading-tight mb-1">
                        {serviceConfig.label}
                      </div>
                      
                      {/* Service Category */}
                      <div 
                        className="text-xs px-2 py-1 rounded-full text-white font-semibold"
                        style={{ 
                          background: `linear-gradient(135deg, ${serviceConfig.color} 0%, ${serviceConfig.color}CC 100%)`
                        }}
                      >
                        {serviceConfig.category}
                      </div>

                      {/* Connection Count */}
                      {resource.connections.length > 0 && (
                        <div 
                          className="absolute -right-1 -top-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                        >
                          {resource.connections.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Details */}
                    <div 
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20"
                    >
                      <div className="font-semibold">{serviceConfig.label}</div>
                      <div className="text-slate-300 text-xs">{serviceConfig.category} Service</div>
                      <div className="text-slate-400 text-xs">Depth: {zDepth}px</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Architecture Summary */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500 rounded-lg p-3 shadow-xl m-2">
          <h3 className="text-lg font-semibold text-white mb-2">Architecture Components</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {currentApp.resources
              .filter((r: { type: string }) => r.type !== 'container')
              .map((resource: { service: string; id: string; z?: number; connections: any[] }) => {
                const serviceConfig = serviceIcons[resource.service as keyof typeof serviceIcons];
              return (
                <div 
                  key={resource.id} 
                  className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg p-3 border border-slate-500 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-lg">{serviceConfig.icon}</div>
                    <div>
                      <div className="font-medium text-sm text-white leading-tight">{serviceConfig.label}</div>
                      <div className="text-xs text-slate-300">{serviceConfig.category}</div>
                      <div className="text-xs text-slate-400">Z: {resource.z || 0}px</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span>Connections:</span>
                    {resource.connections.length > 0 ? (
                      <div className="flex gap-1">
                        {resource.connections.map((conn: { type: string }, idx: React.Key | null | undefined) => (
                          <span 
                            key={idx} 
                            className={`w-2 h-2 rounded-full ${conn.type === 'sync' ? 'bg-blue-500' : 'bg-green-500'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSResourceMapper;