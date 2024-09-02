import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { getAllPosts } from "../../api";
import { CircularProgress } from '@mui/material'
import { useAuth } from "../../store/auth";
import Swal from "sweetalert2";

const Posts = () => {

    const {removetokenInLS} = useAuth()

    const [allPosts, setAllPosts] = useState(null);
    // console.log(user.profileImage);
    const [loading, setLoading] = useState(true);

    const getPosts = async ()=>{
      try {
        const response = await getAllPosts();
        // console.log(response);
        if (response.status === 200) {
            if(response.data.posts.length === 0){
                setAllPosts(null);
            } else{
                setAllPosts(response.data.posts);
            }
          setLoading(false);
        } else{
            if(response.message.data === "Token Expired"){
                Swal.fire({
                  icon: "error",
                  text: response.response.data.message,
                  toast: true,
                  position: "top",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                      toast.addEventListener("mouseenter", Swal.stopTimer);
                      toast.addEventListener("mouseleave", Swal.resumeTimer);
                  },
              })
              removetokenInLS();
              }
              
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    useEffect(() => {
        if (allPosts) {
            setLoading(false);
        } else{
          getPosts()
        }
    }, [allPosts])

if(loading){
  return(
    <div className="h-screen opacity-70 flex justify-center items-center">
    <CircularProgress style={{ color: 'black' }} />
</div>
  )
}

if(allPosts == null){
    return (
        <div className='w-full h-screen flex items-center justify-center'>
        <h1 className='text-2xl text-center'>No Post Found!</h1>
        </div>
    )
}

    return (
        <>
            {allPosts !== null ?
                <>
                    <div className="posts w-full min-h-screen bg-white pt-1">
                        <div className="cards flex justify-center flex-wrap gap-10 px-10 mt-10">
                            {/* {console.log(userPosts)} */}
                            {allPosts?.map((post, i)=>(
                                    // {console.log(post)}
                                    <Link key={i} to={`/posts/${post._id}`} post={post}>
                                    <div className="card w-52 h-full cursor-pointer">
                                        <div className="w-52 h-40 bg-gray-100 rounded-lg overflow-hidden">
                                            <img className="w-full h-full object-cover" src={`${post.image}`} alt="" />
                                        </div>
                                        <h3 className="text-xl text-center font-semibold mt-3 cursor-pointer">{post.title}</h3>
                                    </div>
                                    </Link>
  ))
  }
                        </div>
                    </div>
                </> :
                <>
                    <div className="h-screen opacity-70 flex justify-center items-center">
                        <CircularProgress style={{ color: 'black' }} />
                    </div>
                </>
            }
        </>

    )
}

export default Posts