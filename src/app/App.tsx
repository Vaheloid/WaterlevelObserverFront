import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '@/pages/login/ui/LoginPage'
import MainPage from '@/pages/main/ui/MainPage'
import { Flex } from '@chakra-ui/react'
import '../app/styles/index.css'

export default function App() {

  return (
    <BrowserRouter>
    <Flex className="App" h="100vh" direction="column">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route 
            path='/main' 
            element={
                <MainPage />
            } 
          />
      </Routes>
    </Flex>
    </BrowserRouter>
    
  )
}
