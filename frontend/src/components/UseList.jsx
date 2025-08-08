import React from 'react'
import { Link } from 'react-router-dom';
export const UseList = ({userList,defaultPic,user}) => {
  return (
    <>
        <div className="allUserList">
          <header>
            <h1>You may know them !</h1>
            <hr />
          </header>
          <section>
            <div className="UserDataInfo">
              {userList.map((user) => {
                return (
                  <div key={user._id} className="UserData"> 
                    <div className="Userimg">
                      <img
                          src={
                            user.profilePicture
                            ? `http://localhost:5000/images/${user.profilePicture}`
                            : defaultPic
                          }
                          alt="Profile"
                          className="ListPic"
                          />
                    </div>
                    <Link className="Username-friendBox" to={`/${user.username}`}>
                    <h2>{user.username}</h2>
                    </Link>
                    <Link className="SeeLink" to={`/${user.username}`} >See</Link>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
    </>
  )
}
