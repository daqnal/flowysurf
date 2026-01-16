import axios from "axios";

import { X } from "lucide-react";

export default function AuthModal({ type, setShowAuthModal }) {
    const action = type === "login" ? "Login" : "Register";

    const handeLogin = async (formData) => {
        const email = formData.get("email");
        const password = formData.get("password");
        try {
            console.log("Logging in...");
            await axios.post("/auth/login",
                { email, password },
                { withCredentials: true }
            );
            console.log("Login success!");
            setShowAuthModal(false);
        } catch (err) {
            console.error("Login failed", err.response.data.message);
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

                <form action={handeLogin} className="fieldset w-full p-4">
                    <fieldset className="fieldset w-full">
                        <label className="label">Email</label>
                        <input type="email" name="email" className="input validator w-full" placeholder="Email" required />
                        <p className="validator-hint hidden">Required</p>
                    </fieldset>

                    <label className="fieldset w-full">
                        <span className="label">Password</span>
                        <input type="password" name="password" className="input validator w-full" placeholder="Password" required />
                        <span className="validator-hint hidden">Required</span>
                    </label>

                    <button className="btn btn-neutral mt-4" type="submit">{action}</button>
                </form>
            </div>
        </div>
    )
}