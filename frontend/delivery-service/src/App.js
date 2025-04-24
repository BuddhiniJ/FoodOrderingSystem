// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import DeliveryLocationUpdater from "./Components/DeliveryLocationUpdater";
// import axios from "axios";

function App() {
  // const [isAuthorized, setIsAuthorized] = useState(false);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const checkUserRole = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         navigate("/unauthorized"); // Redirect to unauthorized if no token is found
  //         return;
  //       }

  //       // Fetch the current user details from the user-service
  //       const response = await axios.get("http://localhost:5001/api/auth/me", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const user = response.data.data;

  //       // Check if the user has the delivery-personnel role
  //       if (user.role === "delivery-personnel") {
  //         setIsAuthorized(true); // Allow access to the DeliveryLocationUpdater
  //       } else {
  //         navigate("/unauthorized"); // Redirect to unauthorized if not delivery-personnel
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //       navigate("/unauthorized"); // Redirect to unauthorized on error
  //     }
  //   };

  //   checkUserRole();
  // }, [navigate]);

  return (
    <div>
      {/* {isAuthorized ? ( */}
        <>
          <h1>Delivery Service Dashboard</h1>
          <DeliveryLocationUpdater />
        </>
      {/* ) : ( */}
        {/* <p>Loading...</p> */}
      {/* )} */}
    </div>
  );
}

export default App;