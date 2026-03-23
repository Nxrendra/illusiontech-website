// /Users/macbookair/Documents/IllusionTech-Development/components/home/tech-preview/BlankRoom.tsx

import { Float, MeshReflectorMaterial, Html, Mask, useMask } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';

extend({ PlaneGeometry: THREE.PlaneGeometry });

function Streak({ position, speed, length, geometry, material }: { position: THREE.Vector3, speed: number, length: number, geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial }) {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y -= speed * delta;
      if (ref.current.position.y < -length) {
        ref.current.position.y = 15; // Reset to top, slightly above view
      }
    }
  });

  return (
    <mesh ref={ref} position={position} geometry={geometry} material={material} scale={[1, length, 1]} />
  );
}

function FallingStreaks() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const count = isMobile ? 50 : 300; // Drastically reduce particles on mobile to save GPU

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(30), // x spread across the back wall
        THREE.MathUtils.randFloat(0, 15),    // y start position
        -14.8                                // z position just in front of the wall
      ),
      speed: THREE.MathUtils.randFloat(4, 10),
      length: THREE.MathUtils.randFloat(0.5, 1.5),
    }));
  }, [count]);

  // Shared geometry and material for performance
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.03, 1), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#bd00ff", toneMapped: false, transparent: true, opacity: 0.6 }), []);

  return (
    <group>
      {particles.map((data, i) => (
        <Streak key={i} {...data} geometry={geometry} material={material} />
      ))}
    </group>
  );
}

// Component for the blinking server lights
function BlinkingLight({ position, isActive }: { position: [number, number, number], isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null!);
  const initialDelay = useRef(Math.random() * 5);
  const activeColor = useMemo(() => new THREE.Color("#ff4444"), []);
  const inactiveColor = useMemo(() => new THREE.Color("#00f0ff"), []);
  const offColor = useMemo(() => new THREE.Color("#1a1a1a"), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    
    const speed = isActive ? 4 : (Math.random() * 0.5 + 0.5);
    const threshold = isActive ? 0.5 : 0.9;
    const isOn = Math.sin(time * speed + initialDelay.current) > threshold;
    
    const targetColor = isOn ? (isActive ? activeColor : inactiveColor) : offColor;
    // Smoothly transition color to avoid jarring changes
    meshRef.current.material.color.lerp(targetColor, 0.1);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.5, 0.05]} />
      <meshBasicMaterial color="#1a1a1a" toneMapped={false} />
    </mesh>
  );
}

function StaticDataScreen() {
    return (
        <group>
            {/* Background bars */}
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[-0.8 + i * 0.4, 0, 0.01]}>
                    <planeGeometry args={[0.15, Math.random() * 1.2 + 0.2]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
                </mesh>
            ))}
            {/* Horizontal line */}
            <mesh position={[0, -0.4, 0.01]}>
                <planeGeometry args={[2, 0.02]} />
                <meshBasicMaterial color="#00f0ff" toneMapped={false} />
            </mesh>
             <mesh position={[0, 0.1, 0.01]}>
                <planeGeometry args={[2, 0.02]} />
                <meshBasicMaterial color="#00f0ff" toneMapped={false} />
            </mesh>
        </group>
    )
}

function GlowingPillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base Pad */}
      <mesh position={[0, -5.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.4, 32]} />
          <meshStandardMaterial color="#050505" metalness={1} roughness={0.2} />
      </mesh>
      {/* Top Pad */}
      <mesh position={[0, 5.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.4, 32]} />
          <meshStandardMaterial color="#050505" metalness={1} roughness={0.2} />
      </mesh>

      {/* Central Glowing Core */}
      <mesh>
          <cylinderGeometry args={[0.3, 0.3, 12, 16]} />
          <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Enclosing Structure */}
      {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (Math.PI / 2) * i, 0]}>
              {/* Vertical Pillar */}
              <mesh position={[1.1, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.3, 11.6, 0.3]} />
                  <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Inner Light Strip */}
              <mesh position={[0.95, 0, 0]}>
                  <boxGeometry args={[0.05, 11, 0.1]} />
                  <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
              </mesh>
          </group>
      ))}
      
      {/* Horizontal Rings */}
      {[ -3, 0, 3 ].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
              <torusGeometry args={[0.8, 0.05, 16, 32]} />
              <meshStandardMaterial color="#333" metalness={1} roughness={0.2} />
          </mesh>
      ))}
    </group>
  );
}

function AnimatedDataBars() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const mesh = child as THREE.Mesh;
                // Animate the height of the bars
                mesh.scale.y = (Math.sin(clock.elapsedTime * 3 + i * 0.7) + 1) / 2 * 0.9 + 0.1;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {[...Array(8)].map((_, i) => (
                <mesh key={i} position={[-0.4 + i * 0.115, 0, 0.01]}>
                    <planeGeometry args={[0.05, 0.4]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} toneMapped={false} />
                </mesh>
            ))}
        </group>
    )
}

function SideHologram() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    // Gentle floating animation for the whole hologram
    if (groupRef.current) {
      groupRef.current.position.y = 1.2 + Math.sin(clock.elapsedTime * 0.7) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.2, 0.3]} rotation={[-0.15, 0, 0]}>
      {/* Main holographic plane - smaller and neater */}
      <mesh>
        <planeGeometry args={[1.0, 0.6]} />
        <meshBasicMaterial color="#bd00ff" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Thin wireframe border for a high-tech look */}
      <mesh>
        <planeGeometry args={[1.0, 0.6]} />
        <meshBasicMaterial color="#bd00ff" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Animated Content */}
      <AnimatedDataBars />

      {/* Base Emitter line with a glow */}
      <mesh position={[0, -0.32, 0]}>
        <planeGeometry args={[1.0, 0.015]} />
        <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

function SparklineChart({ data, color }: { data: number[], color: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const normalizedData = data.map(d => (d - min) / range);

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;

        normalizedData.forEach((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d * (height - 2)) - 1; // Add padding
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }, [data, color]);

    return <canvas ref={canvasRef} width="50" height="15" style={{ verticalAlign: 'middle' }} />;
}

