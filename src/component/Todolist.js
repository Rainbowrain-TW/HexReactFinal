import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from './Context';
import { getCookie, deleteCookie } from '../js/MyCookie';

const defaultTodolist = [
  newTodoItem('1', '整理履歷', true),
  newTodoItem('2', '整理作品集', false),
  newTodoItem('3', '打開104履歷', false),
  newTodoItem('4', '完成六角React讀書會每日任務', false),
  newTodoItem('5', '買新椅子', true)
];

const defaultTodoFilter = "All"; // ["All", "Completed", "Uncompleted"]

function newTodoItem(id, content, completed_at) {
  return { id, content, completed_at }
}

// Component
function TodoInputer(props) {
  const { placeholder, value, setValue, todolist, setTodolist, auth } = props;

  function createTodo() {
    console.log(`新增待辦事項 - {${value}}`);
    if (value == "") {
      alert('請輸入待辦事項內容');
    } else {

      fetch("https://todoo.5xcamp.us/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth
        },
        body: JSON.stringify({ todo: { content: value } })
      })
        .then(res => {
          console.log('res.status :>> ', res.status);
          // console.log(res.headers.get('authorization'));
          if (res.status == 201) {
            return res.json();
          } else {
            console.log('新增失敗');
          }
        })
        .then(result => {
          console.log('result');
          console.log(result);
          const { id, content } = result;
          setTodolist([...todolist, newTodoItem(id, content, false)]);
          setValue("");
          document.querySelector('input[type=text]').focus()
        })
    }
  }

  return (
    <div className="inputBox">
      <input type="text" placeholder={placeholder} value={value} onChange={
        (e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key == "Enter") createTodo() }}
      />
      <a href="#" onClick={() => { createTodo() }}>
        <i className="fa fa-plus" ></i>
      </a>
    </div>
  )
}

