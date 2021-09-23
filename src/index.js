import "../src/index.css";
import reactDom from "react-dom";
import React from "react";
import Axios from "axios";

class TodoBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todosArray: [
        { todoText: undefined, todoId: undefined, dateCreated: undefined },
      ],
      todo: "",
      editTodo: "",
      todoId: "",
      dbId: undefined,
      reload: "false",
    };
    this.onClickAddTodo = this.onClickAddTodo.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.onClickRemoveTodo = this.onClickRemoveTodo.bind(this);
    this.onClickEditTodo = this.onClickEditTodo.bind(this);
    this.getDataFromDB = this.getDataFromDB.bind(this);
  }
  getDataFromDB() {
    const todosToSave = [];
    let dateCreated;
    let todoText;
    let todoId;
    let dbId;
    Axios.get("https://todo4153.herokuapp.com/read").then((response) => {
      if (response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          dateCreated = response.data[i].todosArray.dateCreated;
          todoText = response.data[i].todosArray.todoText;
          todoId = response.data[i].todosArray.todoId;
          dbId = response.data[i]._id;
          todosToSave.push({
            todoText: todoText,
            todoId: todoId,
            dateCreated: dateCreated,
            dbId: dbId,
          });
        }
        this.setState({ todosArray: todosToSave });
      }
    });
  }
  render() {
    return (
      <div id="todoBoardDiv">
        <h1>Todo List</h1>
        {}
        {this.state.todosArray.map((todo, index) => {
          if (todo.todoText !== undefined)
            return (
              <Todo
                onClickRemoveTodo={this.onClickRemoveTodo}
                key={index}
                todoName={todo.todoText}
                todoId={todo.todoId}
                todoDate={todo.dateCreated}
                dbId={todo.dbId}
                onClickEditTodo={this.onClickEditTodo}
                getDataFromDB={this.getDataFromDB}
              ></Todo>
            );
          else return "";
        })}
        <AddTodo
          onChange={this.handleChangeInput}
          onClickAddTodo={this.onClickAddTodo}
        />
      </div>
    );
  }
  uid() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  getCurrentDate() {
    const dateCreated = new Date();
    const month = dateCreated.getMonth();
    const day = dateCreated.getDate();
    const year = dateCreated.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onClickAddTodo() {
    if (this.state.todo !== "") {
      const uid = this.uid();
      const currentDate = this.getCurrentDate();
      const todoTextToSave = this.state.todo;
      const todoToSave = {
        todoText: todoTextToSave,
        todoId: uid,
        dateCreated: currentDate,
      };
      const todoArrayToSave = this.state.todosArray;
      todoArrayToSave.push(todoToSave);
      this.updateDB(todoTextToSave, uid, currentDate);
      this.setState({ todosArray: todoArrayToSave });
      this.getDataFromDB();
      // this.saveStateToLocalStorage();
    } else {
      return "";
    }
  }
  handleChangeInput(e) {
    let todo = e.target.value;
    this.setState({ todo: todo });
  }

  onClickRemoveTodo(dbId, todoId) {
    const todoArrayToSave = this.state.todosArray.filter((todo) => {
      if (todo.todoId !== todoId) return todo;
      else return "";
    });
    console.log(todoArrayToSave);
    this.setState({ todosArray: todoArrayToSave });
    this.removeFromDB(dbId);
    this.setState({ reload: !this.state.reload });
  }

  onClickEditTodo(editedTodo, todoId) {
    if (editedTodo !== "") {
      const todoArrayToSave = this.state.todosArray.map((todo) => {
        if (todo.todoId === todoId) {
          todo.todoText = editedTodo;

          return todo;
        }
        return todo;
      });
      this.setState({ todosArray: todoArrayToSave });
    } else {
      // this.saveStateToLocalStorage();
    }
  }
  saveStateToLocalStorage() {
    const todoArrayToJSON = JSON.stringify(this.state.todosArray);
    localStorage.setItem("todos", todoArrayToJSON);
  }
  getStateFromLocalStorage() {
    const todosFromStorage = localStorage.getItem("todos");
    if (todosFromStorage !== null) {
      const parsedTodos = JSON.parse(todosFromStorage);

      this.setState({ todosArray: parsedTodos });

      // this.getDataFromDB();
    }
  }
  componentDidMount() {
    // this.getStateFromLocalStorage();
    this.getDataFromDB();
  }
  // componentDidUpdate() {
  //   this.getDataFromDB();
  // }
  updateDB(todoText, todoId, dateCreated) {
    Axios.post("https://todo4153.herokuapp.com/insert", {
      todoText: todoText,
      todoId: todoId,
      dateCreated: dateCreated,
    });
  }
  removeFromDB(dbId) {
    console.log(dbId);
    Axios.delete(`https://todo4153.herokuapp.com/delete/${dbId}`);
    this.forceUpdate();
  }
}

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: "",
    };
    this.onChangeEditInput = this.onChangeEditInput.bind(this);
  }
  componentDidMount() {
    this.props.getDataFromDB();
  }
  render() {
    return (
      <div className="todo" id={this.props.todoId}>
        <p className="todoText">{this.props.todoName}</p>
        <p className="date">{this.props.todoDate}</p>
        <button
          onClick={() =>
            this.props.onClickRemoveTodo(this.props.dbId, this.props.todoId)
          }
          id={this.props.todoId}
          className="todoButtons"
        >
          X
        </button>
        <button
          onClick={() =>
            this.props.onClickEditTodo(this.state.edit, this.props.todoId)
          }
          id={this.props.todoId}
          className="todoButtons"
        >
          E
        </button>
        <EditTodo
          todo={this.props.todoName}
          onChangeEditInput={this.onChangeEditInput}
          id={this.props.todoId}
        />
      </div>
    );
  }
  onChangeEditInput(event) {
    const edit = event.target.value;
    this.setState({ edit: edit });
  }
}
class AddTodo extends React.Component {
  render() {
    return (
      <div id="addTodoDiv">
        <button onClick={this.props.onClickAddTodo} id="addTodoButton">
          Add Todo
        </button>
        <input onChange={this.props.onChange} type="text" />
      </div>
    );
  }
}
function EditTodo(props) {
  return (
    <input
      type="text"
      placeholder={props.todo}
      onChange={props.onChangeEditInput}
    />
  );
}
// function getDataFromDB() {
//   Axios.get("http://localhost:3001/read").then((response) => {
//     console.log(response.data);
//   });
// }
// getDataFromDB();
reactDom.render(<TodoBoard />, document.getElementById("root"));
// const addToList = () => {
//   const todosArray = localStorage.getItem("todos");

//   Axios.post("http://localhost:3001/insert", {
//     todosArray: [{ todosArray }],
//   });
// };
// addToList();
// todosArray: [{ todoName: "pizza", todoId: "2334", dateCreated: "1922" }],
