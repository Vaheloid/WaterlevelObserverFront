import { AbsoluteCenter, Alert, Box, Button, Field, Heading, Input, Stack } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface FormValues {
    login_user: string
    password_user: string
}

interface LoginResponse {
    user_id: number
}

export default function Login() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        setLoginError(null)
        try {
            const response = await axios.post<LoginResponse>('/api/login', data, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            })
            console.log("User ID:", response.data.user_id)

            navigate('/main')
            reset()
        } catch {
            setLoginError('Неверный логин или пароль')
            reset()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Box 
            w="100%" 
            h="100vh" 
            position="relative" 
            bg="#fdfdfd" // Светлая база
            overflow="hidden"
        >
            {/* Группа фоновых "жидких" пятен */}
            <Box position="absolute" inset="0" zIndex="0" filter="blur(70px)">
                {/* Пятно 1: Основное синее */}
                <Box 
                    position="absolute"
                    top="-5%"
                    left="10%"
                    w="45%"
                    h="50%"
                    bg="#93c5fd" // blue.300
                    borderRadius="full"
                    opacity="0.5"
                />
                {/* Пятно 2: Фиолетовый акцент */}
                <Box 
                    position="absolute"
                    bottom="10%"
                    right="5%"
                    w="40%"
                    h="55%"
                    bg="#c4b5fd" // purple.300
                    borderRadius="full"
                    opacity="0.4"
                />
                {/* Пятно 3: Теплая розовая дымка */}
                <Box 
                    position="absolute"
                    top="20%"
                    right="15%"
                    w="30%"
                    h="30%"
                    bg="#fda4af" // rose.300
                    borderRadius="full"
                    opacity="0.3"
                />
                {/* Пятно 4: Бирюзовый низ */}
                <Box 
                    position="absolute"
                    bottom="-10%"
                    left="20%"
                    w="35%"
                    h="40%"
                    bg="#5eead4" // teal.300
                    borderRadius="full"
                    opacity="0.3"
                />
            </Box>

            <AbsoluteCenter axis="both" width={{ base: "95%", sm: "80%", md: "420px" }} style={{ zIndex: 2 }}>
                <Box
                    w="100%"
                    /* Glassmorphism эффект */
                    backdropFilter="blur(30px) saturate(160%)"
                    bg="rgba(255, 255, 255, 0.6)"
                    border="1px solid rgba(255, 255, 255, 0.5)"
                    borderRadius="3xl" // Более мягкие углы Windows 11
                    boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                    px={{ base: "8", md: "10" }}
                    py={{ base: "10", md: "12" }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Heading
                            textAlign="center"
                            fontWeight="700"
                            letterSpacing="-0.03em"
                            mb="8"
                            size="xl"
                            color="gray.800"
                        >
                            Авторизация
                        </Heading>
                        
                        <Stack gap="5">
                            <Field.Root invalid={!!errors.login_user}>
                                <Field.Label fontWeight="600" color="gray.700" fontSize="sm">ЛОГИН</Field.Label>
                                <Input
                                    {...register("login_user", { required: "Введите логин" })}
                                    placeholder="Введите логин"
                                    variant="subtle"
                                    bg="rgba(255, 255, 255, 0.5)"
                                    _focus={{ bg: "white", borderColor: "blue.400" }}
                                    borderRadius="xl"
                                    h="50px"
                                />
                                <Field.ErrorText>{errors.login_user?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.password_user}>
                                <Field.Label fontWeight="600" color="gray.700" fontSize="sm">ПАРОЛЬ</Field.Label>
                                <PasswordInput
                                    {...register("password_user", { required: "Введите пароль" })}
                                    placeholder="Введите пароль"
                                    variant="subtle"
                                    bg="rgba(255, 255, 255, 0.5)"
                                    _focus={{ bg: "white", borderColor: "blue.400" }}
                                    borderRadius="xl"
                                    h="50px"
                                />
                                <Field.ErrorText>{errors.password_user?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button
                                mt="4"
                                bg="#0067c0" // Фирменный синий Windows
                                color="white"
                                type="submit"
                                loading={isSubmitting}
                                width="full"
                                borderRadius="xl"
                                h="50px"
                                fontWeight="600"
                                _hover={{ bg: "#005bb0", transform: "scale(1.01)" }}
                                _active={{ transform: "scale(0.98)" }}
                                transition="all 0.2s cubic-bezier(.4,0,.2,1)"
                            >
                                Войти
                            </Button>

                            {loginError && (
                                <Alert.Root status="error" borderRadius="xl" variant="solid" bg="red.400">
                                    <Alert.Indicator color="white" />
                                    <Alert.Title fontSize="xs" color="white">{loginError}</Alert.Title>
                                </Alert.Root>
                            )}
                        </Stack>
                    </form>
                </Box>
            </AbsoluteCenter>
        </Box>
    )
}