// Component
function TodoItem(props) {
  const { id, content, completed_at, index, todolist, setTodolist, auth } = props;

  return (
    <li>
      <label className="todoList_label">
        <input className="todoList_input" type="checkbox" checked={completed_at}
          data-todoid={id}
          onChange={(e) => {
            console.log(`TodoItem Status Change to ${e.target.checked}}`);
            let todoid = e.target.getAttribute('data-todoid');
            console.log(`TodoItem Id = ${todoid}`);

            fetch(`https://todoo.5xcamp.us/todos/${todoid}/toggle`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": auth
              },
            })
              .then(res => {
                console.log('res.status :>> ', res.status);
                // console.log(res.headers.get('authorization'));
                if (res.status == 200) {
                  return res.json();
                } else {
                  console.log('切換狀態失敗');
                }
              })
              .then(result => {
                console.log('result');
                console.log(result);
              })

            const newTodolist = todolist.map((v) => v);
            newTodolist[index].completed_at = e.target.checked;
            console.log('newTodolist :>> ', newTodolist);
            setTodolist(newTodolist);
          }
          }
        />
        <span>{content}</span>
      </label>
      <a href="#">
        <i className="fa fa-times" data-todoid={id} onClick={(e) => {
          console.log(`todoitem ${index} trying remove`);
          let todoid = e.target.getAttribute('data-todoid');
          console.log(`TodoItem Id = ${todoid}`);

          fetch(`https://todoo.5xcamp.us/todos/${todoid}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": auth
            },
          })
            .then(res => {
              console.log('res.status :>> ', res.status);
              // console.log(res.headers.get('authorization'));
              if (res.status == 200) {
                return res.json();
              } else {
                console.log('刪除 TODO 失敗');
              }
            })
            .then(result => {
              console.log('result');
              console.log(result);
            })



          setTodolist(todolist.filter((v, i) => i != index));
        }}></i>
      </a>
    </li>
  )
}

function GetTodolist(auth, setTodolist) {
  if (!auth) return;
  // console.log('auth :>> ', auth);
  fetch("https://todoo.5xcamp.us/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth
    },
  })
    .then(res => {
      console.log('res.status :>> ', res.status);
      // console.log(res.headers.get('authorization'));
      if (res.status == 200) {
        IsInitialized = true;
        return res.json();
      } else {
        console.log('查詢 Todolist 失敗');
      }
    })
    .then(result => {
      console.log('result');
      console.log(result);
      setTodolist(result.todos);
    })
}

let IsInitialized = false;

function Todolist() {
  // hooks
  // const [todolist, setTodolist] = useState(defaultTodolist);
  const [todolist, setTodolist] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [todoFilter, setTodoFilter] = useState(defaultTodoFilter)
  const [data, setData] = useState({});
  const { token, setToken } = useAuth();

  // variables
  const nav = useNavigate();
  const { nickname, auth } = token;

  if (!nickname || !auth) {
    setToken({ ...token, nickname: getCookie('name'), auth: getCookie('token') })
  }

  // console.log('auth in todolist :>> ', auth);
  // console.log('IsInitialized :>> ', IsInitialized);

  useEffect(() => {
    GetTodolist(auth, setTodolist);
  }, [])

  // if (!IsInitialized) {
  // }

  // functions
  function changeTab(e) {
    const currentTab = document.querySelector('.todoList_tab a.active');
    currentTab.classList.remove('active');
    e.target.classList.add('active');
    setTodoFilter(e.target.getAttribute('data-displaytype'))
  }

  function checkDisplayType(todo) {
    if ((todoFilter == "All") ||
      (todoFilter == "Completed" && todo.completed_at) ||
      (todoFilter == "Uncompleted" && !todo.completed_at)
    ) return true;
    return false;
  }

  function logOut() {
    console.log('登出中');
    deleteCookie('token');
    deleteCookie('id');
    deleteCookie('name');
    console.log('Cookie已刪除');
    setToken({});
    nav('/login');
  }

  function SignOut() {
    fetch("https://todoo.5xcamp.us/users/sign_out", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth
      }
    })
      .then(res => {
        console.log('res.status :>> ', res.status);
        // console.log(res.headers.get('authorization'));
        if (res.status == 200) {
          console.log('登出中');
          deleteCookie('token');
          deleteCookie('id');
          deleteCookie('name');
          console.log('Cookie已刪除');
          setToken({});
          nav('/login');
        }
      })
  }

  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1><a href="#">ONLINE TODO LIST</a></h1>
          <ul>
            <li className="todo_sm"><a href="#"><span>{nickname || "不明人士"}的代辦</span></a></li>
            <li><a onClick={() => { SignOut() }}>登出</a></li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <TodoInputer placeholder={"請輸入您的待辦事項"} value={todoInput} setValue={setTodoInput}
              todolist={todolist} setTodolist={setTodolist} auth={auth}
            />

            <div className="todoList_list">
              <ul className="todoList_tab">
                <li><a href="#" data-displaytype="All" className="active" onClick={(e) => changeTab(e)}>全部</a></li>
                <li><a href="#" data-displaytype="Uncompleted" onClick={(e) => changeTab(e)}>待完成</a></li>
                <li><a href="#" data-displaytype="Completed" onClick={(e) => changeTab(e)}>已完成</a></li>
              </ul>
              <div className="todoList_items">
                {todolist.length == 0 ? <div className="noTodo_hint">目前尚無代辦事項</div> : ""}
                <ul className="todoList_item">
                  {
                    todolist.map((todo, i) => {
                      if (checkDisplayType(todo)) {
                        return (
                          <TodoItem key={i} index={i} content={todo.content} completed_at={todo.completed_at || false}
                            todolist={todolist} id={todo.id} auth={auth} setTodolist={setTodolist} />
                        )
                      }
                    })
                  }
                </ul>
                <div className="todoList_statistics">
                  <p> {(todolist.filter((todo) => !todo.completed_at)).length} 個待完成項目 </p>
                  <a onClick={() => {
                    console.log("remove all completed todo");

                    const preRemoveTodolist = todolist.filter((todo) => todo.completed_at)
                    console.log('preRemoveTodolist :>> ', preRemoveTodolist);

                    preRemoveTodolist.forEach(todo => {

                      fetch(`https://todoo.5xcamp.us/todos/${todo.id}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": auth
                        },
                      })
                        .then(res => {
                          console.log('res.status :>> ', res.status);
                          //console.log(res.headers.get('authorization'));
                          if (res.status == 200) {
                            return res.json();
                          } else {
                            console.log('刪除 TODO 失敗');
                          }
                        })
                        .then(result => {
                          console.log('result');
                          console.log(result);
                        })
                    })

                    setTodolist(todolist.filter((todo) => !todo.completed_at));
                  }}>清除已完成項目</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todolist;