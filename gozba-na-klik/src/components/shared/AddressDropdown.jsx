import React, { useEffect, useState } from "react";
import { getAddressesAsync } from "../../api/addressService";

const AddressDropdown = ({ 
    selectedAddressId, 
    onAddressChange, 
    userId, 
    placeholder = "Izaberite adresu",
    showAddButton = false,
    onAddAddress = null 
}) => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            loadAddresses();
        }
    }, [userId]);

    const loadAddresses = async () => {
        setIsLoading(true);
        try {
            const addressesData = await getAddressesAsync(userId);
            setAddresses(addressesData);
        } catch (error) {
            console.error("Greška pri učitavanju adresa:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const addressId = parseInt(e.target.value);
        const selectedAddress = addresses.find(addr => addr.id === addressId);
        onAddressChange(selectedAddress);
    };

    const formatAddress = (address) => {
        return `${address.street} ${address.houseNumber}, ${address.city}`;
    };

    return (
        <div className="address-dropdown">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                    value={selectedAddressId || ""}
                    onChange={handleChange}
                    className="input"
                    disabled={isLoading}
                    style={{ flex: 1 }}
                >
                    <option value="" disabled>
                        {isLoading ? "Učitavanje..." : placeholder}
                    </option>
                    {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                            {formatAddress(address)}
                        </option>
                    ))}
                </select>
                
                {showAddButton && onAddAddress && (
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={onAddAddress}
                        title="Dodaj novu adresu"
                    >
                        +
                    </button>
                )}
            </div>
            
            {addresses.length === 0 && !isLoading && (
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                    Nemate dodane adrese. 
                    {showAddButton && onAddAddress && " Kliknite + da dodate novu adresu."}
                </p>
            )}
        </div>
    );
};

export default AddressDropdown;
