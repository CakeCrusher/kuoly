import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  MouseSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Item } from "./Item";

export const DnDSortable = () => {
  const [items, setItems] = useState(["1", "2", "3", "4", "5", "6", "7"]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    // useSensor(PointerSensor, {
    //   activationConstraint: {
    //     delay: 1000,
    //     tolerance: 500,
    //   },
    // }),
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDragStart = (e: DragEndEvent) => {
    setActiveId(e.active.id);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {items.map((id) => (
            <SortableItem key={id} id={id} hide={id === activeId} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? <SortableItem key={activeId} id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
