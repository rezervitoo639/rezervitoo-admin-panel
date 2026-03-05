import { useState, useEffect, useRef } from "react";
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import styles from "./ImageViewer.module.css";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lastClickTime = useRef(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime.current;

    if (timeDiff < 300) {
      // Double click detected
      if (e.button === 0) {
        // Left double-click: zoom in
        handleZoomIn();
      } else if (e.button === 2) {
        // Right double-click: zoom out
        handleZoomOut();
      }
    }

    lastClickTime.current = currentTime;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDoubleClick(e);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          <IconX size={24} />
        </button>

        {/* Zoom Controls */}
        <div className={styles.zoomControls}>
          <button className={styles.zoomButton} onClick={handleZoomOut}>
            <IconZoomOut size={20} />
          </button>
          <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
          <button className={styles.zoomButton} onClick={handleZoomIn}>
            <IconZoomIn size={20} />
          </button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={handlePrevious}
            >
              <IconChevronLeft size={32} />
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={handleNext}
            >
              <IconChevronRight size={32} />
            </button>
          </>
        )}

        {/* Image */}
        <div
          ref={imageRef}
          className={styles.imageContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
          style={{
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "pointer",
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className={styles.image}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease",
            }}
            draggable={false}
          />
        </div>

        <div className={styles.hint}>
          Left double-click to zoom in • Right double-click to zoom out • Drag
          to pan when zoomed
        </div>
      </div>
    </div>
  );
}