function SystemMetricsFeed() {
    const [data, setData] = useState({
        cpu: { value: 24, history: Array(20).fill(24) },
        latency: { value: 12, history: Array(20).fill(12) }
    });

    useEffect(() => {
        const dataTimer = setInterval(() => {
            setData(prev => ({
                cpu: (current => ({ value: Math.min(100, Math.max(10, current.value + (Math.random() - 0.5) * 5)), history: [...current.history, current.value].slice(-20) }))(prev.cpu),
                latency: (current => ({ value: Math.max(5, current.value + (Math.random() - 0.5) * 2), history: [...current.history, current.value].slice(-20) }))(prev.latency)
            }));
        }, 1000);
        return () => {
            clearInterval(dataTimer);
        };
    }, []);

    const rowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace' };
    
    const labelStyle: React.CSSProperties = { fontSize: '10px', color: '#888' };
    const neutralStyle: React.CSSProperties = { fontSize: '11px', color: '#00f0ff' };

    return (
        <div style={{ width: '100%', height: '100%', padding: '15px', boxSizing: 'border-box', background: 'rgba(2,2,5,0.8)', color: 'white', backdropFilter: 'blur(5px)' }}>
             <div style={{...rowStyle, marginTop: '15px', borderBottom: '1px solid #00f0ff', marginBottom: '8px'}}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00f0ff' }}>SYSTEM METRICS</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>CPU UTILIZATION</span>
                <SparklineChart data={data.cpu.history} color="#00f0ff" />
                <span style={neutralStyle}>{data.cpu.value.toFixed(1)}%</span>
            </div>
             <div style={rowStyle}>
                <span style={labelStyle}>LATENCY</span>
                <SparklineChart data={data.latency.history} color="#00f0ff" />
                <span style={neutralStyle}>{data.latency.value.toFixed(0)} ms</span>
            </div>
             <div style={rowStyle}>
                <span style={labelStyle}>UPTIME</span>
                <span style={{ fontSize: '11px', color: '#00ff00' }}>99.99%</span>
            </div>
        </div>
    );
}


function SystemMetricsScreen({
  position,
  rotation,
  scale = 1
}: {
  position: [number, number, number],
  rotation: [number, number, number],
  scale?: number
}) {
    const screenWidth = 3.0;
    const screenHeight = 1.8;
    const screenDepth = 0.1;
    const floorY = -position[1] / scale;

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Stand */}
            <group>
                {/* Floor base */}
                <mesh position={[0, floorY + 0.05, -0.2]} castShadow receiveShadow>
                    <boxGeometry args={[1.5, 0.1, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Pole from base to screen */}
                <mesh castShadow receiveShadow position={[0, (floorY - screenHeight / 2) / 2, -0.2]}>
                    <boxGeometry args={[0.3, -floorY - screenHeight / 2, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>

            {/* Screen Frame */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[screenWidth, screenHeight, screenDepth]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Screen Glow Border */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[screenWidth + 0.2, screenHeight + 0.2, 0.05]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={5} toneMapped={false} />
            </mesh>

            {/* Screen Content */}
            <Html
                transform
                position={[0, 0, screenDepth / 2 + 0.01]}
                style={{
                    width: '288px',
                    height: '173px',
                    pointerEvents: 'none',
                }}
            >
                <SystemMetricsFeed />
            </Html>
        </group>
    );
}


function SideDesk({ position, rotationY = 0, scale = 1 }: { position: [number, number, number], rotationY?: number, scale?: number }) {
    return (
        <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
            {/* Desk Top */}
            <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
                <boxGeometry args={[2.5, 0.05, 1.2]} />
                <meshStandardMaterial color="#151515" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Legs */}
            <mesh position={[-1.1, 0.375, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.1, 0.75, 1]} />
                <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[1.1, 0.375, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.1, 0.75, 1]} />
                <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Enhanced Holographic Monitor */}
            <SideHologram />
        </group>
    )
}

function FuturisticPlant({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
    return (
        <group position={position} scale={scale}>
            {/* Pot */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.4, 1, 16]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing Ring on Pot */}
            <mesh position={[0, 0.8, 0]}>
                <torusGeometry args={[0.5, 0.02, 16, 100]} />
                <meshBasicMaterial color="#bd00ff" toneMapped={false} />
            </mesh>
            {/* Plant Stem */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {/* Plant "Leaf" */}
            <Float speed={3} rotationIntensity={1} floatIntensity={0.2}>
                <mesh position={[0, 2.2, 0]}>
                    <sphereGeometry args={[0.3]} />
                    <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={0.5} />
                </mesh>
            </Float>
        </group>
    )
}

function WallPanel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {    
    const { size } = useThree();
    const isMobile = size.width < 768;

    const panelWidth = 30;
    const panelHeight = 12;
    const segmentSize = isMobile ? 6 : 2; // Much larger segments on mobile to reduce draw calls
    const numX = Math.floor(panelWidth / segmentSize);
    const numY = Math.floor(panelHeight / segmentSize);

    const panels = useMemo(() => {
        const temp = [];
        for (let i = 0; i < numX; i++) {
            for (let j = 0; j < numY; j++) {
                temp.push({
                    x: -panelWidth / 2 + segmentSize / 2 + i * segmentSize,
                    y: -panelHeight / 2 + segmentSize / 2 + j * segmentSize,
                    z: (Math.sin(i * 0.5) + Math.cos(j * 0.5)) * 0.05, // Wavy pattern
                });
            }
        }
        return temp;
    }, [numX, numY, segmentSize]);

    // Create geometry and material once to prevent memory leaks and overhead
    const panelGeometry = useMemo(() => new THREE.BoxGeometry(segmentSize * 0.9, segmentSize * 0.9, 0.1), [segmentSize]);
    const panelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.4, metalness: 0.5 }), []);

    return (
        <group position={position} rotation={rotation}>
            {/* Base wall */}
            <mesh receiveShadow position={[0,0,-0.1]}>
                <boxGeometry args={[panelWidth, panelHeight, 0.1]} />
                <meshStandardMaterial color="#080808" />
            </mesh>
            {/* Patterned panels */}
            {panels.map((panel, index) => (
                <mesh 
                    key={index} 
                    position={[panel.x, panel.y, panel.z]} 
                    receiveShadow 
                    castShadow
                    geometry={panelGeometry}
                    material={panelMaterial}
                />
            ))}
            {/* The original light strips */}
            {[...Array(10)].map((_, i) => (
                <mesh key={i} position={[-14 + i * 2.8, 0, 0.2]}>
                    <boxGeometry args={[0.05, 12, 0.05]} />
                    <meshStandardMaterial 
                        color={i % 2 === 0 ? "#00f0ff" : "#bd00ff"} 
                        emissive={i % 2 === 0 ? "#00f0ff" : "#bd00ff"} 
                        emissiveIntensity={0.5} 
                        toneMapped={false} 
                    />
                </mesh>
            ))}
        </group>
    )
}

function DigitalScreenContent() {
    const groupRef = useRef<THREE.Group>(null!);
    useFrame(({ clock }) => {
        if (groupRef.current) {
             groupRef.current.children.forEach((child, i) => {
                 const mesh = child as THREE.Mesh;
                 mesh.position.y -= 0.002 * (i % 3 + 1);
                 if (mesh.position.y < -0.3) mesh.position.y = 0.3;
             })
        }
    });
    
    const lines = useMemo(() => Array.from({length: 15}, (_, i) => ({
        width: Math.random() * 0.6 + 0.1,
        x: Math.random() * 0.4 - 0.2,
        y: Math.random() * 0.6 - 0.3,
        color: Math.random() > 0.7 ? "#bd00ff" : "#00f0ff"
    })), []);

    return (
        <group position={[0, 0, 0.03]} ref={groupRef}>
            {/* Screen Background Glow */}
            <mesh position={[0, 0, -0.005]}>
                <planeGeometry args={[1.1, 0.6]} />
                <meshBasicMaterial color="#001020" />
            </mesh>
             {lines.map((l, i) => (
                 <mesh key={i} position={[l.x, l.y, 0]}>
                     <planeGeometry args={[l.width, 0.005]} />
                     <meshBasicMaterial color={l.color} transparent opacity={0.8} toneMapped={false} />
                 </mesh>
             ))}
        </group>
    )
}

