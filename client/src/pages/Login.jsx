import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

export default function Login() {

  const navigate = useNavigate();


  const [form, setForm] = useState({

    email: "",
    password: "",

  });






  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  }








  async function handleLogin(e) {

    e.preventDefault();



    try {



      // Check Contractors from localStorage

      const contractors =

        JSON.parse(
          localStorage.getItem("contractors")
        ) || [];





      const contractor = contractors.find(

        (user) =>

          user.email?.toLowerCase() ===
            form.email.toLowerCase()

          &&

          user.password === form.password

      );





      if (contractor) {



        localStorage.setItem(

          "currentContractor",

          JSON.stringify(contractor)

        );



        localStorage.setItem(

          "userType",

          "contractor"

        );



        navigate("/dashboard");

        return;


      }








      // Check Suppliers from Render backend

      const response = await fetch(

        `${API_URL}/suppliers`

      );





      const suppliers = await response.json();






      const supplier = suppliers.find(

        (user) =>

          user.email?.toLowerCase() ===
            form.email.toLowerCase()

          &&

          user.password === form.password

      );






      if (supplier) {



        localStorage.setItem(

          "currentSupplier",

          JSON.stringify(supplier)

        );



        localStorage.setItem(

          "userType",

          "supplier"

        );



        navigate("/supplier-dashboard");

        return;


      }





      alert(
        "Invalid email or password."
      );





    } catch(error) {


      console.error(
        "LOGIN ERROR:",
        error
      );


      alert(
        "Unable to connect to server."
      );


    }


  }








  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">



      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">



        <h1 className="text-3xl font-bold text-center">

          🏗 BuildProcure AI

        </h1>




        <p className="text-center text-gray-600 mt-2">

          Welcome Back

        </p>






        <form

          onSubmit={handleLogin}

          className="mt-8 space-y-5"

        >



          <input

            type="email"

            name="email"

            placeholder="Email Address"

            value={form.email}

            onChange={handleChange}

            className="w-full border p-3 rounded-lg"

            required

          />





          <input

            type="password"

            name="password"

            placeholder="Password"

            value={form.password}

            onChange={handleChange}

            className="w-full border p-3 rounded-lg"

            required

          />





          <button

            type="submit"

            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"

          >

            Log In

          </button>




        </form>






        <p className="text-center mt-6 text-gray-600">

          Don't have an account?

        </p>





        <Link

          to="/register"

          className="block mt-3 text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"

        >

          Create Account

        </Link>





      </div>



    </div>

  );

}