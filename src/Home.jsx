/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [nameEn, setNameEn] = useState()
  const [nameRu, setNameRu] = useState()
  const [picture, setPicture] = useState([])
  console.log(nameEn, nameRu, picture);
  const tokenjon = sessionStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("name_en", nameEn);
  formData.append("name_ru", nameRu);
  formData.append("images", picture);
  useEffect(() => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategory(data?.data);
        console.log(data?.data);
      });
  }, []);
  const categoryCreate = (e) => {
    e.preventDefault();
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories', {
      method: 'POST',
      body: formData,
      headers: {
        /* 'Content-type': 'multipart/form-data; charset=UTF-8', */
        "Authorization" : `Bearer ${tokenjon}`
      },
    })
       .then((response) => response.json())
       .then((data) => {
        if(data?.success === true) {
          console.log(data);
          toast.success(data?.message);
          handleClose();
        } else {
          toast.error(data?.message);
        }

       })
       .catch((err) => {
          console.log(err.message);
       
       });
  }
  const [category, setCategory] = useState([]);

  const logOut = () => {
    sessionStorage.removeItem("accessToken");
    navigate('/');
    toast.info("You Logged Out Successfully")
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
            <div>
      <Button onClick={handleOpen}>Qo`shish</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form className="form">
                <input onChange={(e) => setNameEn(e.target.value)} type="text" className="form-control mt-lg-4" required placeholder="Name en" />
                <input onChange={(e) => setNameRu(e.target.value)} type="text" className="form-control mt-3" required placeholder="Name ru" />
                <input onChange={(e) => setPicture(e.target.files[0])} type="file" accept="image/*" className="form-control mt-3" required />
                <Button  className="btn mt-3" onClick={categoryCreate}>Categoriya Qo`shish</Button>
              </form>
        </Box>
      </Modal>
    </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-end">
              <button className="btn btn-primary" onClick={logOut}>Log Out</button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
            <table className="table table-striped">
<thead>
  <tr>
    <th>Inglizcha</th>
    <th>Ruscha</th>
    <th>Rasmlar</th>
  </tr>
</thead>
<tbody>
  {category?.map((item,index) => {
    return (
    <tr key={index}>
      <td>{item.name_en}</td>
      <td>{item.name_ru}</td>
      <td><img src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item?.image_src}`} width="200" height="150" /></td>
    </tr>
  )})}
</tbody>
</table>
        </div>
      </div>
    </div>
    </div>
  </div>
    </div>
  );
}