function LoungeParticles() {
    const count = 20;
    const particles = useMemo(() => Array.from({ length: count }, () => ({
        position: [
            THREE.MathUtils.randFloatSpread(5),
            THREE.MathUtils.randFloat(0.5, 2),
            THREE.MathUtils.randFloatSpread(3)
        ] as [number, number, number],
        speed: THREE.MathUtils.randFloat(0.5, 1.5),
        factor: THREE.MathUtils.randFloat(1, 3)
    })), []);

    return (
        <group>
            {particles.map((data, i) => (
                <Float key={i} speed={data.speed} rotationIntensity={data.factor} floatIntensity={data.factor * 0.2}>
                    <mesh position={data.position}>
                        <sphereGeometry args={[0.03]} />
                        <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={1} toneMapped={false} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

function ScreenParticle({ position, geometry, material }: { position: THREE.Vector3, geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial }) {
  const ref = useRef<THREE.Mesh>(null!);
  const timeOffset = useRef(Math.random() * 100);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + timeOffset.current;
      // Drifting motion
      ref.current.position.x = position.x + Math.sin(t * 0.5) * 0.1;
      ref.current.position.y = position.y + Math.cos(t * 0.3) * 0.1;
    }
  });

  return <mesh ref={ref} position={position} geometry={geometry} material={material} />;
}

function ScreenParticles({ screenWidth, screenHeight }: { screenWidth: number, screenHeight: number }) {
    const count = 40;
    const geometry = useMemo(() => new THREE.PlaneGeometry(0.05, 0.05), []);
    const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#4da6ff", transparent: true, opacity: 0.4, toneMapped: false }), []);
    
    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * screenWidth,
                (Math.random() - 0.5) * screenHeight,
                0.01
            )
        }));
    }, [screenWidth, screenHeight]);

    return (
        <group>
            {particles.map((data, i) => (
                <ScreenParticle key={i} {...data} geometry={geometry} material={material} />
            ))}
        </group>
    )
}

function FlatScreen({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
    const screenWidth = 4.5;
    const screenHeight = 2.5;
    const screenDepth = 0.15;
    const floorY = -position[1] / scale; // The floor's y-coordinate relative to the screen center

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Stand */}
            <group>
                {/* Base on the floor */}
                <mesh position={[0, floorY + 0.05, -0.2]} castShadow receiveShadow >
                    <boxGeometry args={[1.5, 0.1, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Pole from base to screen */}
                <mesh castShadow receiveShadow position={[0, (floorY - screenHeight / 2) / 2, -0.2]}>
                    <boxGeometry args={[0.2, -floorY - screenHeight / 2, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>

            {/* Frame */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[screenWidth, screenHeight, screenDepth]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Screen Glow Border */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[screenWidth + 0.05, screenHeight + 0.05, 0.05]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 0, screenDepth / 2 + 0.01]}>
                <planeGeometry args={[screenWidth - 0.2, screenHeight - 0.2]} />
                <meshBasicMaterial color="#0b1026" />
            </mesh>
            {/* Screen Content */}
            <group position={[0, 0, screenDepth / 2 + 0.02]}>
                 <ScreenParticles screenWidth={screenWidth - 0.2} screenHeight={screenHeight - 0.2} />
                 <Html
                    transform
                    occlude
                    position={[0, 0, 0.01]}
                    style={{
                        width: `${(screenWidth - 0.2) * 100}px`,
                        height: `${(screenHeight - 0.2) * 100}px`,
                        pointerEvents: 'none',
                    }}
                 >
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        textAlign: 'center',
                        textShadow: '0 0 10px #00f0ff',
                        padding: '40px'
                    }}>
                        <h1 style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            margin: 0,
                            letterSpacing: '0.1em',
                            textShadow: '0 0 20px #bd00ff',
                        }}>
                            ILLUSIONTECH
                        </h1>
                        <h2 style={{
                            fontSize: '9px',
                            fontWeight: '400',
                            color: '#00f0ff',
                            margin: '10px 0 0 0',
                            letterSpacing: '0.2em',
                        }}>
                            3D DESIGN EXPERIENCE
                        </h2>
                    </div>
                 </Html>
                 {/* Inner Glow */}
                 <mesh>
                    <planeGeometry args={[screenWidth - 0.1, screenHeight - 0.1]} />
                    <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} toneMapped={false} transparent opacity={0.1} />
                 </mesh>
            </group>
        </group>
    );
}

