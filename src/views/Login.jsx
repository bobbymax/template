import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../controllers/guard";
import { authenticate } from "../features/userSlice";
import { Button, TextInput } from "../template/components/forms/Inputs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email,
      password,
    };

    try {
      login(data)
        .then((res) => {
          setTimeout(() => {
            dispatch(authenticate(res.data));
            setEmail("");
            setPassword("");
            setLoading(false);
            navigate("/");
          }, 2000);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      setLoading(false);
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
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  placeholder="Enter Email Address"
                  borderRadius
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
                  borderRadius
                />
              </div>
              <div className="col-md-12 mt-3">
                <Button
                  text="LOGIN"
                  isLoading={loading}
                  type="submit"
                  icon="login"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
