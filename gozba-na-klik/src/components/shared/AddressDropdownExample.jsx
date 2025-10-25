import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressDropdown from "./AddressDropdown";

const AddressDropdownExample = () => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate();
    
    const user = JSON.parse(localStorage.getItem("user"));

    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        console.log("Selected address:", address);
    };

    const handleAddAddress = () => {
        navigate("/customer/addresses");
    };

    if (!user || user.role !== "Customer") {
        return null;
    }

    return (
        <div className="card card-pad">
            <h3>Izaberite adresu za dostavu</h3>
            <AddressDropdown
                selectedAddressId={selectedAddress?.id}
                onAddressChange={handleAddressChange}
                userId={user.id}
                placeholder="Izaberite adresu za dostavu"
                showAddButton={true}
                onAddAddress={handleAddAddress}
            />
            
            {selectedAddress && (
                <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                    <h4>Izabrana adresa:</h4>
                    <p><strong>Ulica:</strong> {selectedAddress.street} {selectedAddress.houseNumber}</p>
                    <p><strong>Grad:</strong> {selectedAddress.city}</p>
                </div>
            )}
        </div>
    );
};

export default AddressDropdownExample;
