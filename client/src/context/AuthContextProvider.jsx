import React, { useContext, useState } from "react";

import AuthContext from "./AuthContext";

const AuthContextProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  //   const [home, setHome] = useState(true);
  //   const [token, setToken] = useState({});

  const toggleAuth = (value) => {
    setIsAuth(value);
  };

  // React.useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setIsAuth(true);
  //   }
  // }, []);
  //   const handleHome = (value) => {
  //     setHome(value);
  //   };
  //   const handleToken = (to) => {
  //     setToken(to);
  //   };

  return (
    // contextNameProvider
    <AuthContext.Provider value={{ isAuth, toggleAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
