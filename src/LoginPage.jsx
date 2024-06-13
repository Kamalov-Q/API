/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [raqam, setRaqam] = useState("");
    const [parol, setParol] = useState("");
    const navigate = useNavigate();
    console.log(raqam, parol);
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify({
            phone_number: raqam,
            password: parol
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
           .then((response) => response.json())
           .then((data) => {
              console.log(data?.data?.tokens?.accessToken?.token);
              if(data?.success === true) {
                toast.success(data?.message)
                sessionStorage.setItem("accessToken", data?.data?.tokens?.accessToken?.token);
                navigate('/home');
              }
              else {
                toast.error(data?.message);
                navigate('/');
              }
           })
           .catch((err) => {
              console.log(err.message);
           });
      }
    const token = sessionStorage.getItem("accessToken");
    useEffect(() => {
        if(token && token.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
            navigate('/home');
        }
        else {
          navigate("/")
        }
      })
  return (
    <div>
      <div className="container d-flex justify-content-center align-items-center" style={{width:"100vw", height:"100vh"}}>
        <div className="row">
          <div className="col-lg-12 p-lg-5">
          <form className="form form-control p-lg-5">
        <input onChange={(e) => setRaqam(e?.target?.value)} type="tel" placeholder="Enter the number" className="my-3 form-control  p-lg-2" required/>
        <input onChange={(e) => setParol(e?.target?.value)} className="my-3 form-control  p-lg-2" type="password" placeholder="Enter the password" required/>
        <button type="submit" className="btn btn-success" onClick={handleSubmit}>Login Qilish</button>
      </form>
          </div>
        </div>
      </div>
    </div>
  )
}
