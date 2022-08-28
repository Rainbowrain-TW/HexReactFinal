import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useForm } from "react-hook-form";
import { getCookie } from '../js/MyCookie';
import { useAuth } from "./Context";

const mySwal = withReactContent(Swal);

function Register() {
  const nav = useNavigate();
  const { token, setToken } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => {
    console.log('submit');
    console.log(data);
    SignUp(data);
  };

  function SignUp(data) {

    fetch("https://todoo.5xcamp.us/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: data })
    })
      .then(res => {
        console.log('res.status :>> ', res.status);
        console.log(res.headers.get('authorization'));
        if (res.status == 201) {

        }
        return res.json();
      })
      .then(result => {
        console.log('result');
        console.log(result);

        if (result.message != "註冊成功") {
          showAlert("註冊失敗，您選擇的 Email 已被註冊")
        } else {
          console.log('註冊成功');
          mySwal.fire({
            text: "註冊成功，請從登入頁面登入",
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            console.log('跳轉 Login');
            nav('/login');
          })
        }
      })
  }

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
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
          <div className="side">
            <a href="#"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></a>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
          </div>
          <div>
            <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
              <h2 className="formControls_txt">註冊帳號</h2>
              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                {...register("email", {
                  required: { value: true, message: "此欄位不可留空" },
                  pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: "不符合 Email 規則" }
                })}
              />{errors.email?.message ? <span>{errors.email?.message}</span> : ""}
              <label className="formControls_label" htmlFor="name">您的暱稱</label>
              <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱"
                {...register("nickname", {
                  required: { value: true, message: <span>此欄位不可留空</span> },
                })}
              />{errors.nickname?.message ? <span>{errors.nickname?.message}</span> : ""}
              <label className="formControls_label" htmlFor="pwd">密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼"
                {...register("password", {
                  required: { value: true, message: "此欄位不可留空" },
                  minLength: { value: 6, message: "密碼至少要6個字元" }
                })} />{errors.password?.message ? <span>{errors.password?.message}</span> : ""}
              <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼"
                {...register("passwordConfirm", {
                  required: { value: true, message: "此欄位不可留空" },
                  minLength: { value: 6, message: "密碼至少要6個字元" },
                  validate: (val) => {
                    if (watch('password') !== val) {
                      return "密碼不一致";
                    }
                  }
                })} />{errors.passwordConfirm?.message ? <span>{errors.passwordConfirm?.message}</span> : ""}
              <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
              <a className="formControls_btnLink" href="/login">登入</a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;