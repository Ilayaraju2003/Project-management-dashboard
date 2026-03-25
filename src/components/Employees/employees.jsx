import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    addEmployee,
    deleteEmployee,
    updateEmployee,
} from "../../features/employees/employeeSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./employees.css";
import { useState } from "react";

const schema = yup.object({
    name: yup.string().required("Name required"),
    position: yup.string().required("Position required"),
    email: yup.string().email().required("Valid email required"),
    image: yup.string().required("Image required"),
});

export default function Employees() {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees);

    const [editId, setEditId] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const { register, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    // ✅ IMAGE UPLOAD
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);
            setValue("image", reader.result); // store base64
        };

        reader.readAsDataURL(file);
    };

    const onSubmit = (data) => {
        const exists = employees.find(emp => emp.email === data.email);

        if (exists && !editId) {
            alert("Email already exists");
            return;
        }

        if (editId) {
            dispatch(updateEmployee({ id: editId, ...data }));
            setEditId(null);
        } else {
            dispatch(addEmployee(data));
        }

        reset();
        setImagePreview("");
    };

    // ✅ EDIT
    const handleEdit = (emp) => {
        setEditId(emp.id);

        setValue("name", emp.name);
        setValue("position", emp.position);
        setValue("email", emp.email);
        setValue("image", emp.image);

        setImagePreview(emp.image); // show preview
    };

    const handleCancel = () => {
        setEditId(null);
        reset();
        setImagePreview("");
    };

    return (
        <div className="container">
            <h2 className="title">Employees</h2>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <input className="input" placeholder="Name" {...register("name")} />
                <input className="input" placeholder="Position" {...register("position")} />
                <input className="input" placeholder="Email" {...register("email")} />

                {/* FILE INPUT */}
                <label className="file-input" >
                    Profile Image
                    <input
                        className="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                    />
                </label>

                {/* IMAGE PREVIEW */}
                {imagePreview && (
                    <img src={imagePreview} className="emp-preview" alt="" />
                )}

                <button className="button" type="submit">
                    {editId ? "Update Employee" : "Add Employee"}
                </button>

                {editId && (
                    <button
                        className="button cancelBtn"
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="list">
                {employees.map(emp => (
                    <div className="card" key={emp.id}>
                        <div>
                            <img src={emp.image} className="emp-passport-img" alt="employee" />
                            <br />
                            <strong>Name: </strong>{emp.name} <br />
                            <strong>Position: </strong>{emp.position} <br />
                            <strong>Email: </strong>{emp.email}
                        </div>

                        <div className="actions">
                            <button
                                className="editBtn"
                                onClick={() => handleEdit(emp)}
                            >
                                Edit
                            </button>

                            <button
                                className="deleteBtn"
                                onClick={() => dispatch(deleteEmployee(emp.id))}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}