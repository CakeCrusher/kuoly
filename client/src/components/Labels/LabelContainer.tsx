import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import React, { KeyboardEvent, useState, useRef, useEffect } from "react";
import { IconButton } from "..";
import { Plus } from "../../assets";
import useLabelApolloHooks from "../../graphql/hooks/label";
import { useListingsFilter } from "../../state/store";
import { newOrdering } from "../../utils/functions";
import Label from "./Label";

import "./LabelContainer.less";

type Props = {
  isEditing?: boolean;
  catalogue: CatalogueType;
  labels: Label[];
};

const LabelContainer: React.FC<Props> = ({ isEditing, catalogue, labels }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [labelIds, setLabelIds] = useState<string[]>(
    labels.map((label) => label.id)
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const labelDragging: Label = labels.find((label) => label.id === draggingId)!;

  const { createLabel, deleteLabel, reorderLabel } = useLabelApolloHooks({
    catalogue_id: catalogue.id,
  });
  const { listingsFilter, setListingsFilter } = useListingsFilter();

  useEffect(() => {
    console.log("labelIds", labelIds);
    setLabelIds(labels.map((label) => label.id));
  }, [labels]);

  const handleAddLabel = () => {
    if (!inputRef.current) {
      throw new Error("Could not get labels input");
    }
    if (!containerRef.current) {
      throw new Error("Could not get labels container");
    }
    if (createLabel && isAdding) {
      if (inputRef.current.value !== "") {
        createLabel(inputRef.current.value);
        inputRef.current.value = "";
        setIsAdding(false);
      } else {
        // TODO: There should be some feedback for the user
        console.log("No empty input");
      }
    } else {
      setIsAdding(true);
      inputRef.current.focus();
    }
  };

  const inputKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && inputRef.current && createLabel) {
      handleAddLabel();
    }
  };

  const toggleListingFilter = (listingId: string) => {
    if (!isEditing) {
      // if listingsFilter.labelIds includes listingId, remove it
      if (listingsFilter.labelIds.includes(listingId)) {
        setListingsFilter({
          ...listingsFilter,
          labelIds: listingsFilter.labelIds.filter(
            (labelId) => labelId !== listingId
          ),
        });
      }
      // if not, add it
      else {
        setListingsFilter({
          ...listingsFilter,
          labelIds: [...listingsFilter.labelIds, listingId],
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.active.id !== event.over.id) {
      // reorder the dnd state
      setLabelIds((items) => {
        const oldIndex = items.indexOf(event.active.id);
        const newIndex = items.indexOf(event.over!.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      // update db
      reorderLabel(
        event.active.id,
        newOrdering(labels, event.active.id, event.over.id)
      );
    }
    setDraggingId(null);
  };

  const labelsFromIds = labelIds
    .map((labelId) => labels.find((label) => label.id === labelId)!)
    .filter((label) => label !== undefined);

  return (
    <div className="labels-container" ref={containerRef}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={labelIds} strategy={rectSortingStrategy}>
          {labelsFromIds.map((label: Label) => (
            <Label
              key={label.id}
              className={`label ${isEditing ? "can-delete" : ""}`}
              label={label}
              isEditing={isEditing}
              onClick={() => toggleListingFilter(label.id)}
              faint={!isEditing && !listingsFilter.labelIds.includes(label.id)}
              deleteLabel={(id) => deleteLabel(id, catalogue)}
              hide={label.id === draggingId}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {draggingId && (
            <Label
              key={labelDragging.id}
              className={`label ${isEditing ? "can-delete" : ""}`}
              label={labelDragging}
              isEditing={isEditing}
              onClick={() => toggleListingFilter(labelDragging.id)}
              faint={
                !isEditing &&
                !listingsFilter.labelIds.includes(labelDragging.id)
              }
              deleteLabel={(id) => deleteLabel(id, catalogue)}
            />
          )}
        </DragOverlay>
      </DndContext>
      {createLabel && isEditing && (
        <div className={`f-center add-label-group ${isAdding ? "adding" : ""}`}>
          <input
            ref={inputRef}
            onKeyDown={inputKeyDown}
            className="add-label-input"
            type="text"
            // closes when user clicks outside of the input
            onBlur={() => setIsAdding(false)}
          />
          <IconButton
            className="add-label-button"
            src={Plus}
            onClick={handleAddLabel}
          />
        </div>
      )}
    </div>
  );
};

export default LabelContainer;
