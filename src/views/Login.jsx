import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../controllers/guard";
import { authenticate } from "../features/userSlice";
import { TextInput } from "../template/components/forms/Inputs";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      membership_no: username,
      password,
    };

    try {
      login(data)
        .then((res) => {
          setTimeout(() => {
            dispatch(authenticate(res.data));
            setUsername("");
            setPassword("");
            navigate("/");
          }, 2000);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="form-login">
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <TextInput
                  label="Membership Number"
                  name="membership_no"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="lg"
                  placeholder="Enter Email Address"
                />
              </div>
              <div className="col-md-12">
                <TextInput
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  placeholder="Enter Password"
                />
              </div>
              <div className="col-md-12 mt-3">
                <button type="submit" className="custom-btn">
                  <span className="material-icons-sharp">login</span>
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
