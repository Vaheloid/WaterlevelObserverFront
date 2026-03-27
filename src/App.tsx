import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@/index.css'
import Login from '@/components/Login/Login.tsx'
import MainPage from '@/components/MainPage/MainPage.tsx'
import { Flex } from '@chakra-ui/react'
import { ProtectedRoute } from '@/components/Login/ProtectedRoute'

export default function App() {

  return (
    <BrowserRouter>
    <Flex className="App" h="100vh" direction="column">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route 
            path='/main' 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
      </Routes>
    </Flex>
    </BrowserRouter>
    
  )
}
