import React, { useEffect, useState } from "react"
import Login from "./Login/Login"
import Header from "./Layout/Header"
import Order from "./componants/Orders"

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("access_token", token)
    setIsAuthenticated(true)
    
  }

  // const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
     {!isAuthenticated ? (
       <Login onLoginSuccess={handleLoginSuccess} />
     ) : (
      <>
        <Header />
        <Order/>
      </>
     )}

     
      
    </>
  )
}

export default App
