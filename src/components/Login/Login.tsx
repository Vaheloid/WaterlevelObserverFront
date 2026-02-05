import { AbsoluteCenter, Alert, Box, Button, Center, Field, Heading, Input, Stack } from "@chakra-ui/react"
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

    const {
    register,
    handleSubmit,
    formState: { errors },
    reset
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setLoginError(null)

    try {
            const response = await axios.post<LoginResponse>(
            '/api/login',
            data,
                {
                    withCredentials: true,
                    headers: {
                    'Content-Type': 'application/json',
                    },
                }
            )
            console.log("User ID:", response.data.user_id)

            navigate('/main')
            reset()
        }
        catch {
            setLoginError('Неверный логин или пароль')
            reset()
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
    <Box bg={"#e6e5e5"} w="100%" h="100vh" position="relative">
        <AbsoluteCenter axis="both" width={{ base: "90%", sm: "80%", md: "70%", lg: "400px" }}>
        <Box
            w="100%"
            h={{ base: "auto", lg: "100%" }}
            bg={"#fefcfb"}
            px={{ base: "4", md: "6" }}
            py={{ base: "4", md: "6" }}

            color="fg"
            shadow="lg"
        >
            <Center>
            <Box w={{ base: "100%", lg: "400px" }} h="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Heading
                paddingBottom={{ base: "3", md: "5" }}
                paddingTop={{ base: "2", md: "3" }}
                size={{ base: "lg", md: "xl" }}
                >
                Авторизация
                </Heading>
                <Stack gap={{ base: "3", md: "4" }} align="flex-start">
                <Field.Root invalid={!!errors.login_user}>
                    <Field.Label fontSize={{ base: "sm", md: "md" }}>Логин</Field.Label>
                    <Input
                    {...register("login_user",
                        { required: "Обязательное поле" })}
                    placeholder="Введите логин"
                    size={{ base: "md", md: "lg" }}
                    />
                    <Field.ErrorText fontSize="sm">{errors.login_user?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password_user}>
                    <Field.Label fontSize={{ base: "sm", md: "md" }}>Пароль</Field.Label>
                    <PasswordInput
                    {...register("password_user",
                        { required: "Обязательное поле" })}
                    placeholder="Введите пароль"
                    size={{ base: "md", md: "lg" }}
                    />
                    <Field.ErrorText fontSize="sm">{errors.password_user?.message}</Field.ErrorText>
                </Field.Root>

                <Button
                    bgColor="#034078"
                    color="white"
                    type="submit"
                    loading={isSubmitting}
                    width="full"
                    variant="subtle"
                    size={{ base: "md", md: "lg" }}
                >
                    Вход
                </Button>
                {loginError && (
                    <Alert.Root status="error" width="full">
                    <Alert.Indicator />
                    <Alert.Title fontSize={{ base: "sm", md: "md" }}>{loginError}</Alert.Title>
                    </Alert.Root>
                )}
                </Stack>
            </form>
            </Box>
        </Center>
        </Box>
    </AbsoluteCenter>
    </Box>
)
}