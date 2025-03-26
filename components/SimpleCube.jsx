"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function SimpleCube() {
  const mountRef = useRef(null);
  const cubeRef = useRef(null);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    console.log("Initializing Three.js scene...");

    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.innerHTML = ""; // Ensure it's empty before adding

    if (!mountRef.current.hasChildNodes()) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Handle Camera Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Create Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubeRef.current = cube;

    // Handle Mouse Interactions
    let targetZoom = 5;

    const handleWheel = (event) => {
      const zoomFactor = 1.05; // Adjust zoom sensitivity
      if (event.deltaY < 0) {
        targetZoom /= zoomFactor; // Zoom in
      } else {
        targetZoom *= zoomFactor; // Zoom out
      }

      targetZoom = THREE.MathUtils.clamp(targetZoom, 1, 10); // Prevent extreme zooming
    };

    // Smoothly interpolate zoom changes
    const animateZoom = () => {
      camera.position.z += (targetZoom - camera.position.z) * 0.1; // Smooth transition
    };

    const handleMouseDown = (event) => {
      isDragging.current = true;
      prevMouse.current = { x: event.clientX, y: event.clientY };
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (event) => {
      if (!isDragging.current || !cubeRef.current) return null;
      const deltaX = event.clientX - prevMouse.current.x;
      const deltaY = event.clientY - prevMouse.current.y;

      cubeRef.current.rotation.x += deltaY * 0.01;
      cubeRef.current.rotation.y += deltaX * 0.01;

      prevMouse.current = { x: event.clientX, y: event.clientY };
    };

    renderer.domElement.addEventListener("wheel", handleWheel);
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);

    // Animation only for rendering
    let animationFrameId;
    const animate = () => {
      animateZoom();
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Clean Up
    return () => {
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("resize", handleResize);

      cancelAnimationFrame(animationFrameId);

      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      scene.remove(cubeRef.current);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full"></div>;
}
