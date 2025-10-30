import React, { useEffect, useState } from "react"
import Login from "./Login/Login"
import Header from "./Layout/Header"
import OrderDashboard from "./componants/OrderDashboard"
// import AOS from "aos"

const App: React.FC = () => {
  // AOS.init()

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // The Login page can notify us on success to reveal the dashboard immediately
  const onLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <>
     {!isAuthenticated ? (
       <Login onLoginSuccess={onLoginSuccess} />
     ) : (
      <>
        <Header onLogout={handleLogout} />
        <OrderDashboard/>
      </>
     )}

     
      
    </>
  )
}

export default App
