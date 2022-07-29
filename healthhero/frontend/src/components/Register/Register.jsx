import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Register/Register.css";
import apiClient from "../../../services/apiClient";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    type: "",
    email: "",
    username: "",
    password: "",
  });

  const handleOnInputChange = (event) => {
    console.log("hello: ", event.target.selected);
    if (event.target.name === "password") {
      if (form.passwordConfirm && form.passwordConfirm !== event.target.value) {
        setErrors((e) => ({
          ...e,
          passwordConfirm: "Password's do not match",
        }));
      } else {
        setErrors((e) => ({ ...e, passwordConfirm: null }));
      }
    }
    if (event.target.name === "passwordConfirm") {
      if (form.password && form.password !== event.target.value) {
        setErrors((e) => ({
          ...e,
          passwordConfirm: "Password's do not match",
        }));
      } else {
        setErrors((e) => ({ ...e, passwordConfirm: null }));
      }
    }
    if (event.target.name === "email") {
      if (event.target.value.indexOf("@") === -1) {
        setErrors((e) => ({ ...e, email: "Please enter a valid email." }));
      } else {
        setErrors((e) => ({ ...e, email: null }));
      }
    }
    if (event.target.name === "type") {
      console.log(event.target.value);
    }

    setForm((f) => ({ ...f, [event.target.name]: event.target.value })); // event target is the name of the html that is the target
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    setErrors((e) => ({ ...e, form: null }));

    if (form.passwordConfirm !== form.password) {
      setErrors((e) => ({ ...e, passwordConfirm: "Passwords do not match." }));
      setIsLoading(false);
      return;
    } else {
      setErrors((e) => ({ ...e, passwordConfirm: null }));
    }

    try {
      const res = await apiClient.request("auth/register", "post", form);
      if (res?.data?.user) {
        //a way getting the user from the response if posiible
        // setAppState(res.data);
        setIsLoading(false);
        console.log("setIsLoading");
        console.log("res.data in register.jsx", res.data);
        apiClient.setToken(res?.data?.token);

        if (res?.data?.user?.type == "student") {
          console.log("hi");
          // ? is a way to protect from null value so it doesnt affected other
          navigate("/communities");
        } else if (res?.data?.user?.type == "restaurant") {
          navigate("/restform");
        }
      } else {
        setErrors((e) => ({
          ...e,
          form: "Something went wrong with registration",
        }));
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      const message = err?.response?.data?.error?.message;
      setErrors((e) => ({
        ...e,
        form: message ? String(message) : String(err),
      }));
      setIsLoading(false);
    }
  };

  return (
    <div className="Register">
      <div className="media"></div>
      <div className="card">
        <div className="text">
          <h2>Register </h2>
        </div>

        {errors.form && <span className="error">{errors.form}</span>}
        <br />

        <div className="form">
          <label htmlFor="type">Select User Type</label>
          <select
            name="type"
            id="users"
            value={form.type}
            onChange={handleOnInputChange}
          >
            {/* instead of form type we used teext values so that in the res.data.user.type it can tell where to Navigate user based on type */}
            <option value="student"> Student </option>
            <option value="restaurant"> Restaurant Owner </option>
          </select>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              name="email"
              placeholder="Enter a valid email"
              value={form.email}
              onChange={handleOnInputChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="split-inputs">
            <div className="input-field">
              <label htmlFor="username">Username</label>
              <br />
              <input
                type="text"
                name="username"
                placeholder="your username"
                value={form.username}
                onChange={handleOnInputChange}
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </div>

            <div className="input-field">
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="Enter a secure password"
                value={form.password}
                onChange={handleOnInputChange}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div className="input-field">
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <br />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirm your password"
                value={form.passwordConfirm}
                onChange={handleOnInputChange}
              />
              {errors.passwordConfirm && (
                <span className="error">{errors.passwordConfirm}</span>
              )}
            </div>

            <button
              className="btn"
              disabled={isLoading}
              onClick={handleOnSubmit}
            >
              {isLoading ? "Loading..." : "Create Account"}
            </button>
          </div>

          <div className="footer">
            <p>
              Already have an account? Login <Link to="/login">here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

//reroute here
console.log("regsister form");
