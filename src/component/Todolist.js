import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

//function POIDetail({ Name, Toldescribe: FullDesc, Description: Desc, Tel, Add, Picture1: picUrl, Picdescribe1: picDesc }) {
function Todolist() {

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

  return (
    <>
      <h1>Todolist</h1>
    </>
  );
}

export default Todolist;