import React, { useState } from "react";
// import "./styles.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Drag({ params }) {
    // debugger
    //   const defaultList = ["A", "B", "C", "D", "E"];
    // React state to track order of items
    const [itemList, setItemList] = useState(params);

    // Function to update list on drop
    const handleDrop = (droppedItem) => {
        // Ignore drop outside droppable container
        if (!droppedItem.destination) return;
        var updatedList = [...itemList];
        // Remove dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        // Add dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        // Update State
        setItemList(updatedList);
    };

    return (
        <div className="">
            <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="list-container">
                    {(provided) => (
                        <div
                            className="drag-condiner"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {itemList.map((item, index) => (
                                <Draggable key={item} draggableId={item} index={index}>
                                    {(provided) => (
                                        <div
                                            className="drag-child"
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                        >
                                            {item}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}