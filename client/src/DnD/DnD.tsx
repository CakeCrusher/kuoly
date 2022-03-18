import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";
import { DnDSortable } from "./DnDSortable";

const DnD = () => {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = <Draggable>Drag me</Draggable>;

  const handleDragEnd = (e: any) => {
    if (e.over && e.over.id === "droppable") {
      setIsDropped(true);
    } else {
      setIsDropped(false);
    }
  };

  return <DnDSortable />;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {isDropped ? null : draggableMarkup}
      <Droppable>{isDropped ? draggableMarkup : null}</Droppable>
    </DndContext>
  );
};
export default DnD;
