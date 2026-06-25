import React, { useState } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../../shared/hooks/useToast'
import { EyeIcon, EyeOffIcon } from '../../shared/components/Icons'

const Register = () => {
    const { loading, handleRegister } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")

        if (!username.trim()) {
            setErrorMsg("Username is required")
            return
        }
        if (username.trim().length < 3) {
            setErrorMsg("Username must be at least 3 characters")
            return
        }
        if (!email.trim()) {
            setErrorMsg("Email is required")
            return
        }
        if (!validateEmail(email.trim())) {
            setErrorMsg("Please enter a valid email address")
            return
        }
        if (!password) {
            setErrorMsg("Password is required")
            return
        }
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters")
            return
        }

        setIsSubmitting(true)
        try {
            await handleRegister(username.trim(), email.trim(), password)
            toast.success("Account created successfully!")
            navigate('/')
        } catch (err) {
            console.error("Registration Error:", err)
            const errMsg = err.response?.data?.message || "Registration failed. Please try again."
            setErrorMsg(errMsg)
            toast.error(errMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-logo">InstaClone</h1>
                    <p className="auth-subtitle">Sign up to see photos and videos from friends.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter username"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email address</label>
                        <div className="input-wrapper">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter email address"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Enter password"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {errorMsg && <p className="validation-error">{errorMsg}</p>}

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting || loading}
                    >
                        {(isSubmitting || loading) ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Register