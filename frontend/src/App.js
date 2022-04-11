import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Portfolio from "./components/Portfolio/Portfolio";
import Testimonials from "./components/Testimonials/Testimonials";
const Navbar = React.lazy(() => import("./components/Navbar/Navbar"));
const Intro = React.lazy(() => import("./components/Intro/Intro"));
const Experience = React.lazy(() =>
  import("./components/Experience/Experience")
);
const Works = React.lazy(() => import("./components/Works/Works"));
// import Login from "./Pages/Login";
// import { Register } from "./Pages/Register";
// import PrivateRoute from "./routes/privateRoute";
const Home = React.lazy(() => import("./Pages/Home"));
const AboutUs = React.lazy(() => import("./Pages/AboutUs"));
const ContactUs = React.lazy(() => import("./Pages/ContactUs"));
const Services = React.lazy(() => import("./components/Services/Services"));

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Intro />
      <Services />
      <Experience />
      <Works />
      <Portfolio/>
      <Testimonials/>
    </div>
  );
};

export default App;
