/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Modal } from "@mui/material";
import { width } from "@mui/system";
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


export default function Home2() {
    const [category, setCategory] = useState([]);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false)
    const [loading, setLoading] = useState(false)
    const urlImage = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => {
        setOpen2(false);
        setOpen3(false);
    }
    const [data, setData] = useState({name_en : "", name_ru : "", images: null});


    const [nameEn, setNameEn] = useState()
    const [nameRu, setNameRu] = useState()
    const [picture, setPicture] = useState([])
    const [id, setId] = useState(null)
    console.log(nameEn, nameRu, picture);
    const tokenjon = sessionStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    formData.append("images", picture);

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
             getCategory();
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
      const logOut = () => {
        sessionStorage.removeItem("accessToken");
        navigate('/');
        toast.info("You Logged Out Successfully")
      }
      const handleOk = (id) => {
        setId(id);
        console.log(id);
        handleOpen2();
      }

    const getCategory = () => {
        setLoading(true);
        fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories").then(res => res.json())
            .then(data => {
                setLoading(false)
                setCategory(data?.data);
                console.log(data?.data);
            }).catch(err => console.error(err));
        }
    useEffect(() => {
        getCategory();
    }, [])

    const deleteCategory = (e) => {
        e.preventDefault();
        fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${tokenjon}`
            }
        }).then(res => res.json())
            .then(data => {
                const newCategory = category.filter(item => item.id!==id);
                setCategory(newCategory);
                setLoading(false);
                toast.success(data?.message);
            }).catch(err => console.error(err));
            handleClose2();
        }

        const handleEdit = (item) => {
            setOpen3(true);
            setId(item.id);
            setData({...data, name_en: item.name_en, name_ru: item.name_ru, images: item.image_src})
        }

        const editCategory = (e) => {
            e.preventDefault();
            const formData2 = new FormData();
            formData2.append('name_en', data.name_en);
            formData2.append('name_ru', data.name_ru);
            formData2.append('images', data.images)
            fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${tokenjon}`
                },
                method: "PUT",
                body : formData2
        }).then(res => res.json()).then((res=> {
            if(res.success === true) {
                toast.success("Muvaffaqiyatli!");
                getCategory();
                handleClose2();
            }else {
                toast.error("Xatolik yuz berdi!");
            }
        }))
        }


  return (
    <>
        <div className="container category">
            <div className="row">
                <div className="col-lg-6">
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
                <div className="col-lg-6 d-flex justify-content-end align-items-end mt-3">
                <button className="btn btn-primary" onClick={logOut}>Log Out</button>
                </div>
            </div>
            <div className="row  d-flex justify-content-center align-items-center">
                <div className="col-lg-10">
                {
                    loading ? <div style={{fontSize:"5rem", fontFamily: "monospace"}} className="vh-100 d-flex justify-content-center align-items-center ">Loading...</div>
                    :
                    <>
                    <table className="table table-striped">
                <thead>
                    <tr>
                        <th>
                            Inglizcha
                        </th>
                        <th>
                            Ruscha
                        </th>
                        <th>
                            Rasmlar
                        </th>
                        <th>
                            Harakat
                        </th>
                    </tr>
                </thead>
                <tbody>
                   {
                    category && category?.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name_en}</td>
                            <td>{item.name_ru}</td>
                            <td><img src={`${urlImage}${item.image_src}`} alt={item.name_en}  width="200" height="200" style={{objectFit:"cover"}}/></td>
                            <td>
                                <button className="btn btn-primary mx-1" onClick={() => handleEdit(item)}>Tahrirlash</button>
                                <button className="btn btn-danger" onClick={() => {
                                    handleOk(item.id);
                                }}>O`chirish</button>
                            </td>
                        </tr>
                    ))
                   }
                </tbody>
            </table>
            <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
            <p className="mb-3">O`chirilsinmi?</p>
            <button className="btn btn-outline-primary mx-2" onClick={handleClose2}>Cancel</button>
            <button className="btn btn-success" onClick={deleteCategory}>Ok</button>
        </Box>
        </Modal>
        <Modal
        open={open3}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
        <form className="form" onSubmit={editCategory}>
                <input type="text" className="form-control mt-lg-4" value={data.name_en} onChange={(e) => setData({...data, name_en: e.target.value})} required placeholder="Name en" />
                <input type="text" onChange={(e) => setData({...data, name_ru: e.target.value})} className="form-control mt-3" required value={data.name_ru} placeholder="Name ru" />
                <input type="file" accept="image/*" onChange={(e) => setData({...data, images: e.target.files[0]})} className="form-control mt-3" required />
            <button className="btn btn-outline-primary mx-2 mt-3" onClick={() => setOpen3(false)}>Cancel</button>
            <button className="btn btn-success mt-3">Ok</button>
            </form>
            
        </Box>
      </Modal>
                    </>
                }
                </div>
            </div>
        </div>
    </>
  )
}
