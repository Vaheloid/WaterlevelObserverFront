// components/MainPage/AddTopicForm.tsx
import { VStack, Input, Textarea, Button, Field, HStack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

// Используем твой интерфейс (исключая ID, так как его создаст бэкенд)
export interface Topic {
    ID_Topic: number;
    Name_Topic: string;
    Path_Topic: string; 
    Latitude_Topic: number;
    Longitude_Topic: number;
    Altitude_Topic: number; 
    AltitudeSensor_Topic: number;
}

// Тип для создания (без ID)
type CreateTopicInput = Omit<Topic, "ID_Topic">;

interface AddTopicFormProps {
    onSuccess: (data: CreateTopicInput) => void;
    initialCoords?: { lat: number; lng: number }; // Опционально: пропсы для координат с карты
}

export const AddTopicForm = ({ onSuccess, initialCoords }: AddTopicFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTopicInput>({
        // Устанавливаем координаты по умолчанию, если они переданы
        defaultValues: {
            Latitude_Topic: initialCoords?.lat || 0,
            Longitude_Topic: initialCoords?.lng || 0,
            Altitude_Topic: 0,
            AltitudeSensor_Topic: 0,
            Path_Topic: ""
        }
    })

    const onSubmit = (data: CreateTopicInput) => {
        // Преобразуем строковые значения из инпутов в числа перед отправкой
        const formattedData = {
            ...data,
            Latitude_Topic: Number(data.Latitude_Topic),
            Longitude_Topic: Number(data.Longitude_Topic),
            Altitude_Topic: Number(data.Altitude_Topic),
            AltitudeSensor_Topic: Number(data.AltitudeSensor_Topic),
        };
        console.log("Отправка топика:", formattedData);
        onSuccess(formattedData);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} p={2}>
                {/* Название топика */}
                <Field.Root invalid={!!errors.Name_Topic}>
                    <Field.Label>Название (Name_Topic)</Field.Label>
                    <Input 
                        {...register("Name_Topic", { required: "Введите название" })} 
                        placeholder="Введите название объекта..." 
                        layerStyle="win11Input"
                    />
                    <Field.ErrorText>{errors.Name_Topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Путь или описание */}
                <Field.Root invalid={!!errors.Path_Topic}>
                    <Field.Label>Путь/Описание (Path_Topic)</Field.Label>
                    <Textarea 
                        {...register("Path_Topic")} 
                        placeholder="Укажите путь или описание..." 
                        layerStyle="win11Input"
                        rows={2}
                    />
                </Field.Root>

                {/* Координаты в ряд */}
                <HStack w="full" gap={4}>
                    <Field.Root invalid={!!errors.Latitude_Topic}>
                        <Field.Label>Широта</Field.Label>
                        <Input 
                            type="number" 
                            step="any"
                            {...register("Latitude_Topic", { required: true })} 
                            layerStyle="win11Input"
                        />
                    </Field.Root>

                    <Field.Root invalid={!!errors.Longitude_Topic}>
                        <Field.Label>Долгота</Field.Label>
                        <Input 
                            type="number" 
                            step="any"
                            {...register("Longitude_Topic", { required: true })} 
                            layerStyle="win11Input"
                        />
                    </Field.Root>
                </HStack>

                {/* Высота */}
                <HStack w="full" gap={4}>
                    <Field.Root>
                        <Field.Label>Высота (Alt)</Field.Label>
                        <Input 
                            type="number" 
                            {...register("Altitude_Topic")} 
                            layerStyle="win11Input"
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Датчик (Sensor)</Field.Label>
                        <Input 
                            type="number" 
                            {...register("AltitudeSensor_Topic")} 
                            layerStyle="win11Input"
                        />
                    </Field.Root>
                </HStack>

                <Button 
                    type="submit" 
                    bg="blue.600" 
                    color="white" 
                    w="full" 
                    mt={4}
                    loading={isSubmitting}
                    _hover={{ bg: "blue.700" }}
                >
                    Сохранить топик
                </Button>
            </VStack>
        </form>
    )
}