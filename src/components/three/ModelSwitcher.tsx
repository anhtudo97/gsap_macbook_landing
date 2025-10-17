import { useRef } from "react";
import { PresentationControls } from "@react-three/drei";
import gsap from 'gsap';
import { Group, Object3D, Mesh, Material } from 'three';

import MacbookModel from "../models/Macbook";
import { useGSAP } from "@gsap/react";

interface ModelSwitcherProps {
  scale: number;
  isMobile: boolean;
}

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

const fadeMeshes = (group: Group | null, opacity: number): void => {
  if (!group) return;

  group.traverse((child: Object3D) => {
    if (child instanceof Mesh) {
      const material = child.material as Material & { transparent: boolean; opacity: number };
      material.transparent = true;
      gsap.to(material, { opacity, duration: ANIMATION_DURATION });
    }
  });
};

const moveGroup = (group: Group | null, x: number): void => {
  if (!group) return;

  gsap.to(group.position, { x, duration: ANIMATION_DURATION });
};

const ModelSwitcher: React.FC<ModelSwitcherProps> = ({ scale, isMobile }) => {
  const SCALE_LARGE_DESKTOP = 0.08;
  const SCALE_LARGE_MOBILE = 0.05;

  const smallMacbookRef = useRef<Group>(null);
  const largeMacbookRef = useRef<Group>(null);

  const showLargeMacbook: boolean = scale === SCALE_LARGE_DESKTOP || scale === SCALE_LARGE_MOBILE;

  useGSAP(() => {
    if (showLargeMacbook) {
      moveGroup(smallMacbookRef.current, -OFFSET_DISTANCE);
      moveGroup(largeMacbookRef.current, 0);

      fadeMeshes(smallMacbookRef.current, 0);
      fadeMeshes(largeMacbookRef.current, 1);
    } else {
      moveGroup(smallMacbookRef.current, 0);
      moveGroup(largeMacbookRef.current, OFFSET_DISTANCE);

      fadeMeshes(smallMacbookRef.current, 1);
      fadeMeshes(largeMacbookRef.current, 0);
    }
  }, [scale]);

  const controlsConfig = {
    snap: true,
    speed: 1,
    zoom: 1,
    azimuth: [-Infinity, Infinity] as [number, number],
    config: { mass: 1, tension: 0, friction: 26 }
  };

  return (
    <>
      <PresentationControls {...controlsConfig}>
        <group ref={largeMacbookRef}>
          <MacbookModel scale={isMobile ? 0.05 : 0.08} variant="16inch" />
        </group>
      </PresentationControls>

      <PresentationControls {...controlsConfig}>
        <group ref={smallMacbookRef}>
          <MacbookModel scale={isMobile ? 0.03 : 0.06} variant="14inch" />
        </group>
      </PresentationControls>
    </>
  );
};
export default ModelSwitcher;
