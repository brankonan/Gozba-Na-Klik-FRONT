import React from "react";
import Admin from "./admin/Admin"
import Customer from "./Customer";
import Courier from "./Courier";
import Owner from "./Owner";
import Employee from "./Employee";


const Profile = () => {
    const [user, setUser] = useState(null);

    const roleComponents = {
        Admin: Admin,
        Customer: Customer,
        Courier: Courier,
        RestourantOwner: Owner,
        Employee: Employee
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        else {
            navigate("/login");
        }
    }, []);

    const RoleComponent = roleComponents[user.role];
    return <RoleComponent/>;
}

export default Profile;