function PromotionalScreen({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
    const screenWidth = 4.2;
    const screenHeight = 2.5;
    const screenDepth = 0.15;
    const floorY = -position[1] / scale;
    
    const stencil = useMask(1);

    // Animation ref for background shapes
    const shapesRef = useRef<THREE.Group>(null!);
    useFrame((state) => {
        if (shapesRef.current) {
            shapesRef.current.children.forEach((child, i) => {
                const t = state.clock.elapsedTime;
                child.rotation.z = t * 0.15 * (i % 2 === 0 ? 1 : -1);
                const scale = 1 + Math.sin(t * 1.5 + i) * 0.1;
                child.scale.set(scale, scale, 1);
            });
        }
    });

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Stand (Same as FlatScreen) */}
            <group>
                <mesh position={[0, floorY + 0.05, -0.2]} castShadow receiveShadow >
                    <boxGeometry args={[1.5, 0.1, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, (floorY - screenHeight / 2) / 2, -0.2]}>
                    <boxGeometry args={[0.2, -floorY - screenHeight / 2, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[screenWidth, screenHeight, screenDepth]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Screen Glow Border */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[screenWidth + 0.05, screenHeight + 0.05, 0.05]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            
            {/* Screen Background & Mask Shape */}
            <mesh position={[0, 0, screenDepth / 2 + 0.01]}>
                <planeGeometry args={[screenWidth - 0.2, screenHeight - 0.2]} />
                <meshBasicMaterial color="#0b1026" />
            </mesh>
            <Mask id={1} position={[0, 0, screenDepth / 2 + 0.01]}>
                <planeGeometry args={[screenWidth - 0.2, screenHeight - 0.2]} />
            </Mask>

            {/* Animated Concentric Shapes */}
            <group position={[0, 0, screenDepth / 2 + 0.015]} ref={shapesRef}>
                {[...Array(5)].map((_, i) => (
                    <mesh key={i}>
                        <ringGeometry args={[0.4 + i * 0.4, 0.45 + i * 0.4, 4]} />
                        <meshBasicMaterial {...stencil} color="#00f0ff" transparent opacity={0.2} toneMapped={false} />
                        </mesh>
                ))}
            </group>

            <group position={[0, 0, screenDepth / 2 + 0.02]}>
                 <Html transform occlude position={[0, 0, 0.01]} style={{ width: `${(screenWidth - 0.2) * 100}px`, height: `${(screenHeight - 0.2) * 100}px`, pointerEvents: 'none' }}>
                   <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '20px', boxSizing: 'border-box', background: 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)' }}>
                        <h1 style={{ fontSize: '11px', fontWeight: '800', margin: 0, letterSpacing: '0.05em', color: '#00f0ff', textShadow: '0 0 10px #00f0ff', width: '100%', whiteSpace: 'normal' }}>
                            DESIGNS THAT DAZZLE
                        </h1>
                        <p style={{ fontSize: '7px', fontWeight: '400', color: '#e0e0e0', margin: '10px 0 0 0', maxWidth: '95%', lineHeight: '1.5', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            Experience the future of Web Development!
                        </p>
                    </div>
                 </Html>
                 <mesh>
                    <planeGeometry args={[screenWidth - 0.1, screenHeight - 0.1]} />
                    <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={0.1} toneMapped={false} transparent opacity={0.1} />
                 </mesh>
            </group>
        </group>
    );
}

function ServicesScreen({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
    const screenWidth = 4.2;
    const screenHeight = 1.8; // Shortened height
    const screenDepth = 0.15;
    const floorY = -position[1] / scale;

    // Animation ref for rotating ring
    const ringRef = useRef<THREE.Group>(null!);
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Stand */}
            <group>
                <mesh position={[0, floorY + 0.05, -0.2]} castShadow receiveShadow >
                    <boxGeometry args={[1.5, 0.1, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, (floorY - screenHeight / 2) / 2, -0.2]}>
                    <boxGeometry args={[0.2, -floorY - screenHeight / 2, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[screenWidth, screenHeight, screenDepth]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Screen Glow Border */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[screenWidth + 0.05, screenHeight + 0.05, 0.05]} />
                <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, screenDepth / 2 + 0.01]}>
                <planeGeometry args={[screenWidth - 0.2, screenHeight - 0.2]} />
                <meshBasicMaterial color="#0b1026" />
            </mesh>

            {/* Rotating Tech Ring */}
            <group position={[0, 0, screenDepth / 2 + 0.015]} ref={ringRef}>
                 <mesh>
                    <ringGeometry args={[0.6, 0.62, 64]} />
                    <meshBasicMaterial color="#bd00ff" transparent opacity={0.4} toneMapped={false} />
                 </mesh>
                 <mesh rotation={[0,0, 0.5]}>
                    <ringGeometry args={[0.7, 0.71, 4]} />
                    <meshBasicMaterial color="#bd00ff" transparent opacity={0.2} toneMapped={false} />
                 </mesh>
            </group>

            <group position={[0, 0, screenDepth / 2 + 0.02]}>
                 <Html transform occlude position={[0, 0, 0.01]} style={{ width: `${(screenWidth - 0.2) * 100}px`, height: `${(screenHeight - 0.2) * 100}px`, pointerEvents: 'none' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '30px', boxSizing: 'border-box', background: 'radial-gradient(circle, rgba(189,0,255,0.05) 0%, rgba(0,0,0,0) 80%)' }}>
                         <h2 style={{ fontSize: '9px', fontWeight: '600', color: '#bd00ff', letterSpacing: '0.1em' }}>
                            WE BUILD IMMERSIVE 3D SPACES
                        </h2>
                    </div>
                 </Html>
                 <mesh>
                    <planeGeometry args={[screenWidth - 0.1, screenHeight - 0.1]} />
                    <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={0.05} toneMapped={false} transparent opacity={0.1} />
                 </mesh>
            </group>
        </group>
    );
}

