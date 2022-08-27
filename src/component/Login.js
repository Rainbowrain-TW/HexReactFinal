import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const mySwal = withReactContent(Swal);

//function POIDetail({ Name, Toldescribe: FullDesc, Description: Desc, Tel, Add, Picture1: picUrl, Picdescribe1: picDesc }) {
function Login() {

  const nav = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const { Name, Toldescribe: FullDesc, Description: Desc, Tel, Add, Picture1: picUrl, Picdescribe1: picDesc } = data;



  function CallAPI() {
    useEffect(() => {
      fetch("https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c")
        .then(res => res.json())
        .then(result => {
          const newData = result.data.XML_Head.Infos.Info.filter(v => v.Id == id)[0];
          console.log('newData');
          console.log(newData);
          setData(newData)
        })
    }, [])
  }

  function showAlert() {
    mySwal.fire({
      title: <h4>Hello S W A L</h4>,
      // didOpen: () => { mySwal.showLoading() },
    }).then(() => {
      return mySwal.fire(<p>short work ??</p>)
    })
  }

  return (
    <>
      <h1>Login</h1>
      <button onClick={() => {
        console.log('button clicked');
        showAlert();
      }
      }>Call Swal</button>
    </>
  );
}

export default Login;