import { Stack, Field, Input, Button, Alert } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import type { FormValues, LoginFormProps } from "@/utils/types.ts"

export const LoginForm = ({ onSubmit, isSubmitting, loginError }: LoginFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

    const inputStyles = {
        bg: "whiteAlpha.600",
        border: "1px solid",
        borderColor: "blackAlpha.200",
        _focus: {
            borderColor: "#0067c0",
            boxShadow: "0 0 0 1px #0067c0"
        },
        borderRadius: "md"
    }

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4">
        <Field.Root invalid={!!errors.login_user}>
            <Field.Label fontWeight="medium">Логин</Field.Label>
            <Input
            {...register("login_user", { required: "Обязательное поле" })}
            placeholder="Введите логин"
            {...inputStyles}
            />
            <Field.ErrorText>{errors.login_user?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password_user}>
            <Field.Label fontWeight="medium">Пароль</Field.Label>
            <PasswordInput
            {...register("password_user", { required: "Обязательное поле" })}
            placeholder="Введите пароль"
            {...inputStyles}
            />
            <Field.ErrorText>{errors.password_user?.message}</Field.ErrorText>
        </Field.Root>

        <Button
            type="submit"
            loading={isSubmitting}
            width="full"
            bg="#0067c0"
            color="white"
            _hover={{ bg: "#005da1" }}
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