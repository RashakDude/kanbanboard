import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import mockData from "../../mockData";
import Card from "../card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import "./kanban.scss";

const Kanban = () => {
  const [data, setData] = useState(mockData);
  const [newTaskTitles, setNewTaskTitles] = useState({
    column1: "",
    column2: "",
    column3: "",
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = data.findIndex(
        (e) => e.id === destination.droppableId
      );

      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];

      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];

      const [removed] = sourceTask.splice(source.index, 1);
      destinationTask.splice(destination.index, 0, removed);

      data[sourceColIndex].tasks = sourceTask;
      data[destinationColIndex].tasks = destinationTask;

      setData([...data]);
    }
  };

  const handleAddTask = (columnId) => {
    if (newTaskTitles[columnId].trim() !== "") {
      const columnIndex = data.findIndex((e) => e.id === columnId);
      const newTask = {
        id: `task-${Math.random()}`,
        title: newTaskTitles[columnId],
      };

      const newData = [...data];
      newData[columnIndex].tasks = [...newData[columnIndex].tasks, newTask];

      setData(newData);

      // Clear the input field after adding the task
      setNewTaskTitles({
        ...newTaskTitles,
        [columnId]: "",
      });
    }
  };

  const handleDeleteTask = (columnId, taskId) => {
    const columnIndex = data.findIndex((e) => e.id === columnId);
    const newTasks = data[columnIndex].tasks.filter((task) => task.id !== taskId);

    const newData = [...data];
    newData[columnIndex].tasks = newTasks;

    setData(newData);
  };

  const handleInputChange = (columnId, value) => {
    setNewTaskTitles({
      ...newTaskTitles,
      [columnId]: value,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban">
        {data.map((section) => (
          <Droppable key={section.id} droppableId={section.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                className="kanban__section"
                ref={provided.innerRef}
              >
                <div className="kanban__section__title">{section.title}</div>
                <div className="kanban__section__content">
                  {section.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? "0.5" : "1",
                          }}
                        >
                          <Card
                            handleDeleteTask={() => handleDeleteTask(section.id, task.id)}
                          >
                            {task.title}
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <div className="kanban__section__content__actions">
                    <input
                      type="text"
                      value={newTaskTitles[section.id]}
                      onChange={(e) => handleInputChange(section.id, e.target.value)}
                    />
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="kanban__icon"
                      onClick={() => handleAddTask(section.id)}
                    />
                  </div>
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
