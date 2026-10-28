import { useRef } from 'react';
import { demoIcon, folderSwatch } from '../config/demo';
import type { Cell, DemoItem } from '../config/demo';

interface Props {
  item: DemoItem;
  cell: Cell;
  tile: number;
  focused: boolean;
  canDrop: (cell: Cell) => boolean;
  onFocus: () => void;
  onOpen: () => void;
  onMove: (cell: Cell) => void;
}

const translate = (x: number, y: number) => `translate(${x}px, ${y}px)`;

export default function DemoTile({ item, cell, tile, focused, canDrop, onFocus, onOpen, onMove }: Props) {
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const baseX = cell[0] * tile;
  const baseY = cell[1] * tile;
  const iconSize = Math.round(tile * 0.45);
  const label = item.kind === 'file' ? item.label.replace(/\.[^.]+$/, '') : item.label;

  return (
    <button
      type="button"
      className="alc-tile"
      data-id={item.id}
      data-focused={focused || undefined}
      style={{
        width: tile,
        height: tile,
        transform: translate(baseX, baseY),
        fontSize: Math.round(tile * 0.14),
      }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (!d.moved && Math.hypot(dx, dy) < 4) return;
        d.moved = true;
        e.currentTarget.classList.add('is-dragging');
        e.currentTarget.style.transform = translate(baseX + dx, baseY + dy);
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (!d?.moved) return;
        const el = e.currentTarget;
        const target: Cell = [
          Math.round((baseX + e.clientX - d.x) / tile),
          Math.round((baseY + e.clientY - d.y) / tile),
        ];
        el.classList.remove('is-dragging');
        const ok = canDrop(target);
        el.style.transform = ok ? translate(target[0] * tile, target[1] * tile) : translate(baseX, baseY);
        el.dataset.justDragged = '1';
        onMove(target);
      }}
      onPointerCancel={(e) => {
        drag.current = null;
        e.currentTarget.classList.remove('is-dragging');
        e.currentTarget.style.transform = translate(baseX, baseY);
      }}
      onClick={(e) => {
        if (e.currentTarget.dataset.justDragged) {
          delete e.currentTarget.dataset.justDragged;
          return;
        }
        onFocus();
        onOpen();
      }}
      onFocus={onFocus}
    >
      <span className="alc-tile-icon" style={{ width: iconSize, height: iconSize }}>
        {item.kind === 'folder' ? (
          <span className="alc-folder" style={folderSwatch(item.color)}>
            <span aria-hidden="true">📁</span>
          </span>
        ) : (
          <img src={demoIcon(item.icon)} alt="" width={iconSize} height={iconSize} draggable={false} />
        )}
      </span>
      <span className="alc-tile-label">{label}</span>
    </button>
  );
}
