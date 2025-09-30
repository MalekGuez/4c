"use client";

import { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export default function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className = ''
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate visible range - adjust for grid layout
  const visibleRange = useMemo(() => {
    const itemsPerRow = 4;
    const visibleRows = Math.ceil(containerHeight / itemHeight);
    const startRow = Math.floor(scrollTop / itemHeight);
    const endRow = Math.min(startRow + visibleRows, Math.ceil(items.length / itemsPerRow) - 1);

    const startIndex = startRow * itemsPerRow;
    const endIndex = Math.min((endRow + 1) * itemsPerRow - 1, items.length - 1);

    return {
      startIndex: Math.max(0, startIndex - overscan * itemsPerRow),
      endIndex: Math.min(items.length - 1, endIndex + overscan * itemsPerRow)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange.startIndex, visibleRange.endIndex]);

  // Remove container scroll handler since we're using window scroll

  // Calculate total height - adjust for grid layout (4 columns) with proper spacing
  const itemsPerRow = 4;
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const rowGap = 20; // Gap between rows
  const totalHeight = (totalRows * (itemHeight + rowGap)) + 50; // Reduced extra space at bottom

  // Calculate offset for visible items - adjust for grid layout with row gaps
  const startRow = Math.floor(visibleRange.startIndex / itemsPerRow);
  const offsetY = startRow * (itemHeight + rowGap);

  // Use window scroll instead of container scroll
  useEffect(() => {
    const handleWindowScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className={className}
      style={{
        height: 'auto',
        overflow: 'visible',
        position: 'relative',
        backgroundColor: 'transparent'
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            rowGap: '20px',
            columnGap: '20px',
            justifyContent: 'center',
            alignItems: 'start',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.startIndex + index}
              style={{
                height: itemHeight,
                position: 'relative'
              }}
            >
              {renderItem(item, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
