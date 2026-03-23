// /Users/macbookair/Documents/IllusionTech-Development/components/home/tech-preview/CameraController.tsx

import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';

export type ViewState = 'overview' | 'closeup' | 'left' | 'right' | 'lounge' | 'desktop' | 'monitor';
export type RotationSpeed = 'Static' | 'Subtle' | 'Standard' | 'Dynamic';

interface CameraControllerProps {
  view: ViewState;
  rotationSpeed: RotationSpeed;
}

const rotationMultipliers: Record<RotationSpeed, { x: number; y: number }> = {
  Static: { x: 0, y: 0 },
  Subtle: { x: 0.1, y: 0.05 },
  Standard: { x: 1.0, y: 0.5 },
  Dynamic: { x: 2.0, y: 0.75 },
};

const desktopViews: Record<ViewState, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    position: [0, 6, 14],
    target: [0, 5, 0],
  },
  closeup: {
    position: [0, 3, 2],
    target: [0, 1, -8],
  },
  left: {
    position: [-12, 5, 2],
    target: [0, 2, -6],
  },
  right: {
    position: [12, 5, 2],
    target: [0, 2, -6],
  },
  lounge: {
    position: [5, 3, 8],
    target: [9, 1, 5],
  },
  desktop: {
    position: [0, 3, 6],
    target: [0, 1, -8],
  },
  monitor: {
    position: [0, 1.5, -4],
    target: [0, 1.2, -9],
  }
};

const mobileViews: Record<ViewState, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    position: [0, 8, 18],
    target: [0, 2, -5],
  },
  closeup: {
    position: [0, 3.5, 7],
    target: [0, 1, -5],
  },
  left: {
    position: [-15, 6, 5],
    target: [0, 2, -6],
  },
  right: {
    position: [15, 6, 5],
    target: [0, 2, -6],
  },
  lounge: {
    position: [8, 3, 12],
    target: [9, 1, 5],
  },
  desktop: {
    position: [0, 3, 8],
    target: [0, 1, -8],
  },
  monitor: {
    position: [0, 1.5, -4],
    target: [0, 1.2, -9],
  }
};

export default function CameraController({ view, rotationSpeed }: CameraControllerProps) {
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));
  const introRef = useRef(true);
  const { size, camera } = useThree();
  const isMobile = size.width < 768;
  
  const [tilt, setTilt] = useState<{ beta: number | null, gamma: number | null }>({ beta: null, gamma: null });
  const initialTilt = useRef<{ beta: number, gamma: number } | null>(null);

  useEffect(() => {
    // Disable parallax for the first second to let the camera settle
    const timer = setTimeout(() => (introRef.current = false), 1000);
    return () => clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') return;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;

      if (!initialTilt.current) {
        initialTilt.current = { beta, gamma };
      }
      setTilt({ beta, gamma });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isMobile]);
  
  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobile ? 60 : 45;
      camera.updateProjectionMatrix();
    }
  }, [isMobile, camera]);

  useFrame((state, delta) => {
    const currentViews = isMobile ? mobileViews : desktopViews;
    const currentView = currentViews[view];
    let multiplier = rotationMultipliers[rotationSpeed] || rotationMultipliers.Static;

    // Limit rotation for side views
    if (view === 'left' || view === 'right') {
      multiplier = { x: multiplier.x * 0.3, y: multiplier.y * 0.3 };
    }

    // Boost sensitivity on mobile devices to ensure rotation feels fast and responsive
    if (isMobile) {
      multiplier = { x: multiplier.x * 2.5, y: multiplier.y * 2.5 };
    }

    const parallaxOffset = introRef.current ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(state.mouse.x * multiplier.x, 0, 0);

    const tiltOffset = new THREE.Vector3(0, 0, 0);
    if (isMobile && initialTilt.current && tilt.beta !== null && tilt.gamma !== null && rotationSpeed !== 'Static') {
      const deltaGamma = tilt.gamma - initialTilt.current.gamma;
      const deltaBeta = tilt.beta - initialTilt.current.beta;

      const tiltSensitivity = 1.5;

      // Apply tilt offset, similar to mouse parallax
      tiltOffset.x = (deltaGamma / 45) * tiltSensitivity; // Normalize by ~45 degrees
      tiltOffset.y = 0; // Disable vertical tilt
    }

    const totalOffset = parallaxOffset.add(tiltOffset);

    const targetPosition = new THREE.Vector3(...currentView.position).add(totalOffset);
    easing.damp3(state.camera.position, targetPosition, 0.4, delta);
    
    const lookAtTarget = new THREE.Vector3(...currentView.target);
    easing.damp3(targetVec.current, lookAtTarget, 0.4, delta);
    state.camera.lookAt(targetVec.current);
  });

  return null;
}
