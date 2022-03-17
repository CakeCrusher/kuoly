import React from "react"
import styled from "styled-components"
import { Draggable } from "react-beautiful-dnd"

const Container = styled.div`
display: flex;
border: 1px solid #ccc;
padding: 8px;
margin-bottom: 8px;
background-color: ${(props: any) => (props.isDragging ? "lightgreen" : "white")};
`

const Handle = styled.div`
width: 10px;
height: 10px;
border-radius: 4px;
background-color: ${(props: any) => (props.isDragDisabled ? "red" : "orange")};
`

class Task extends React.Component {
  render() {
    const isDragDisabled = this.props.task.id === "task-1"
    return (
      <Draggable 
        draggableId={this.props.task.id}
        index={this.props.index}
        isDragDisabled={isDragDisabled}
      >
      {(provided: any, snapshot: any) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <Handle 
            {...provided.dragHandleProps}
            isDragDisabled={isDragDisabled}
          />
          {this.props.task.content[0]}
        </Container>
      )}

      </Draggable>
    )
  }
}

export default Task