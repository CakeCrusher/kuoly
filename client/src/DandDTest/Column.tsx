import { timeStamp } from "console"
import React from "react"
import styled from "styled-components"
import Task from "./Task"
import {Droppable} from "react-beautiful-dnd"


const Container = styled.div`
margin: 8px;
border: 1px solid #ccc;
border-radius: 4px;
width: 300px;

display: flex;
flex-direction: column;
`
const Title = styled.h3`
padding: 8px;
`
const TaskList = styled.div`
padding: 8px;
background-color: ${(props: any) => (props.isDraggingOver ? "lightblue" : "white")};
flex-grow: 1;
min-height: 100px;
`

class InnerList extends React.Component {
  // shouldComponentUpdate(nextProps: any) {
  //   if (nextProps.tasks = this.props.tasks) {
  //     return false
  //   }
  //   return true
  // }
  render() {
    return this.props.tasks.map((task: any, index) => 
      <Task key={task.id} task={task} index={index}/>
    )
  }
}

class Column extends React.Component {
  render() {
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable
          droppableId={this.props.column.id}
          type={this.props.column.id === "column-3" ? "done" : "active"}
          isDropDisabled={this.props.isDropDisabled}
        >
          {(provided: any, snapshot: any) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              <InnerList tasks={this.props.tasks} />
              {provided.placeholder}
             </TaskList>
          )}
        </Droppable>
      </Container>
    )
  }
}

export default Column