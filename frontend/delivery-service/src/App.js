import React from "react";
import DeliveryLocationUpdater from "./Components/DeliveryLocationUpdater";

function App() {
  // 🔒 Simulated delivery person ID — in real apps, get from auth
  const userId = "60f0cbb25e8e2c001efb52d3";

  return (
    <div>
      <h1>Delivery Dashboard</h1>
      <DeliveryLocationUpdater userId={userId} />
    </div>
  );
}

export default App;
