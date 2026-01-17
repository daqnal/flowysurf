import axios from "axios";

import { X } from "lucide-react";
import { pushToast } from "./Toasts";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ type, setShowAuthModal }) {
    const action = type === "login" ? "Login" : "Register";

    const { login, register, loading } = useAuth();

    const handeLogin = async (formData) => {
        const email = formData.get("email");
        const password = formData.get("password");
        try {
            console.log("Logging in...");
            await login(email, password);
            console.log("Login success!");
            pushToast(`Logged in as ${email} successfully`, "success");
            setShowAuthModal(false);
        } catch (err) {
            console.error("Login failed", err);
        }
    }

    const handleRegistration = async (formData) => {
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        try {
            console.log("Registering...");
            await register(username, email, password);
            console.log("Registration success!");
            pushToast(`Registered as ${username} successfully`, "success");
            setShowAuthModal(false);
        } catch (err) {
            console.error("Registration failed: ", err);
        }
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-108 min-w-84">
                <div className="tooltip tooltip-left absolute top-4 right-4" data-tip="Close">
                    <button className="btn btn-soft btn-primary btn-sm btn-circle" onClick={() => setShowAuthModal(false)}>
                        <X className="w-5" />
                    </button>
                </div>

                <h1 className="text-3xl font-bold">{action}</h1>

                <form action={type === "login" ? handeLogin : handleRegistration} className="fieldset w-full p-4">
                    {type === "register" && (
                        <fieldset className="fieldset w-full">
                            <label className="label">Username</label>
                            <input name="username" className="input validator w-full" placeholder="Username" required />
                            <p className="validator-hint hidden">Required</p>
                        </fieldset>
                    )}

                    <fieldset className="fieldset w-full">
                        <label className="label">Email</label>
                        <input type="email" name="email" className="input validator w-full" placeholder="Email" required />
                        <p className="validator-hint hidden mt-0">Required</p>
                    </fieldset>

                    <label className="fieldset w-full">
                        <span className="label">Password</span>
                        <input type="password" name="password" className="input validator w-full" placeholder="Password" required />
                        <span className="validator-hint hidden mt-0">Required</span>
                    </label>


                    {loading ? (<div className="skeleton btn mt-4" disabled></div>) : (<button className="btn btn-neutral mt-4" type="submit">Submit</button>)}
                </form>
            </div>
        </div>
    )
}