import { useState, useEffect } from "react";
import { API_URL } from "../api";

export default function Wallet() {
  const [wallet, setWallet] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    loadWallet();

    if (window.ethereum) {
      window.ethereum.on(
        "accountsChanged",
        handleAccountChange
      );
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountChange
        );
      }
    };
  }, []);

  function loadWallet() {
    const supplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );

    const contractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );

    const user = supplier || contractor;

    if (
      user &&
      user.wallet &&
      user.wallet !== "Not Connected"
    ) {
      setWallet(user.wallet);
      setConnected(true);
    }
  }


  async function handleAccountChange(accounts) {
    if (accounts.length === 0) {
      setWallet("");
      setConnected(false);
      return;
    }

    await saveWallet(accounts[0]);
  }


  async function saveWallet(address) {

    setWallet(address);
    setConnected(true);


    const supplier = JSON.parse(
      localStorage.getItem("currentSupplier")
    );

    const contractor = JSON.parse(
      localStorage.getItem("currentContractor")
    );


    if (supplier) {

      const updatedSupplier = {
        ...supplier,
        wallet: address,
      };


      await fetch(
        `${API_URL}/suppliers/${supplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet: address,
          }),
        }
      );


      localStorage.setItem(
        "currentSupplier",
        JSON.stringify(updatedSupplier)
      );
    }


    if (contractor) {

      const updatedContractor = {
        ...contractor,
        wallet: address,
      };


      await fetch(
        `${API_URL}/contractors/${contractor.id}/wallet`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet: address,
          }),
        }
      );


      localStorage.setItem(
        "currentContractor",
        JSON.stringify(updatedContractor)
      );
    }

  }



  async function connectWallet() {

    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }


    try {

      const accounts =
        await window.ethereum.request({
          method:
            "eth_requestAccounts",
        });


      await saveWallet(accounts[0]);


      alert(
        "Wallet connected successfully!"
      );


    } catch (error) {

      console.log(error);

      alert(
        "Wallet connection failed."
      );

    }
  }



  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold">
          👛 Wallet
        </h1>


        <p className="text-gray-500 mt-2">
          Connect your MetaMask wallet.
        </p>


        <div className="mt-8">

          <p className="font-semibold">
            Status:
          </p>


          <p
            className={
              connected
                ? "text-green-600 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {connected
              ? "Connected"
              : "Not Connected"}
          </p>


          {wallet && (
            <>
              <p className="mt-6 font-semibold">
                Wallet Address
              </p>


              <div className="bg-gray-100 p-3 rounded break-all">
                {wallet}
              </div>
            </>
          )}


          {!connected && (
            <button
              onClick={connectWallet}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Connect MetaMask
            </button>
          )}

        </div>

      </div>

    </div>
  );
}