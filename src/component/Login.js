import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useForm } from "react-hook-form";
import { getCookie } from '../js/MyCookie';
import { useAuth } from "./Context";

const mySwal = withReactContent(Swal);
let isChecked = false;

console.log('login page calling');

// function CheckToken() {
//   if (isChecked) return;
//   isChecked = true;

//   fetch('https://todoo.5xcamp.us/check', {
//     headers: {
//       'Authorization': getCookie('token')
//     }
//   }).
//     then(res => {
//       if (res.status == 200) {
//         //nav('/todo');
//         console.log("Checktoken token 已存在!!!!!!!!!!!!!!!!!!!!!!");
//         console.log('window.location.href :>> ', window.location.href);
//         if (window.location.pathname != '/todo') {
//           window.location.href = 'http://localhost:3000/todo';
//         }
//       }
//     })
// }

function Login() {
  const { token, setToken } = useAuth();
  const nav = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {
    console.log('submit');
    console.log(data);
    SignIn(data);
  };

  function SignIn(data) {

    fetch("https://todoo.5xcamp.us/users/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: data })
    })
      .then(res => {
        console.log('res.status :>> ', res.status);
        console.log(res.headers.get('authorization'));
        if (res.status == 200) {
          document.cookie = `token=${res.headers.get('authorization')}`;
          setToken({ ...token, auth: res.headers.get('authorization') });
        }
        return res.json();
      })
      .then(result => {
        console.log('result');
        console.log(result);

        if (result.message != "登入成功") {
          showAlert("登入失敗，請檢查您輸入的 Email 或密碼")
        } else {
          document.cookie = `id=${result.email}`;
          document.cookie = `name=${result.nickname}`;
          setToken({
            email: result.email,
            nickname: result.nickname
          })
        }
      })
  }

  function CheckAuth() {
    fetch('https://todoo.5xcamp.us/check', {
      headers: {
        'Authorization': getCookie('token')
      }
    }).
      then(res => {
        if (res.status == 200) {
          nav('/todo');
        }
      })
  }

  //CheckAuth()

  function showAlert(msg) {
    mySwal.fire({
      text: msg,
      // didOpen: () => { mySwal.showLoading() },
    }).then(() => {
      // return mySwal.fire(<p>short work ??</p>)
    })
  }

  return (
    <>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
          <div className="side">
            <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
          </div>
          <div>
            <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
              <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                {...register("email", {
                  required: { value: true, message: "此欄位不可留空" },
                  pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: "不符合 Email 規則" }
                })} />
              {errors.email?.message ? <span>{errors.email?.message}</span> : ""}
              <label className="formControls_label" htmlFor="pwd" >密碼</label>
              <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼"
                {...register("password", {
                  required: { value: true, message: "此欄位不可留空" },
                  minLength: { value: 4, message: "密碼至少要6個字元" }
                })} />
              {errors.password?.message ? <span>{errors.password?.message}</span> : ""}
              <input className="formControls_btnSubmit" type="submit" value="登入" />
              <a className="formControls_btnLink" href="/register">註冊帳號</a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;