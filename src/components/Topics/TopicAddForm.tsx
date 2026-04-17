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
            latitude_topic: initialCoords?.lat,
            longitude_topic: initialCoords?.lng,
            altitude_topic: 60,
            altitudeSensor_topic: 60,
            path_topic: ""
        }
    })

    useEffect(() => {
        if (initialCoords) {
            setValue("latitude_topic", Number(initialCoords.lat));
            setValue("longitude_topic", Number(initialCoords.lng));
        }
    }, [initialCoords, setValue]);

    const onSubmit = async (data: Topic) => {
        try {
            await addTopic(data);
            console.log(`Топик добавлен: ${data.name_topic}`);
            onSuccess(data);
        } catch (error) {
            console.error('Ошибка при добавлении топика', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} p={2}>
                {/* Название топика */}
                <Field.Root invalid={!!errors.name_topic}>
                    <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Название</Field.Label>
                    <Input 
                        bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                        {...register("name_topic", { required: "Введите название" })} 
                        placeholder="Введите название..."
                        color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                        borderColor={{ _dark: "whiteAlpha.400"}}
                    />
                    <Field.ErrorText>{errors.name_topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Путь или описание */}
                <Field.Root invalid={!!errors.path_topic}>
                    <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Путь</Field.Label>
                    <Input
                        bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                        {...register("path_topic", { required: "Введите путь" })} 
                        placeholder="Введите путь..."
                        color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                        borderColor={{ _dark: "whiteAlpha.400"}} 
                    />
                    <Field.ErrorText>{errors.path_topic?.message}</Field.ErrorText>
                </Field.Root>

                {/* Координаты в ряд */}
                <HStack w="full" gap={4} alignItems="flex-start">
                    <Field.Root invalid={!!errors.latitude_topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Широта</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="number" 
                            step="any"
                            {...register("latitude_topic", { required: "Введите широту", valueAsNumber: true })}
                            placeholder="Нажмите на карту"
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
                        />
                        <Field.ErrorText>{errors.latitude_topic?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.longitude_topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Долгота</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="number" 
                            step="any"
                            {...register("longitude_topic", { required: "Введите долготу", valueAsNumber: true  })}
                            placeholder="Нажмите на карту"
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
                        />
                        <Field.ErrorText>{errors.longitude_topic?.message}</Field.ErrorText>
                    </Field.Root>
                </HStack>

                {/* Высота */}
                <HStack w="full" gap={4} alignItems="flex-start">
                    <Field.Root invalid={!!errors.altitude_topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Высота активации</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="number" 
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
                            {...register("altitude_topic", { required: "Введите высоту активации", valueAsNumber: true  })}
                            onWheel={(e) => {
                                const step = 1;
                                const current = Number(e.currentTarget.value);
                                setValue("altitude_topic", e.deltaY < 0 ? current + step : current - step);
                            }}
                        />
                        <Field.ErrorText>{errors.altitude_topic?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.altitudeSensor_topic}>
                        <Field.Label color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Высота датчика</Field.Label>
                        <Input
                            bg= {{ base: "whiteAlpha.600", _dark: "whiteAlpha.100" }}
                            type="number"
                            color={{ base: "gray.800", _dark: "whiteAlpha.800" }}
                            borderColor={{ _dark: "whiteAlpha.400"}}
                            {...register("altitudeSensor_topic", { required: "Введите высоту датчика", valueAsNumber: true  })}
                            onWheel={(e) => {
                                const step = 1;
                                const current = Number(e.currentTarget.value);
                                setValue("altitudeSensor_topic", e.deltaY < 0 ? current + step : current - step);
                            }} 
                        />
                        <Field.ErrorText>{errors.altitudeSensor_topic?.message}</Field.ErrorText>
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