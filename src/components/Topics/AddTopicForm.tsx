import { addTopic } from "@/utils/api.ts";
import type { Topic } from "@/utils/types.ts";
import { VStack, Input, Button, Field, HStack } from "@chakra-ui/react"
import { useEffect } from "react";
import { useForm } from "react-hook-form"


interface AddTopicFormProps {
    onSuccess: (data: Topic) => void;
    initialCoords?: { lat: number; lng: number };
}

export const AddTopicForm = ({ onSuccess, initialCoords }: AddTopicFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Topic>({
        defaultValues: {
            Latitude_Topic: initialCoords?.lat,
            Longitude_Topic: initialCoords?.lng,
            Altitude_Topic: 60,
            AltitudeSensor_Topic: 60,
            Path_Topic: ""
        }
    })

    useEffect(() => {
        if (initialCoords) {
            setValue("Latitude_Topic", initialCoords.lat);
            setValue("Longitude_Topic", initialCoords.lng);
        }
    }, [initialCoords, setValue]);

    const onSubmit = async (data: Topic) => {
    try {
        const formattedData = {
            ...data,
            Latitude_Topic: Number(data.Latitude_Topic),
            Longitude_Topic: Number(data.Longitude_Topic),
            Altitude_Topic: Number(data.Altitude_Topic),
            AltitudeSensor_Topic: Number(data.AltitudeSensor_Topic),
        };

        const response = await addTopic(formattedData);

        console.log(response.message);
        console.log(`Топик добавлен: ${formattedData.Name_Topic}`);

        onSuccess(formattedData);
        
    } catch {
        console.error('Ошибка добавления');
    }
};

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} p={2}>
                {/* Название топика */}
                <Field.Root invalid={!!errors.Name_Topic}>
                    <Field.Label>Название</Field.Label>
                    <Input 
                        {...register("Name_Topic", { required: "Введите название" })} 
                        placeholder="Введите название..." 
                    />
                    <Field.ErrorText>{errors.Name_Topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Путь или описание */}
                <Field.Root invalid={!!errors.Path_Topic}>
                    <Field.Label>Путь</Field.Label>
                    <Input 
                        {...register("Path_Topic", { required: "Введите путь" })} 
                        placeholder="Введите путь..." 
                    />
                    <Field.ErrorText>{errors.Path_Topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Координаты в ряд */}
                <HStack w="full" gap={4} alignItems="flex-start">
                    <Field.Root invalid={!!errors.Latitude_Topic}>
                        <Field.Label>Широта</Field.Label>
                        <Input 
                            type="string" 
                            step="any"
                            {...register("Latitude_Topic", { required: "Введите широту" })}
                            placeholder="Нажмите на карту" 
                        />
                        <Field.ErrorText>{errors.Latitude_Topic?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.Longitude_Topic}>
                        <Field.Label>Долгота</Field.Label>
                        <Input 
                            type="string" 
                            step="any"
                            {...register("Longitude_Topic", { required: "Введите долготу" })}
                            placeholder="Нажмите на карту"
                        />
                        <Field.ErrorText>{errors.Longitude_Topic?.message}</Field.ErrorText>
                    </Field.Root>
                </HStack>

                {/* Высота */}
                <HStack w="full" gap={4} alignItems="flex-start">
                    <Field.Root invalid={!!errors.Altitude_Topic}>
                        <Field.Label>Высота активации</Field.Label>
                        <Input 
                            type="number" 
                            {...register("Altitude_Topic", { required: "Введите высоту активации" })}
                            onWheel={(e) => {
                                const step = 1;
                                const current = Number(e.currentTarget.value);
                                setValue("Altitude_Topic", e.deltaY < 0 ? current + step : current - step);
                            }}
                        />
                        <Field.ErrorText>{errors.Altitude_Topic?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.AltitudeSensor_Topic}>
                        <Field.Label>Высота датчика</Field.Label>
                        <Input 
                            type="number" 
                            {...register("AltitudeSensor_Topic", { required: "Введите высоту датчика" })}
                            onWheel={(e) => {
                                const step = 1;
                                const current = Number(e.currentTarget.value);
                                setValue("AltitudeSensor_Topic", e.deltaY < 0 ? current + step : current - step);
                            }} 
                        />
                        <Field.ErrorText>{errors.AltitudeSensor_Topic?.message}</Field.ErrorText>
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
                    Добавить топик
                </Button>
            </VStack>
        </form>
    )
}