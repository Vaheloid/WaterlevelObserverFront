import { Provider } from "@/shared/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from "@/pages/login/ui/LoginPage"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <LoginPage />
        </Provider>
    </StrictMode>
)