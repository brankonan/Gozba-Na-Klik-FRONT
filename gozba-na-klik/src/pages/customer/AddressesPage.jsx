import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { 
    getAddressesAsync, 
    createAddressAsync, 
    updateAddressAsync, 
    deleteAddressAsync 
} from "../../api/addressService";

const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const { register, formState: { errors }, reset, handleSubmit } = useForm({
        defaultValues: {
            street: "",
            houseNumber: "",
            city: ""
        }
    });

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        if (!user?.id) return;
        
        setIsLoading(true);
        try {
            const addressesData = await getAddressesAsync(user.id);
            setAddresses(addressesData);
        } catch (error) {
            toast.error("Greška pri učitavanju adresa");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!user?.id) return;

        try {
            if (editingAddress) {
                await updateAddressAsync(user.id, editingAddress.id, data);
                toast.success("Adresa je uspešno ažurirana");
            } else {
                await createAddressAsync(user.id, data);
                toast.success("Adresa je uspešno dodana");
            }
            
            reset();
            setEditingAddress(null);
            setIsFormVisible(false);
            loadAddresses();
        } catch (error) {
            toast.error("Greška pri čuvanju adrese");
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        reset({
            street: address.street,
            houseNumber: address.houseNumber,
            city: address.city
        });
        setIsFormVisible(true);
    };

    const handleDelete = async (addressId) => {
        if (!user?.id) return;
        
        if (!window.confirm("Da li ste sigurni da želite da obrišete ovu adresu?")) {
            return;
        }

        try {
            await deleteAddressAsync(user.id, addressId);
            toast.success("Adresa je uspešno obrisana");
            loadAddresses();
        } catch (error) {
            toast.error("Greška pri brisanju adrese");
        }
    };

    const handleCancel = () => {
        reset();
        setEditingAddress(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        reset();
        setEditingAddress(null);
        setIsFormVisible(true);
    };

    return (
        <main className="section">
            <div className="container" style={{ maxWidth: 800 }}>
                <div className="card card-pad stack">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>Moje adrese</h2>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleAddNew}
                        >
                            Dodaj novu adresu
                        </button>
                    </div>

                    {isFormVisible && (
                        <div className="card" style={{ marginTop: "1rem" }}>
                            <div className="card-pad">
                                <h3>{editingAddress ? "Izmeni adresu" : "Dodaj novu adresu"}</h3>
                                <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div>
                                        <label className="label">Ulica</label>
                                        <input
                                            className="input"
                                            {...register("street", { required: "Obavezno polje" })}
                                        />
                                        {errors.street && (<span className="error">{errors.street.message}</span>)}
                                    </div>

                                    <div>
                                        <label className="label">Broj</label>
                                        <input
                                            className="input"
                                            type="number"
                                            {...register("houseNumber", { 
                                                required: "Obavezno polje",
                                                min: { value: 1, message: "Broj mora biti veći od 0" }
                                            })}
                                        />
                                        {errors.houseNumber && (<span className="error">{errors.houseNumber.message}</span>)}
                                    </div>

                                    <div>
                                        <label className="label">Grad</label>
                                        <input
                                            className="input"
                                            {...register("city", { required: "Obavezno polje" })}
                                        />
                                        {errors.city && (<span className="error">{errors.city.message}</span>)}
                                    </div>

                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button type="submit" className="btn btn-primary">
                                            {editingAddress ? "Sačuvaj izmene" : "Dodaj adresu"}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline"
                                            onClick={handleCancel}
                                        >
                                            Otkaži
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            Učitavanje adresa...
                        </div>
                    ) : addresses.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                            Nemate dodane adrese. Kliknite "Dodaj novu adresu" da dodate prvu adresu.
                        </div>
                    ) : (
                        <div className="stack" style={{ marginTop: "1rem" }}>
                            {addresses.map((address) => (
                                <div key={address.id} className="card">
                                    <div className="card-pad">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 0.5rem 0" }}>
                                                    {address.street} {address.houseNumber}
                                                </h4>
                                                <p style={{ margin: 0, color: "#666" }}>
                                                    {address.city}
                                                </p>
                                            </div>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button 
                                                    type="button"
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => handleEdit(address)}
                                                >
                                                    Izmeni
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(address.id)}
                                                >
                                                    Obriši
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AddressesPage;
