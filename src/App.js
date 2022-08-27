import './css/App.css';
import './css/all.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './component/Login';
import Register from './component/Register';
import Todolist from './component/Todolist';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='todo' element={<Todolist />} />
      </Routes>
    </>
  );
}

export default App;

/*
必做：需使用 React 框架來挑戰，並整合此任務提供的 API
必做：需使用 React Router，並統一部署到 GitHub Pages
必做：代辦為零筆資料時，需顯示文字「目前尚無代辦事項」
必做：新增代辦功能
必做：移除代辦功能
必做：切換代辦狀態(打勾表示已完成、未勾表示待完成)
必做：狀態頁籤切換功能(全部、待完成、已完成)
必做：確認待完成項目總數 (5 個待完成項目)
必做：清除已完成項目
必做：登入、註冊 API 功能
必做：表單欄位為空值或非 Email 格式時，需提醒用戶。(例：alert 彈跳、紅色文字顯示、SweetAlert2)
必做：需處理重複帳號註冊時， API 回傳錯誤時，需提醒用戶。(例：alert 彈跳、紅色文字顯示、SweetAlert2)
*/