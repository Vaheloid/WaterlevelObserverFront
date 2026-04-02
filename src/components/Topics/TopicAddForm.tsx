import { addTopic } from "@/utils/api.ts";
import type { Topic, TopicAddFormProps } from "@/utils/types.ts";
import { VStack, Input, Button, Field, HStack } from "@chakra-ui/react"
import { useEffect } from "react";
import { useForm } from "react-hook-form"


export const TopicAddForm = ({ onSuccess, initialCoords }: TopicAddFormProps) => {
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
        console.error('Ошибка при добавлении топика');
    }
};

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} p={2}>
                {/* Название топика */}
                <Field.Root invalid={!!errors.Name_Topic}>
                    <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Название</Field.Label>
                    <Input 
                        bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                        {...register("Name_Topic", { required: "Введите название" })} 
                        placeholder="Введите название..."
                        color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                        borderColor={{ _dark: "whiteAlpha.400"}}
                    />
                    <Field.ErrorText>{errors.Name_Topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Путь или описание */}
                <Field.Root invalid={!!errors.Path_Topic}>
                    <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Путь</Field.Label>
                    <Input
                        bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                        {...register("Path_Topic", { required: "Введите путь" })} 
                        placeholder="Введите путь..."
                        color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                        borderColor={{ _dark: "whiteAlpha.400"}} 
                    />
                    <Field.ErrorText>{errors.Path_Topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Координаты в ряд */}
                <HStack w="full" gap={4} alignItems="flex-start">
                    <Field.Root invalid={!!errors.Latitude_Topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Широта</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="string" 
                            step="any"
                            {...register("Latitude_Topic", { required: "Введите широту" })}
                            placeholder="Нажмите на карту"
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
                        />
                        <Field.ErrorText>{errors.Latitude_Topic?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.Longitude_Topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Долгота</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="string" 
                            step="any"
                            {...register("Longitude_Topic", { required: "Введите долготу" })}
                            placeholder="Нажмите на карту"
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
                        />
                        <Field.ErrorText>{errors.Longitude_Topic?.message}</Field.ErrorText>
                    </Field.Root>
                </HStack>

                {/* Высота */}
                <HStack w="full" gap={4} alignItems="flex-start">
                    <Field.Root invalid={!!errors.Altitude_Topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Высота активации</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="number" 
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
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
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Высота датчика</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="number"
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
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
                    bg={{ base: "#0067c0", _dark: "#3182ce" }}
                    _hover={{ bg: { base: "#005da1", _dark: "#4299e1" } }} 
                    color="white" 
                    w="full" 
                    mt={4}
                    loading={isSubmitting}
                >
                    Добавить топик
                </Button>
            </VStack>
        </form>
    )
}