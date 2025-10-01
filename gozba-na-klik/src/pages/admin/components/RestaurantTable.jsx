import React from "react";

export default function RestaurantTable({restaurants, onEdit, onDelete}) {
    return(
        <section className="stack">
            <h2>Restaurants</h2>
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>OwnerID</td>
                            <td>Owner</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.name}</td>
                                <td>{r.ownerId}</td>
                                <td>{r.ownerName}</td>
                                <td>
                                    <button className="btn btn-edit"
                                        style={{marginRight:12}}
                                        onClick = {() => onEdit(r)}
                                    >Edit</button>
                                    <button className="btn btn-delete"
                                        onClick={() => onDelete(r.id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                        {restaurants.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{opacity:0.7, padding: "16px 0"}}>
                                    No restaurants found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}