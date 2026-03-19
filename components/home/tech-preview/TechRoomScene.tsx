// /Users/macbookair/Documents/IllusionTech-Development/components/home/tech-preview/TechRoomScene.tsx

'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize, X, ArrowLeft, ArrowRight, Cpu, Users, Monitor, RotateCw, Play, Pause } from 'lucide-react';
import BlankRoom from './BlankRoom';
import CameraController, { ViewState, RotationSpeed } from './CameraController';

const hotspotData = {
  lounge: {
    title: "Team & Culture",
    icon: <Users size={24} className="text-[#bd00ff]" />,
    description: "A remote-first collective of creative technologists. We prioritize deep work, creative freedom, and asynchronous collaboration to build the future of the web.",
    tags: ["Remote First", "Creative", "Async"]
  },
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught error:", error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function TechRoomScene() {
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<ViewState>('overview'); // Default to overview
  const [isEntered, setIsEntered] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState<RotationSpeed>('Dynamic');
  const [updateKey, setUpdateKey] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<'lounge' | null>(null);

 const viewControls: { label: string, view: ViewState, icon: React.ReactNode }[] = [
    { label: 'Overview', view: 'overview', icon: <Maximize size={16} /> },
    { label: 'Close Up', view: 'closeup', icon: <Cpu size={16} /> },
    { label: 'Right', view: 'left', icon: <ArrowRight size={16} /> },
    { label: 'Left', view: 'right', icon: <ArrowLeft size={16} /> },
  ];

 const mobileViewControls: { label: string, view: ViewState, icon: React.ReactNode }[] = [
    { label: 'Overview', view: 'overview', icon: <Maximize size={16} /> },
    { label: 'Close Up', view: 'closeup', icon: <Cpu size={16} /> },
    { label: 'Desk', view: 'monitor', icon: <Monitor size={16} /> },
  ];

 const rotationControls: { label: string, speed: RotationSpeed, icon: React.ReactNode }[] = [
    { label: 'Static', speed: 'Static', icon: <Pause size={16} /> },
    { label: 'Subtle', speed: 'Subtle', icon: <RotateCw size={16} className="motion-safe:animate-spin" style={{ animationDuration: '6s', animationPlayState: 'running' }} /> },
    { label: 'Standard', speed: 'Standard', icon: <RotateCw size={16} className="motion-safe:animate-spin" style={{ animationDuration: '3s', animationPlayState: 'running' }} /> },
    { label: 'Dynamic', speed: 'Dynamic', icon: <RotateCw size={16} className="motion-safe:animate-spin"  style={{ animationDuration: '1s', animationPlayState: 'running' }} /> },
  ];

  const handleHotspotClick = (type: 'lounge' | null) => {
    if (type === null) {
        setActiveHotspot(null);
        return;
    }
    if (!isEntered) return;
    setActiveHotspot(type);
    setView(type);
  };

  const clearHotspot = () => {
    setActiveHotspot(null);
    setView('overview');
  };

  const handleEnter = () => {
    if (isEntered) return;

    // For iOS 13+, we must request permission to access device orientation events.
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          // The listener in CameraController will be added automatically if permission is granted.
        })
        .catch(console.error)
        .finally(() => {
          setIsEntered(true);
        });
    } else {
      setIsEntered(true);
    }
  };

  useEffect(() => {
    // Prevent scrolling when in fullscreen 3D mode
    document.body.style.overflow = isEntered ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isEntered]);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setView('overview'); // Always start in overview.
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // This forces a re-render on the canvas-based HTML textures every second
    const interval = setInterval(() => setUpdateKey(k => k + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={
        isEntered 
          ? "fixed inset-0 z-50 bg-gray-900" 
          : "relative w-full h-[320px] md:h-[600px] bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-inner my-8 cursor-pointer"
      }
      onClick={handleEnter}
    >
      <div className="absolute inset-0" style={{ pointerEvents: isEntered ? 'auto' : 'none' }}>
        <Canvas 
          key={isEntered ? 'entered' : 'initial'} 
          shadows 
          camera={{ fov: 45 }}
          dpr={isMobile ? [1, 2] : [1, 2]} // Restored sharpness
          gl={{ preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={['#020205']} />
            <fog attach="fog" args={['#020205', 15, 40]} />
            
            {/* Lighting */}
            <ambientLight color="#bd00ff" intensity={isMobile ? 0.6 : 0.4} />
            <spotLight 
              position={[10, 15, 10]} 
              angle={0.4} 
              penumbra={1} 
              intensity={3} 
              castShadow 
              shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
              color="#aaddff"
            />
            <pointLight position={[10, 5, -10]} intensity={4} color="#bd00ff" distance={25} />
            <pointLight position={[-10, 5, -10]} intensity={4} color="#00f0ff" distance={25} />
            <spotLight
              position={[9, 8, 5]}
              angle={0.3}
              penumbra={0.8}
              intensity={1.5}
              castShadow
              shadow-mapSize={isMobile ? [256, 256] : [1024, 1024]}
              color="#ffffff"
              distance={20}
            />
             <spotLight
              position={[-9, 8, 5]}
              angle={0.3}
              penumbra={0.8}
              intensity={1.5}
              castShadow
              shadow-mapSize={isMobile ? [256, 256] : [1024, 1024]}
              color="#ffffff"
              distance={20}
            />
            
            {/* Environment */}
            <BlankRoom 
              onHotspotSelect={handleHotspotClick} 
              activeHotspot={activeHotspot}
              updateKey={updateKey}
            />
            <ErrorBoundary fallback={null}>
              <Environment preset="city" />
            </ErrorBoundary>

            {/* Controls */}
            <CameraController view={view} rotationSpeed={rotationSpeed} />
          </Suspense>
        </Canvas>
      </div>

      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 text-sm sm:gap-3 sm:px-6 sm:py-3 sm:text-base rounded-full bg-white/20 border border-white/30 text-white font-semibold transition-transform hover:scale-105">
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
              Enter 3D Experience
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEntered && (
        <>
          {/* Exit Button */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              setIsEntered(false); 
              setActiveHotspot(null);
            }}
            className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Exit 3D Experience"
          >
            <X size={24} />
          </button>

          {/* View Controls */}
          {!activeHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute bottom-4 sm:bottom-6 left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 flex items-center gap-1 sm:gap-4 bg-black/50 backdrop-blur-lg p-1.5 sm:p-3 rounded-full border border-white/10 shadow-2xl z-10 max-w-[calc(100vw-2rem)] sm:max-w-[95vw] overflow-x-auto"
            >
              {/* View Controls */}
              <div className="flex items-center gap-1 relative">
                {(isMobile ? mobileViewControls : viewControls).map((control) => (
                  <div key={control.view} className="relative">
                    {view === control.view && (
                      <motion.div
                        layoutId="view-pill"
                        className="absolute inset-0 bg-white/10 rounded-full"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(control.view);
                      }}
                      className="relative p-1.5 sm:p-2 rounded-full text-xs font-medium text-white transition-colors duration-300 hover:bg-white/5 flex items-center gap-1.5"
                      aria-label={`Set view to ${control.label}`}
                    >
                      <motion.span layoutId='view-icon'>
                        {control.icon}
                      </motion.span>
                      <span className="hidden sm:inline">{control.label}</span>
                    </button>
                  </div>
                ))}
              </div>
          
              {/* Divider */}
              <div className="w-px h-8 bg-white/10"></div>

              {/* Rotation Speed Controls */}
              <div className="flex items-center gap-1 relative">
                {rotationControls.map((control) => (
                  <div key={control.speed} className="relative">
                    {rotationSpeed === control.speed && (
                      <motion.div
                        layoutId="speed-pill"
                        className="absolute inset-0 bg-white/10 rounded-full"
                      />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setRotationSpeed(control.speed); }}
                      className="relative p-1.5 sm:p-2 rounded-full text-xs font-medium text-white transition-colors duration-300 hover:bg-white/5 flex items-center gap-1.5"
                      aria-label={`Set rotation speed to ${control.label}`}
                    >{control.icon}
                    
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Hotspot Info Overlay */}
          <AnimatePresence>
            {activeHotspot && hotspotData[activeHotspot] && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-0 left-0 right-0 sm:top-1/2 sm:bottom-auto sm:left-auto sm:right-10 sm:transform sm:-translate-y-1/2 w-full sm:w-80 bg-black/90 sm:bg-black/80 backdrop-blur-md border-t sm:border border-gray-800 p-6 rounded-t-xl sm:rounded-xl text-white shadow-2xl z-10"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
                  {hotspotData[activeHotspot].icon}
                  <h3 className="text-xl font-bold">{hotspotData[activeHotspot].title}</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-h-[150px] overflow-y-auto">
                  {hotspotData[activeHotspot].description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {hotspotData[activeHotspot].tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded-md border border-white/10 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={clearHotspot}
                  className="w-full py-2 bg-[#bd00ff] hover:bg-[#a000db] transition-colors rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <span className="inline-block transform rotate-180">
                    <ArrowLeft size={16} />
                  </span>
                  Back to Room
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      </div>
  );
}
