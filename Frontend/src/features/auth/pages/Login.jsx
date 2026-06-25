import React, { useState } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../../shared/hooks/useToast'
import { EyeIcon, EyeOffIcon } from '../../shared/components/Icons'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")

        if (!username.trim()) {
            setErrorMsg("Username is required")
            return
        }
        if (!password) {
            setErrorMsg("Password is required")
            return
        }

        setIsSubmitting(true)
        try {
            await handleLogin(username.trim(), password)
            toast.success("Welcome back!")
            navigate('/')
        } catch (err) {
            console.error("Login Error:", err)
            const errMsg = err.response?.data?.message || "Invalid username or password"
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
                    <p className="auth-subtitle">Sign in to see photos and videos from friends.</p>
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
                                Logging in...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Login