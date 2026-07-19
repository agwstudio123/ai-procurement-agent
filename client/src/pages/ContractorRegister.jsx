import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContractorRegister() {
  const navigate = useNavigate();

  const [contractor, setContractor] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    location: "",
    wallet: "",
    password: "",
  });


  function handleChange(e) {
    setContractor({
      ...contractor,
      [e.target.name]: e.target.value,
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();


    try {

      const response = await fetch(
        "https://buildprocure-ai-backend.onrender.com/contractors/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: contractor.companyName,
            ownerName: contractor.ownerName,
            email: contractor.email,
            location: contractor.location,
            wallet: contractor.wallet,
            password: contractor.password,
          }),
        }
      );


      const data = await response.json();


      if (!data.success) {

        alert(data.message);

        return;

      }


      const newContractor = data.contractor;


      localStorage.setItem(
        "currentContractor",
        JSON.stringify(newContractor)
      );


      localStorage.setItem(
        "userType",
        "contractor"
      );


      alert(
        "Contractor account created successfully!"
      );


      navigate("/dashboard");


    } catch(error) {

      console.error(
        "Contractor registration error:",
        error
      );


      alert(
        "Failed to create contractor account"
      );

    }
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold">
          🏗 Contractor Registration
        </h1>


        <p className="text-gray-600 mt-2">
          Create your contractor account.
        </p>


        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >


          <input
            name="companyName"
            placeholder="Company Name"
            value={contractor.companyName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            name="ownerName"
            placeholder="Owner Name"
            value={contractor.ownerName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={contractor.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            name="location"
            placeholder="Business Location"
            value={contractor.location}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <input
            name="wallet"
            placeholder="Wallet Address (Optional)"
            value={contractor.wallet}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />


          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={contractor.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />


          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            Create Contractor Account
          </button>


        </form>

      </div>

    </div>
  );
}