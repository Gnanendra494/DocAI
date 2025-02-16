import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import "bootstrap/dist/css/bootstrap.css";
import { emailValidate } from "../../helper/validate.js"; // Import your email validation function
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: emailValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        console.log(values);
        const response = await axios.post(
          "http://localhost:5000/api/login",
          values
        ); // Assuming you're using axios for HTTP requests
        console.log(response);
        if (response.status === 200) {
          navigate("/profile", { state: { email: values.email } });
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (error) {
        toast.error(
          "An error occurred while logging in. Please try again later."
        );
      }
    },
  });

  return (
    <section
      className="vh-100 bottom-info"
      style={{ backgroundColor: "#DDDDDD" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://api.wallpapers.ai/static/downloads/10d61fc3753b4f06a8b1b3f3947dfb7c/upscaled/000000_371390922_kdpmpp2m15_PS7.5_Aspect_ratio_9_16._High-tech_office_located_on_a_space_station._The_office_should_have_clean_futuristic_lines_and_a_sleek_cyberpun_[upscaled].jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="greet">
                        <p>
                          <span>Provide your Lumiq Credentials</span>
                        </p>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          {...formik.getFieldProps("email")}
                          type="email"
                          id="form2Example17"
                          placeholder="Email"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          {...formik.getFieldProps("password")}
                          type="password"
                          placeholder="Password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="pt-1 mb-4 bottom-info">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>

                      <div className="bottom-info">
                        <p>Code_Shinigami@2024</p>
                      </div>
                      <Toaster />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;