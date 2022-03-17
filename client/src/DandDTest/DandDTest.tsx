import React from "react";
import Column from "./Column"
import {DragDropContext} from "react-beautiful-dnd"
import styled from "styled-components"

const Container = styled.div`
display: flex;
`

class DandDTest extends React.Component {
  state: any = {
    tasks: {
      "task-1": { id: "task-1", content: "Take out the garbage" },
      "task-2": { id: "task-2", content: "Watch my favorite show" },
      "task-3": { id: "task-3", content: "Charge my phone" },
      "task-4": { id: "task-4", content: "Cook dinner" },
      "task-5": { id: "task-5", content: "Wash the dishes" }
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "To do",
        taskIds: ["task-1", "task-2", "task-3", "task-4", "task-5"]
      },
      "column-2": {
        id: "column-2",
        title: "In progress",
        taskIds: []
      },
      "column-3": {
        id: "column-3",
        title: "Done",
        taskIds: []
      }
    },
    columnOrder: ["column-1", "column-2", "column-3"]
  }

  onDragStart = (start: any, provided: any) => {
    provided.announce(
      `you have lifted the task`
    )
    document.body.color = "orange"
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId)
    this.setState({ homeIndex })
  }

  onDragUpdate = (update: any) => {
    const { destination } = update
    const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`
  }

  onDragEnd = result => {
    this.setState({
      homeIndex: null
    })
    document.body.color = "inherit"
    const {destination, source, draggableId} = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }
    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }
      this.setState(newState)
      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }
    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    this.setState(newState)

  }



  render() {
    return (
      <DragDropContext
      onDragStart={this.onDragStart}  
      onDragEnd={this.onDragEnd}
      onDragUpdate={this.onDragUpdate}        
      >
        <Container>
        {this.state.columnOrder.map((columnId: string, index: any) => {
          const column = this.state.columns[columnId]
          const tasks = column.taskIds.map((taskId: string) => this.state.tasks[taskId])
          const isDropDisabled = index < this.state.homeIndex
          return <Column key={column.id} isDropDisabled={isDropDisabled} column={column} tasks={tasks} />
        })}
        </Container>
      </DragDropContext>
    )
  }
}

export default DandDTest;