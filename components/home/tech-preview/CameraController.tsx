// /Users/macbookair/Documents/IllusionTech-Development/components/home/tech-preview/CameraController.tsx

import { useRef, useEffect, useLayoutEffect } from 'react';
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
    position: [0, 4, 12],
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

  useEffect(() => {
    // Disable parallax for the first second to let the camera settle
    const timer = setTimeout(() => (introRef.current = false), 1000);
    return () => clearTimeout(timer);
  }, [view]);
  
  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobile ? 60 : 45;
      camera.updateProjectionMatrix();
    }
  }, [isMobile, camera]);

  useFrame((state, delta) => {
    const currentViews = isMobile ? mobileViews : desktopViews;
    const currentView = currentViews[view];
    const multiplier = { x: 0, y: 0 };

    const parallaxOffset = introRef.current ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(state.mouse.x * multiplier.x, state.mouse.y * multiplier.y, 0);

    const targetPosition = new THREE.Vector3(...currentView.position).add(parallaxOffset);
    easing.damp3(state.camera.position, targetPosition, 0.4, delta);
    
    const lookAtTarget = new THREE.Vector3(...currentView.target);
    easing.damp3(targetVec.current, lookAtTarget, 0.4, delta);
    state.camera.lookAt(targetVec.current);
  });

  return null;
}
