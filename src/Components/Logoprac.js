import React, { useContext, useState } from "react";
import "./Logoprac.css";
import logoimg from "./images/new_logo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { Signupp } from "./Signupp.jsx";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { TotalResponsesContext } from "../TotalResponsesContext.jsx";

const Logoprac = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useContext(TotalResponsesContext);
  // const [role, setRole] = useState();

  const handleRole = (event) => {
    setRole(event.target.value);
    console.log(event.target.value);
  };
  const navigate = useNavigate(); // Initialize the navigate function
  const handleEmailChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginClick = () => {
    console.log("button of login has been clicked");
    console.log(username, password);
    axios
      .post("https://schoolmanagement-10.onrender.com/school/login", {
        username,
        password,
      })
      .then((response) => {
        console.log(response.data);
        console.log(username, password);
        // Store the token in local storage or state
        localStorage.setItem("token", response.data.token);
        // Redirect or update the UI as needed
        navigate("/");
        alert("login successful");
      })
      .catch((error) => {
        alert("Incorrect username password !");
        console.error("There was an error logging in!", error);
      });
  };

  return (
    <div className="login-fix">
      <div className="yellow-back">
        <div className="logo-login">
          <img src={logoimg} alt="" />
        </div>
      </div>
      <div className="white-back">
        <div className="login-form">
          <form>
            <div className="login-heading">
              <h2>Login With Email ID</h2>
            </div>

            <FormControl fullWidth data-mdb-input-init className="form-outline mb-4 setinput">
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="role"
                onChange={handleRole}
              >
                <MenuItem value={1}>Super Admin</MenuItem>
                <MenuItem value={2}>School</MenuItem>
                <MenuItem value={3}>Branch</MenuItem>
              </Select>
            </FormControl>

            <div data-mdb-input-init className="form-outline mb-4 setinput">
              <input
                type="text"
                id="form2Example1"
                className="form-control"
                placeholder="Enter Your username"
                value={username}
                autoComplete="username"
                onChange={handleEmailChange}
              />
            </div>

            <div data-mdb-input-init className="form-outline mb-4 setinput">
              <input
                type="password"
                id="form2Example2"
                className="form-control"
                placeholder="password"
                value={password}
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
            </div>

            <div className="nedd-sign">
              <div>
                <a href="/">Need Help ?</a>
              </div>
              <div className="button-col">
                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-block mb-4"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              </div>
            </div>

            <div className="text-center">
              <p>
                Not a member? <Link to="/signup">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Logoprac;
