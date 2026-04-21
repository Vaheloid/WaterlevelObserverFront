import { Stack, Field, Input, Button, Alert } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import type { FormValues, LoginFormProps } from "@/utils/types.ts"

export const LoginForm = ({ onSubmit, isSubmitting, loginError }: LoginFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

    const inputStyles = {
        bg: { base: "whiteAlpha.600", _dark: "whiteAlpha.100" },
        _focus: {
            // В темной теме синий лучше делать чуть светлее для контраста
            borderColor: { base: "#0067c0", _dark: "#3182ce" }, 
            boxShadow: { base: "0 0 0 1px #0067c0", _dark: "0 0 0 1px #3182ce" }
        },
        borderRadius: "md",
        color: { base: "gray.800", _dark: "white" },
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4">
                <Field.Root invalid={!!errors.login_user}>
                    <Field.Label fontWeight="medium">Логин</Field.Label>
                        <Input
                            {...register("login_user", { required: "Обязательное поле" })}
                            {...inputStyles}
                            placeholder="Введите логин"
                        />
                    <Field.ErrorText>{errors.login_user?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password_user} >
                    <Field.Label fontWeight="medium" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Пароль</Field.Label >
                        <PasswordInput
                            {...register("password_user", { required: "Обязательное поле" })}
                            {...inputStyles}
                            placeholder="Введите пароль"
                        />
                    <Field.ErrorText>{errors.password_user?.message}</Field.ErrorText>
                </Field.Root>

                <Button
                    type="submit"
                    loading={isSubmitting}
                    width="full"
                    bg={{ base: "#0067c0", _dark: "#3182ce" }}
                    _hover={{ bg: { base: "#005da1", _dark: "#4299e1" } }}
                    color="white"
                    mt="2"
                >
                    Войти
                </Button>

                {loginError && (
                    <Alert.Root status="error" borderRadius="md">
                        <Alert.Indicator />
                        <Alert.Title fontSize="xs">{loginError}</Alert.Title>
                    </Alert.Root>
                )}
            </Stack>
        </form>
    )
}