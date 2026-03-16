import { 
    AbsoluteCenter, 
    Alert, 
    Box, 
    Button, 
    Center, 
    Field, 
    Heading, 
    Input, 
    Stack,
    Text 
} from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import type { FormValues, LoginResponse } from "@/utils/types"

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
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            console.log("User ID:", response.data.user_id)
            navigate('/main')
            reset()
        } catch {
            setLoginError('Неверный логин или пароль')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        // Фон в стиле "Bloom" (стандартные обои Windows 11)
        <Box 
            bgGradient="radial(circle at 50% 50%, #4f79f2 0%, #1e3a8a 100%)" 
            w="100%" 
            h="100vh" 
            position="relative"
            overflow="hidden"
        >
            

            <AbsoluteCenter axis="both" width={{ base: "95%", sm: "400px" }}>
                <Box
                    w="100%"
                    // Эффект Mica/Acrylic
                    bg="rgba(255, 255, 255, 0.7)"
                    backdropFilter="blur(30px) saturate(150%)"
                    borderRadius="xl" // Скругление в стиле Win11
                    border="1px solid"
                    borderColor="whiteAlpha.400"
                    boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.2)"
                    p={{ base: "6", md: "10" }}
                >
                    <Stack gap="6">
                        <Box textAlign="center">
                            <Heading
                                size="xl"
                                fontWeight="semibold"
                                letterSpacing="tight"
                                color="gray.800"
                            >
                                Вход
                            </Heading>
                            <Text color="gray.600" fontSize="sm" mt="1">
                                Используйте свою учетную запись
                            </Text>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap="4">
                                <Field.Root invalid={!!errors.login_user}>
                                    <Field.Label fontWeight="medium">Логин</Field.Label>
                                    <Input
                                        {...register("login_user", { required: "Обязательное поле" })}
                                        placeholder="Введите логин"
                                        bg="whiteAlpha.600"
                                        border="1px solid"
                                        borderColor="blackAlpha.200"
                                        _focus={{ 
                                            borderColor: "#0067c0", // Фирменный синий Windows
                                            boxShadow: "0 0 0 1px #0067c0" 
                                        }}
                                        borderRadius="md"
                                    />
                                    <Field.ErrorText>{errors.login_user?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!errors.password_user}>
                                    <Field.Label fontWeight="medium">Пароль</Field.Label>
                                    <PasswordInput
                                        {...register("password_user", { required: "Обязательное поле" })}
                                        placeholder="Введите пароль"
                                        bg="whiteAlpha.600"
                                        border="1px solid"
                                        borderColor="blackAlpha.200"
                                        _focus={{ borderColor: "#0067c0", boxShadow: "0 0 0 1px #0067c0" }}
                                        borderRadius="md"
                                    />
                                    <Field.ErrorText>{errors.password_user?.message}</Field.ErrorText>
                                </Field.Root>

                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    width="full"
                                    // Цвет Accent в Windows 11
                                    bg="#0067c0"
                                    color="white"
                                    fontWeight="normal"
                                    borderRadius="md"
                                    _hover={{ bg: "#005da1", boxShadow: "md" }}
                                    _active={{ bg: "#00528e", transform: "scale(0.98)" }}
                                    transition="all 0.2s"
                                    mt="2"
                                >
                                    Войти
                                </Button>

                                {loginError && (
                                    <Alert.Root status="error" borderRadius="md" variant="subtle">
                                        <Alert.Indicator />
                                        <Alert.Title fontSize="xs">{loginError}</Alert.Title>
                                    </Alert.Root>
                                )}
                            </Stack>
                        </form>

                        <Center>
                            <Text fontSize="xs" color="gray.500">
                                © 2026 П3 Солюшенс
                            </Text>
                        </Center>
                    </Stack>
                </Box>
            </AbsoluteCenter>
        </Box>
    )
}