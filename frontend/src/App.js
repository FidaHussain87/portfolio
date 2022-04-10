import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar/Navbar";
import Intro from "./components/Intro/Intro";
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
     <Navbar/>
     <Intro/>
     <Services/>
   </div>
  );
};

export default App;