function MarketDataFeed() {
    const [data, setData] = useState({
        eur: 1.0854,
        btc: { value: 64230.50, history: Array(20).fill(64230.50) },
        eth: { value: 3450.20, history: Array(20).fill(3450.20) },
        dow: { value: 38850.43, history: Array(20).fill(38850.43) },
        spx: { value: 5150.21, history: Array(20).fill(5150.21) },
        gbp: { value: 1.2780, history: Array(20).fill(1.2780) },
        jpy: { value: 157.25, history: Array(20).fill(157.25) },
        gold: { value: 2330.50, history: Array(20).fill(2330.50) }
    });
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const dataTimer = setInterval(() => {
            setData(prev => ({
                ...prev, // Keep eur as is, or update it if needed
                btc: (current => ({ value: current.value + (Math.random() - 0.5) * 50, history: [...current.history, current.value].slice(-20) }))(prev.btc),
                eth: (current => ({ value: current.value + (Math.random() - 0.5) * 10, history: [...current.history, current.value].slice(-20) }))(prev.eth),
                dow: (current => ({ value: current.value + (Math.random() - 0.5) * 100, history: [...current.history, current.value].slice(-20) }))(prev.dow),
                spx: (current => ({ value: current.value + (Math.random() - 0.5) * 20, history: [...current.history, current.value].slice(-20) }))(prev.spx),
                gbp: (current => ({ value: current.value + (Math.random() - 0.5) * 0.001, history: [...current.history, current.value].slice(-20) }))(prev.gbp),
                jpy: (current => ({ value: current.value + (Math.random() - 0.5) * 0.1, history: [...current.history, current.value].slice(-20) }))(prev.jpy),
                gold: (current => ({ value: current.value + (Math.random() - 0.5) * 5, history: [...current.history, current.value].slice(-20) }))(prev.gold)
            }));
        }, 1000);
        return () => {
            clearInterval(timer);
            clearInterval(dataTimer);
        };
    }, []);

    const rowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace' };
    
    const labelStyle: React.CSSProperties = { fontSize: '6px', color: '#888' };
    const valStyle = (val: number, base: number) => ({ fontSize: '7px', color: val > base ? '#00ff00' : '#ff4444' });

    return (
        <div style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box', background: '#0b1026', color: 'white' }}>
            <div style={{...rowStyle, borderBottom: '1px solid #bd00ff', marginBottom: '4px', alignItems: 'center'}}>
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#bd00ff' }}>MARKET WATCH</span>
                <span style={{ fontSize: '6px', color: '#e0e0e0' }}>{time.toLocaleTimeString()}</span>
            </div>
            
            <div style={rowStyle}>
                <span style={labelStyle}>EUR/USD</span>
                <span style={valStyle(data.eur, 1.0854)}>{data.eur.toFixed(4)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>BTC/USD</span>
                <SparklineChart data={data.btc.history} color="#00ff00" />
                <span style={valStyle(data.btc.value, 64230)}>${data.btc.value.toFixed(2)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>ETH/USD</span>
                <SparklineChart data={data.eth.history} color="#00ff00" />
                <span style={valStyle(data.eth.value, 3450)}>${data.eth.value.toFixed(2)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>DOW JONES</span>
                <SparklineChart data={data.dow.history} color="#00ff00" />
                <span style={valStyle(data.dow.value, 38850)}>{data.dow.value.toFixed(2)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>S&P 500</span>
                <SparklineChart data={data.spx.history} color="#00ff00" />
                <span style={valStyle(data.spx.value, 5150)}>{data.spx.value.toFixed(2)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>GBP/USD</span>
                <SparklineChart data={data.gbp.history} color="#00ff00" />
                <span style={valStyle(data.gbp.value, 1.2780)}>{data.gbp.value.toFixed(4)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>USD/JPY</span>
                <SparklineChart data={data.jpy.history} color="#00ff00" />
                <span style={valStyle(data.jpy.value, 157.25)}>{data.jpy.value.toFixed(2)}</span>
            </div>
            <div style={rowStyle}>
                <span style={labelStyle}>GOLD</span>
                <SparklineChart data={data.gold.history} color="#00ff00" />
                <span style={valStyle(data.gold.value, 2330.50)}>${data.gold.value.toFixed(2)}</span>
            </div>
        </div>
    );
}

function DataFeedScreen({
  position,
  rotation,
  scale = 1
}: {
  position: [number, number, number],
  rotation: [number, number, number],
  scale?: number
}) {
    const screenWidth = 2.8;
    const screenHeight = 2.1;
    const screenDepth = 0.15;
    const floorY = -position[1] / scale;

    return ( 
        <group position={position} rotation={rotation} scale={scale}>
            {/* Stand */}
            <group>
                <mesh position={[0, floorY + 0.05, -0.2]} castShadow receiveShadow>
                    <boxGeometry args={[screenWidth * 0.7, 0.1, 1.2]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, (floorY - screenHeight / 2) / 2, -0.2]}>
                    <boxGeometry args={[0.8, -floorY - screenHeight / 2, 0.5]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>

            <mesh castShadow receiveShadow>
                <boxGeometry args={[screenWidth, screenHeight, screenDepth]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Screen Glow Border */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[screenWidth + 0.2, screenHeight + 0.2, 0.05]} />
                <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={5} toneMapped={false} />
            </mesh>

            {/* Screen Content */}
            <Html
                transform
                position={[0, 0, screenDepth / 2 + 0.03]}
                style={{
                    width: '256px',
                    height: '192px',
                    pointerEvents: 'none',
                }}
            >
                <MarketDataFeed />
            </Html>
        </group>
    );
}

function VolumetricFloor() {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const countX = isMobile ? 30 : 50;
  const countZ = isMobile ? 30 : 50;
  const totalCount = countX * countZ;

  useFrame(({ clock }) => {
    if (!instancedMeshRef.current) return;
    let i = 0;
    const t = clock.getElapsedTime();

    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        const id = i++;
        
        const x = ix - countX / 2;
        const z = iz - countZ / 2;
        
        // Multiple sine waves for a more complex, flowing pattern
        const height = 
          (Math.sin(x * 0.2 + t) + 
           Math.cos(z * 0.2 + t * 0.5) +
           Math.sin((x + z) * 0.15 + t)) * 0.15 + 0.2;

        dummy.position.set(x * 0.8, height / 2 - 0.5, z * 0.8);
        dummy.scale.set(0.3, height, 0.3);
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(id, dummy.matrix);
      }
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, -0.5, 0]}>
      <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, totalCount]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
      </instancedMesh>
      {/* Add a reflective plane underneath for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial blur={[200, 50]} resolution={isMobile ? 256 : 512} mixBlur={0.8} mixStrength={15} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#080808" metalness={0.8} mirror={0.4} />
      </mesh>
    </group>
  );
}

function TechPlatform({ x, z, width, depth, height = 0.5, color = "#00f0ff", rotation = 0 }: { x: number, z: number, width: number, depth: number, height?: number, color?: string, rotation?: number }) {
  return (
    <group position={[x, -height / 2, z]} rotation={[0, rotation, 0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 0.1, depth + 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <mesh position={[0, height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function GlassFloorPolygon({ vertices }: { vertices: [number, number][] }) {
    const { size } = useThree();
    const isMobile = size.width < 768;
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        if (vertices.length > 0) {
            s.moveTo(vertices[0][0], -vertices[0][1]);
            for (let i = 1; i < vertices.length; i++) {
                s.lineTo(vertices[i][0], -vertices[i][1]);
            }
            s.closePath();
        }
        return s;
    }, [vertices]);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
            <mesh receiveShadow>
                <shapeGeometry args={[shape]} />
                <meshStandardMaterial 
                    color="#88ccff"
                    metalness={0.9}
                    roughness={0.05}
                    transparent
                    opacity={0.4}
                />
            </mesh>
            {!isMobile && (
              <mesh position={[0, 0, 0.01]}>
                 <shapeGeometry args={[shape]} />
                 <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} wireframe />
              </mesh>
            )}
        </group>
    );
}

function TechWalkway({ start, end, width = 1.5, color = "#00f0ff", yOffset = 0 }: { start: [number, number, number], end: [number, number, number], width?: number, color?: string, yOffset?: number }) {
    const { size } = useThree();
    const isMobile = size.width < 768;
    const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2));
    const angle = Math.atan2(end[0] - start[0], end[2] - start[2]);
    const midX = (start[0] + end[0]) / 2;
    const midZ = (start[2] + end[2]) / 2;

    return (
        <group position={[midX, -0.2 + yOffset, midZ]} rotation={[0, angle, 0]}>
            {/* Main Base Platform */}
            <mesh receiveShadow castShadow>
                <boxGeometry args={[width, 0.1, length]} />
                <meshStandardMaterial color="#151515" roughness={0.2} metalness={0.8} />
            </mesh>
            
            {/* Side Guard Rails (Physical geometry) */}
            <mesh position={[-width / 2 + 0.1, 0.1, 0]} castShadow>
                <boxGeometry args={[0.15, 0.1, length]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[width / 2 - 0.1, 0.1, 0]} castShadow>
                <boxGeometry args={[0.15, 0.1, length]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.9} />
            </mesh>

            {/* Central Glass Section */}
            <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width - 0.4, length]} />
                <meshStandardMaterial
                    color="#88ccff"
                    metalness={0.8}
                    roughness={0.1}
                    transparent
                    opacity={0.3}
                />
            </mesh>
            {!isMobile && (
              <mesh position={[0, 0.056, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                 <planeGeometry args={[width - 0.45, length]} />
                 <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
              </mesh>
            )}

            {/* Central Glass Section */}
            <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width - 0.4, length]} />
                <meshStandardMaterial
                    color="#88ccff"
                    metalness={0.8}
                    roughness={0.1}
                    transparent
                    opacity={0.3}
                />
            </mesh>
            {!isMobile && (
              <mesh position={[0, 0.056, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                 <planeGeometry args={[width - 0.45, length]} />
                 <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
              </mesh>
            )}

            {/* Central Matte Tread */}
             <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[width - 0.5, length]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.4} />
            </mesh>
        </group>
    );
}

function MonitorScreen({ position, rotation = [0, 0, 0], scale = 1 }: { position: [number, number, number], rotation?: [number, number, number], scale?: number }) {
  return (
        <group position={position} rotation={rotation} scale={scale}>
             <mesh castShadow receiveShadow>
                 <boxGeometry args={[1.2, 0.7, 0.05]} />
                 <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.8} />
             </mesh>
             {/* Screen Glow Border */}
             <mesh position={[0, 0, -0.02]}>
                 <boxGeometry args={[1.22, 0.72, 0.04]} />
                 <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} toneMapped={false} />
             </mesh>
             {/* Screen surface */}
             <mesh position={[0, 0, 0.026]}>
                 <planeGeometry args={[1.15, 0.65]} />
                 <meshBasicMaterial color="#000" />
             </mesh>
             <DigitalScreenContent />
             {/* Monitor Stand */}
             <group position={[0, -0.35, -0.2]} rotation={[0.1, 0, 0]}>
                  <mesh>
                      <boxGeometry args={[0.1, 0.4, 0.05]} />
                      <meshStandardMaterial color="#111" />
                  </mesh>
             </group>
        </group>
  )
}

