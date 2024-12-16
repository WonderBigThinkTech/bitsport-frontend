import Axios from "axios";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header, Swap } from "@/components";
import Modal from "@/components/Modal";
import UserRoute from "../components/AdminRoute/userRoute";
import ProfileNameModal from "../components/ProfileNameModal/index";
import ProfilePwdModal from "../components/ProfileNameModal/password";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { ForwardRefExoticComponent } from "react";
import Icon, { EditOutlined } from "@ant-design/icons";
import Avatar from "@/public/profile.png";
import Footer from "@/components/Footer";
import { IState } from "@/store";
import { SERVER_URI, SERVER_HOST } from "@/config";
import { notification } from "antd";
import { authActions } from "@/store/auth";

import { number, string } from "yup";
import { blob } from "stream/consumers";

const Profile = () => {
  const { currentUser } = useSelector((state: IState) => state.auth);
  const dispatch = useDispatch();
  const [isProfileNameOpen, setIsProfileNameOpen] = useState(false);
  const [isProfilePwdOpen, setIsProfilePwdOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");

  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined" || !localStorage) {
      return "";
    }
    return window.localStorage.getItem(key);
  };

  useEffect(() => {
    const token = getFromLocalStorage("token");
    const userInfo: any = token ? jwtDecode(token) : {};
    if (userInfo) {
      const user = { user: userInfo.id };
      Axios.post(`${SERVER_URI}/getUserInfo`, user).then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        }
      });
    } else {
      notification.warning({
        message: "Warning!",
        description: "Please login to",
      });
    }
  }, []);

  const toggleProfileName = () => {
    setIsProfileNameOpen(!isProfileNameOpen);

    if (currentUser) {
      const user = { user: currentUser.id };
      Axios.post(`${SERVER_URI}/getUserInfo`, user).then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        } else {
          console.log("failed");
        }
      });
    } else {
      notification.warning({
        message: "Warning!",
        description: "Please login to",
      });
    }
  };

  const toggleProfilePwd = () => {
    setIsProfilePwdOpen(!isProfilePwdOpen);
    if (currentUser) {
      const user = { user: currentUser.id };
      Axios.post(`${SERVER_URI}/getUserInfo`, user).then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          dispatch(authActions.setCurrentUser(jwtDecode(res.data.token)));
        } else {
          console.log("failed");
        }
      });
    } else {
      notification.warning({
        message: "Warning!",
        description: "Please login to",
      });
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleImageUpload = () => {
    if (!selectedFile) {
      // No file selected, handle error or show a message
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);
    formData.append('userID', currentUser.id);

    // Make a POST request to the server with the formData
    Axios.post(`${SERVER_URI}/profile/avatar`, formData, {})
      .then((response) => {
        // Handle successful upload
        console.log('Upload success:', response.data);
        notification.success({
          message: "Success!",
          description: response.data.message,
        });
        localStorage.setItem("token", response.data.token);
        dispatch(authActions.setCurrentUser(jwtDecode(response.data.token)));
        
      })
      .catch((error) => {
        // Handle upload error
        console.error('Upload error:', error);
        notification.warning({
          message: "Warning!",
          description: 'Error occurred during file upload',
        });
      });
  };


  return (
    <UserRoute >
      <div className="w-full">
        <Header />
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mt-16 lg:px-20 xl:px-40 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-32 justify-center">
            <div>
              <div className="flex items-center gap-20">
                <h2 className="text-white font-bold text-3xl">PROFILE</h2>
                <button
                  className="flex md:hidden bg-secondary-450 px-6 py-2 rounded-lg items-center text-white gap-3 font-bold text-base"
                >
                  <div>EDIT</div>
                  <Icon
                    style={{ fontSize: 18, color: "white" }}
                    component={EditOutlined as ForwardRefExoticComponent<any>}
                  />
                </button>
              </div>
              <div className="mt-10">
                <div className="flex flex-col text-white lg:mt-14 mt-10 font-bold text-lg">
                  <input type="file" onChange={handleFileChange} />
                  <button className="mt-5 text-[#fdc228] text-left hover:text-[#c19c3d] hover:underline" onClick={handleImageUpload}>Upload Avatar</button>
                </div>
                <div className="flex justify-center">
                  {currentUser?.avatar ? (
                    <Image
                      priority={true}
                      height={187}
                      width={329}
                      src={`${SERVER_HOST}/uploads/${currentUser.avatar}`}
                      alt="avatar image"
                      className="avatar"
                    />
                  ) : (
                    <Image
                      priority={true}
                      height={187}
                      width={329}
                      src={Avatar}
                      alt="avatar image"
                      className="avatar"
                    />
                  )
                  }

                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-end">
                <button onClick={toggleProfileName} className="mb-12 hidden md:flex bg-secondary-450 px-8 py-3 rounded items-center text-white gap-3 font-bold text-lg">
                  <div>EDIT</div>
                  <Icon
                    style={{ fontSize: 18, color: "white" }}
                    component={EditOutlined as ForwardRefExoticComponent<any>}
                  />
                </button>
              </div>
              <div className="lg:mt-14 mt-10 w-full">
                <div className="flex w-full justify-between">
                  <p className="text-2xl text-primary-1100 font-bold">
                    First Name
                  </p>
                  <p className="text-white font-medium text-2xl">
                    {currentUser && currentUser.firstname}
                  </p>
                </div>
                <div className="flex w-full justify-between">
                  <p className="text-2xl text-primary-1100 font-bold">
                    Last Name
                  </p>
                  <p className="text-white font-medium text-2xl">
                    {currentUser && currentUser.lastname}
                  </p>
                </div>
                <div className="flex w-full justify-between">
                  <p className="text-2xl text-primary-1100 font-bold">
                    Username
                  </p>
                  <p className="text-white font-medium text-2xl">
                    {currentUser && currentUser.username}
                  </p>
                </div>
                <div className="flex w-full justify-between">
                  <p className="text-2xl text-primary-1100 font-bold">
                    Password
                  </p>
                  <button onClick={toggleProfilePwd} className="mb-12 hidden md:flex px-4 py-1 rounded items-center text-white gap-3 font-bold text-lg hover:text-gray-400">
                    <div>Change</div>
                    <Icon
                      style={{ fontSize: 18, color: "white" }}
                      component={EditOutlined as ForwardRefExoticComponent<any>}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          key={0}
          Body={<ProfileNameModal close={toggleProfileName} />}
          isOpen={isProfileNameOpen}
          close={toggleProfileName}
          isVoid={5}
        />
        <Modal
          key={0}
          Body={<ProfilePwdModal close={toggleProfilePwd} />}
          isOpen={isProfilePwdOpen}
          close={toggleProfilePwd}
          isVoid={5}
        />
        <Footer />
      </div>
    </UserRoute>
  );
};

export default Profile;