function MobilePanoramaScreen({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
    const screenWidth = 4.3; // Reduced width to avoid crowding side screens/servers
    const screenHeight = 1.4; // Reduced height for a sleeker look
    const screenDepth = 0.15;
    const floorY = -position[1] / scale;

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Stand */}
            <group>
                <mesh position={[0, floorY + 0.05, -0.2]} castShadow receiveShadow>
                    <boxGeometry args={[2.5, 0.1, 1]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, (floorY - screenHeight / 2) / 2, -0.2]}>
                    <boxGeometry args={[0.4, -floorY - screenHeight / 2, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </mesh>
            </group>

            {/* Frame */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[screenWidth, screenHeight, screenDepth]} />
                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Screen Glow Border */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[screenWidth + 0.05, screenHeight + 0.05, 0.05]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            
            {/* Screen Content Background */}
            <mesh position={[0, 0, screenDepth / 2 + 0.01]}>
                <planeGeometry args={[screenWidth - 0.2, screenHeight - 0.2]} />
                <meshBasicMaterial color="#0b1026" />
            </mesh>

            <group position={[0, 0, screenDepth / 2 + 0.02]}>
                 <ScreenParticles screenWidth={screenWidth - 0.2} screenHeight={screenHeight - 0.2} />
                 <Html
                    transform
                    occlude
                    position={[0, 0, 0.01]}
                    style={{
                        width: `${(screenWidth - 0.2) * 100}px`,
                        height: `${(screenHeight - 0.2) * 100}px`,
                        pointerEvents: 'none',
                    }}
                 >
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        padding: '20px',
                        boxSizing: 'border-box',
                        background: 'radial-gradient(ellipse at center, rgba(11,16,38,0.95) 0%, rgba(0,0,0,0.9) 100%)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                    }}>
                        <h1 style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.15em', color: '#fff', textShadow: '0 0 15px #bd00ff', margin: '0 0 5px 0' }}>
                            ILLUSIONTECH
                        </h1>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '6px', color: '#00f0ff', fontWeight: '600', letterSpacing: '0.1em' }}>INNOVATION</span>
                            <span style={{ fontSize: '6px', color: '#555' }}>•</span>
                            <span style={{ fontSize: '6px', color: '#bd00ff', fontWeight: '600', letterSpacing: '0.1em' }}>IMMERSIVE</span>
                            <span style={{ fontSize: '6px', color: '#555' }}>•</span>
                            <span style={{ fontSize: '6px', color: '#00f0ff', fontWeight: '600', letterSpacing: '0.1em' }}>EXPERIENCE</span>
                        </div>
                        <p style={{ fontSize: '5px', color: '#aaa', margin: 0, fontStyle: 'italic' }}>
                            "Designs that dazzle. Spaces that connect."
                        </p>
                    </div>
                 </Html>
            </group>
        </group>
    );
}

interface BlankRoomProps {
    onHotspotSelect?: (type: 'lounge' | null) => void;
   updateKey: number;
   activeHotspot?: 'lounge' | null;
}

export default function BlankRoom({ onHotspotSelect, activeHotspot }: BlankRoomProps) {
  const [hovered, setHover] = useState<string | null>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const screenScale = isMobile ? 0.7 : 1;
  
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <group>
      <VolumetricFloor />

      {/* Platforms for Furniture */}
      {/* Central Desk Platform */}
      <TechPlatform x={0} z={-8} width={6} depth={4} />

      {/* Side Desk Platforms */}
      <TechPlatform x={isMobile ? -5 : -8} z={isMobile ? -5.5 : -4} width={4} depth={3} rotation={0.5} />
      <TechPlatform x={isMobile ? 5 : 8} z={isMobile ? -5.5 : -4} width={4} depth={3} rotation={-0.5} />

      {/* Lounge Platforms */}
      <TechPlatform x={isMobile ? 7.5 : 9} z={isMobile ? 2 : 5} width={5} depth={5} color="#bd00ff" rotation={-0.5} />
      <TechPlatform x={isMobile ? -7.5 : -9} z={isMobile ? 2 : 5} width={5} depth={5} color="#bd00ff" rotation={0.5} />

      {/* Racks Platform - Long strip at back */}
      <TechPlatform x={0} z={-14.5} width={22} depth={3} />

      {/* Walkways */}
      {/* Center to Left Desk */}
      <TechWalkway start={[0, 0, -8]} end={[isMobile ? -5 : -8, 0, isMobile ? -5.5 : -4]} width={2} yOffset={0.001} />
      {/* Center to Right Desk */}
      <TechWalkway start={[0, 0, -8]} end={[isMobile ? 5 : 8, 0, isMobile ? -5.5 : -4]} width={2} yOffset={0.001} />
      {/* Center to Back Racks */}
      <TechWalkway start={[0, 0, -8]} end={[0, 0, -14.5]} width={3} />
      {/* Center to Front */}
      <TechWalkway start={[0, 0, -8]} end={[0, 0, isMobile ? 2 : 3]} width={3} yOffset={0.001} />
      {/* Center Extension (Cross) */}
      <TechWalkway start={[0, 0, isMobile ? 2 : 3]} end={[0, 0, isMobile ? 22 : 10]} width={3} />
      
      {/* Left Desk to Left Lounge */}
      <TechWalkway start={[isMobile ? -5 : -8, 0, isMobile ? -5.5 : -4]} end={[isMobile ? -7.5 : -9, 0, isMobile ? 2 : 5]} width={2} color="#bd00ff" />
      {/* Right Desk to Right Lounge */}
      <TechWalkway start={[isMobile ? 5 : 8, 0, isMobile ? -5.5 : -4]} end={[isMobile ? 7.5 : 9, 0, isMobile ? 2 : 5]} width={2} color="#bd00ff" />
      {/* Horizontal Lounge Connection */}
      <TechWalkway start={[isMobile ? -5.0 : -6.5, 0, isMobile ? 2 : 3]} end={[isMobile ? 5.0 : 6.5, 0, isMobile ? 2 : 3]} width={2.5} color="#bd00ff" yOffset={0.003} />

      {/* Glass Floor Segments (Filling the voids) */}
      {/* Front-Left Quad */}
      <GlassFloorPolygon vertices={[
          [-1.5, -6], 
          [isMobile ? -5 : -8, isMobile ? -5.5 : -4], 
          [isMobile ? -5.0 : -6.5, (isMobile ? 2 : 3) - 1.25], 
          [-1.5, (isMobile ? 2 : 3) - 1.25]
      ]} />
      {/* Front-Right Quad */}
      <GlassFloorPolygon vertices={[
          [1.5, -6], 
          [isMobile ? 5 : 8, isMobile ? -5.5 : -4], 
          [isMobile ? 5.0 : 6.5, (isMobile ? 2 : 3) - 1.25], 
          [1.5, (isMobile ? 2 : 3) - 1.25]
      ]} />
      
      {/* New Entrance-Left Quad (Filling the cross) */}
      <GlassFloorPolygon vertices={[
          [-1.5, (isMobile ? 2 : 3) + 1.25], [isMobile ? -5.0 : -6.5, (isMobile ? 2 : 3) + 1.25], [isMobile ? -5.0 : -6.5, isMobile ? 22 : 10], [-1.5, isMobile ? 22 : 10]
      ]} />
      {/* New Entrance-Right Quad (Filling the cross) */}
      <GlassFloorPolygon vertices={[
          [1.5, (isMobile ? 2 : 3) + 1.25], [isMobile ? 5.0 : 6.5, (isMobile ? 2 : 3) + 1.25], [isMobile ? 5.0 : 6.5, isMobile ? 22 : 10], [1.5, isMobile ? 22 : 10]
      ]} />

      {/* Side Triangles (Filling the gap between desk/lounge/walkway) */}
      {/* Left */}
      <GlassFloorPolygon vertices={[
          [isMobile ? -5 : -8, isMobile ? -5.5 : -4],
          [isMobile ? -5.0 : -6.5, (isMobile ? 2 : 3) - 1.25],
          [isMobile ? -5.0 : -6.5, (isMobile ? 2 : 3) + 1.25],
          [isMobile ? -7.5 : -9, isMobile ? 2 : 5]
      ]} />
      {/* Right */}
      <GlassFloorPolygon vertices={[
          [isMobile ? 5 : 8, isMobile ? -5.5 : -4],
          [isMobile ? 5.0 : 6.5, (isMobile ? 2 : 3) - 1.25],
          [isMobile ? 5.0 : 6.5, (isMobile ? 2 : 3) + 1.25],
          [isMobile ? 7.5 : 9, isMobile ? 2 : 5]
      ]} />

      {/* Screen Stand Platforms */}
      {/* SystemMetricsScreen Platform */}
      <TechPlatform x={isMobile ? -6 : -10.5} z={isMobile ? -11 : -8.5} width={2} depth={1.5} rotation={Math.PI / 6} />
      
      {/* DataFeedScreen Platform */}
      <TechPlatform x={isMobile ? 6 : 10.5} z={isMobile ? -11 : -8.5} width={2} depth={1.5} rotation={-Math.PI / 4} />

      {/* Back Screens Platforms */}
      {!isMobile && <TechPlatform x={-5} z={-12} width={2.5} depth={1.5} rotation={Math.PI / 12} />}
      {!isMobile && <TechPlatform x={5} z={-12} width={2.5} depth={1.5} rotation={-Math.PI / 12} />}

      {/* Ceiling */}
      <group position={[0, 12, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Ceiling Beams */}
        {[-12, -6, 0, 6, 12].map((x, i) => (
            <group key={`beam-${i}`} position={[x, -0.4, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[1, 0.8, 40]} />
                    <meshStandardMaterial color="#111" roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[0, -0.41, 0]} rotation={[Math.PI/2, 0, 0]}>
                    <planeGeometry args={[0.1, 38]} />
                    <meshBasicMaterial color="#bd00ff" toneMapped={false} opacity={0.8} transparent />
                </mesh>
            </group>
        ))}
        {/* Cross Beams */}
        {[-10, 0, 10].map((z, i) => (
             <mesh key={`cross-${i}`} position={[0, -0.2, z]} receiveShadow>
                <boxGeometry args={[40, 0.4, 1]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
             </mesh>
        ))}
      </group>

      {/* Particle Effect */}
      <FallingStreaks />

      <SystemMetricsScreen position={[isMobile ? -6 : -10.5, isMobile ? 5.5 : 4.5, isMobile ? -11 : -8.5]} rotation={[0, Math.PI / 6, 0]} scale={screenScale} />
      {isMobile ? (
        <MobilePanoramaScreen position={[0, 4.2, -14]} rotation={[0, 0, 0]} scale={screenScale} />
      ) : (
        <>
          <FlatScreen position={[0, 5, -14.5]} rotation={[0, 0, 0]} scale={screenScale} />
          <PromotionalScreen position={[-5, 4.5, -12]} rotation={[0, Math.PI / 12, 0]} scale={screenScale} />
          <ServicesScreen position={[5, 4.5, -12]} rotation={[0, -Math.PI / 12, 0]} scale={screenScale} />
        </>
      )}
      {/* Market Data Screen on the right */}
      <DataFeedScreen position={[isMobile ? 6 : 10.5, isMobile ? 6.0 : 5.0, isMobile ? -11 : -8.5]} rotation={[0, -Math.PI / 4, 0]} scale={screenScale} />

      {/* Walls */}
      <mesh position={[0, 6, -15]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#101010" roughness={0.5} metalness={0.2} />
      </mesh>
      <WallPanel position={[-15, 6, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WallPanel position={[15, 6, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Back Wall Border */}
      <group position={[0, 0, -14]}>
        <mesh position={[0, 11.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[30, 0.5, 2]} />
          <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[30, 0.5, 2]} />
          <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[-14.75, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 12, 2]} />
          <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[14.75, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 12, 2]} />
          <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Tech Walls / Server Racks */}
      <group 
        position={[0, 0, -14.5]}
      >
        
        {[-9, -4.5, 4.5, 9].map((x, i) => (
          <group key={i} position={[x, 6, 1]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2, 12, 1]} />
              <meshStandardMaterial color="#111" roughness={0.2} metalness={0.9} />
            </mesh>
            
            {/* Vertical Light Strips on Servers */}
            <mesh position={[-0.95, 0, 0.51]}>
                <boxGeometry args={[0.1, 12, 0.05]} />
                <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
            <mesh position={[0.95, 0, 0.51]}>
                <boxGeometry args={[0.1, 12, 0.05]} />
                <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={4} toneMapped={false} />
            </mesh>

            {[...Array(10)].map((_, j) => (
               <BlinkingLight key={j} position={[0, -4 + j * 0.8, 0.55]} isActive={false} />
            ))}
          </group>
        ))}
      </group>

      {/* Side Wall Pillars */}
      {[ -7, 0, 7 ].map((z, i) => (
          <GlowingPillar key={`left-${i}`} position={[-13, 6, z]} />
      ))}
      {[ -7, 0, 7 ].map((z, i) => (
          <GlowingPillar key={`right-${i}`} position={[13, 6, z]} />
      ))}

      {/* Central Command Center (Grounded) */}
      <group 
        position={[0, 0, -8]}
      >
        {/* Main Desk Structure */}
        <group position={[0, 0, 0]}>
            {/* Desktop */}
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[5, 0.05, 2]} />
              <meshStandardMaterial color="#080808" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Left Cabinet */}
            <mesh position={[-2, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.8, 1.8]} />
              <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Right Cabinet */}
            <mesh position={[2, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.8, 1.8]} />
              <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Back Panel */}
            <mesh position={[0, 0.6, -0.8]} castShadow receiveShadow>
               <boxGeometry args={[3.2, 0.4, 0.1]} />
               <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Desk Mat */}
            <mesh position={[0, 0.83, 0.4]} receiveShadow>
                <boxGeometry args={[2.5, 0.01, 1]} />
                <meshStandardMaterial color="#050505" roughness={0.9} />
            </mesh>
            {/* Desk Light Strips (Surround) */}
            {/* Front */}
            <mesh position={[0, 0.8, 1.0]}>
               <boxGeometry args={[5, 0.04, 0.04]} />
               <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
            {/* Back */}
            <mesh position={[0, 0.8, -1.0]}>
               <boxGeometry args={[5, 0.04, 0.04]} />
               <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
            {/* Left */}
            <mesh position={[-2.5, 0.8, 0]}>
               <boxGeometry args={[0.04, 0.04, 2]} />
               <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
            {/* Right */}
            <mesh position={[2.5, 0.8, 0]}>
               <boxGeometry args={[0.04, 0.04, 2]} />
               <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
        </group>

        {/* Chair */}
        <group position={[0, 0, 1.5]}>
            {/* Base */}
            <mesh position={[0, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.1, 8]} />
                <meshStandardMaterial color="#222" metalness={0.8} />
            </mesh>
            {/* Stem */}
            <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.7, 0.1, 0.7]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.9, 0.3]} rotation={[-0.1, 0, 0]} castShadow>
                <boxGeometry args={[0.6, 0.8, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
            </mesh>
            {/* Neon Accent on Chair */}
            <mesh position={[0, 0.9, 0.24]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[0.4, 0.6, 0.02]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
            </mesh>
        </group>

        {/* Desktop Items */}
        <group position={[0, 0.85, 0]}>
             {/* Advanced Keyboard */}
            <group position={[0, 0, 0.6]}>
                 <mesh castShadow>
                    <boxGeometry args={[0.8, 0.03, 0.28]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
                 {/* Keys Glow */}
                 <mesh position={[0, 0.016, 0]}>
                    <planeGeometry args={[0.76, 0.24]} />
                    <meshBasicMaterial color="#bd00ff" transparent opacity={0.4} />
                </mesh>
            </group>
            
            {/* Mouse */}
            <mesh position={[0.6, 0.015, 0.6]} castShadow>
                <capsuleGeometry args={[0.05, 0.12, 4, 8]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            
            {/* Triple Monitor Setup */}
             <group position={[0, 0.1, -0.2]}>
                {/* Center */}
                <MonitorScreen position={[0, 0.3, 0]} />
                {/* Left */}
                <MonitorScreen position={[-1.25, 0.3, 0.15]} rotation={[0, 0.3, 0]} />
                {/* Right */}
                <MonitorScreen position={[1.25, 0.3, 0.15]} rotation={[0, -0.3, 0]} />
             </group>
             
             {/* Holographic Elements around desk */}
             <group position={[-1.5, 0.5, 0]} rotation={[0, 0.3, 0]}>
                <StaticDataScreen />
             </group>
             <group position={[1.5, 0.5, 0]} rotation={[0, -0.3, 0]}>
                <StaticDataScreen />
             </group>
        </group>
      </group>

      {/* Extra Workstations */}
      <SideDesk position={[isMobile ? -5 : -8, 0, isMobile ? -5.5 : -4]} rotationY={0.5} scale={screenScale} />
      <SideDesk position={[isMobile ? 5 : 8, 0, isMobile ? -5.5 : -4]} rotationY={-0.5} scale={screenScale} />

      {/* Lounge Area */}
      <group 
        position={[isMobile ? 7.5 : 9, 0, isMobile ? 2 : 5]} 
        rotation={[0, -0.5, 0]}
        onClick={(e) => { e.stopPropagation(); onHotspotSelect?.('lounge'); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover('lounge'); }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(null); }}
      >
          {activeHotspot === 'lounge' && <LoungeParticles />}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.01, 0]}>
              <circleGeometry args={[isMobile ? 1.5 : 2.5, 32]} />
              <meshStandardMaterial color="#101012" roughness={0.8} />
          </mesh>
          <group position={[0, 0.5, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                  <boxGeometry args={[4, 1, 1.5]} />
                  <meshStandardMaterial color="#151518" roughness={0.4} metalness={0.1} />
              </mesh>
              <mesh position={[0, 0.75, -0.5]} castShadow>
                  <boxGeometry args={[4, 0.5, 0.5]} />
                  <meshStandardMaterial color="#151518" roughness={0.4} metalness={0.1} />
              </mesh>
          </group>
          
          <mesh position={[-3, 0.5, 0]} castShadow>
              <boxGeometry args={[1.5, 0.2, 1.5]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
          </mesh>
      </group>

      {/* Second Lounge Area (Mirrored) */}
      <group position={[isMobile ? -7.5 : -9, 0, isMobile ? 2 : 5]} rotation={[0, 0.5, 0]}>
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.01, 0]}>
              <circleGeometry args={[isMobile ? 1.5 : 2.5, 32]} />
              <meshStandardMaterial color="#101012" roughness={0.8} />
          </mesh>
          <group position={[0, 0.5, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                  <boxGeometry args={[4, 1, 1.5]} />
                  <meshStandardMaterial color="#151518" roughness={0.4} metalness={0.1} />
              </mesh>
              <mesh position={[0, 0.75, -0.5]} castShadow>
                  <boxGeometry args={[4, 0.5, 0.5]} />
                  <meshStandardMaterial color="#151518" roughness={0.4} metalness={0.1} />
              </mesh>
          </group>
          <mesh position={[3, 0.5, 0]} castShadow>
              <boxGeometry args={[1.5, 0.2, 1.5]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
          </mesh>
      </group>

      {/* Decorative Plant */}
      <FuturisticPlant position={[isMobile ? -7 : -15, 0, -10]} scale={screenScale} />

    </group>
  );
}
