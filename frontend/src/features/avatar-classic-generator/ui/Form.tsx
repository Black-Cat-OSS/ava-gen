import type { Pallete } from '@/entities';
import { AnglePresets, ColorPalette, ColorPreview } from '@/features';
import {
  AngleVisualizer,
  Button,
  getImageUrl,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useGenerateAvatar,
  usePalletes,
} from '@/shared';
import type { IColorScheme, GeneratorType } from '@/shared/api/generator/types';
import { t } from 'i18next';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
  color: Required<IColorScheme>;
  generatorType: Required<GeneratorType>;
  angle: number;
};

export const ClassicGeneratorForm = () => {
  const { data } = usePalletes({ pick: 1, offset: 0 });
  const { v1, v2 } = useGenerateAvatar();
  const { mutate: generateAvatar, isSuccess, data: avatarData } = v1;
  const { mutate: generateAvatarV2, isSuccess: isSuccessV2, data: avatarDataV2 } = v2;

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      color: {
        primaryColor: data?.items?.[0]?.primaryColor ?? '#ffffff',
        foreignColor: data?.items?.[0]?.foreignColor ?? '#000000',
        colorScheme: data?.items?.[0]?.colorScheme ?? 'default',
      },
      generatorType: 'pixelize',
      angle: 90,
    },
  });

  useEffect(() => {
    const colorObject = data?.items?.[0];

    if (colorObject) {
      setValue('color', {
        primaryColor: colorObject.primaryColor ?? '#ffffff',
        foreignColor: colorObject.foreignColor ?? '#000000',
        colorScheme: colorObject.colorScheme ?? 'default',
      });
      setValue('generatorType', 'pixelize');
    }
  }, [data, setValue]);

  const onSubmit = (data: FormData) => {

    if (data.generatorType === 'gradient') {
      generateAvatarV2({
        primaryColor: data.color.primaryColor,
        foreignColor: data.color.foreignColor,
        colorScheme: data.color.colorScheme,
        angle: data.angle,
      });
      return;
    }

    generateAvatar({
      primaryColor: data.color.primaryColor,
      foreignColor: data.color.foreignColor,
      colorScheme: data.color.colorScheme,
      type: data.generatorType as GeneratorType,
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={control}
          render={({ field }) => (
            <>
              <ColorPalette
                selectedScheme={field.value as Pallete}
                onPaletteChange={data => field.onChange(data)}
              />
              <ColorPreview
                primaryColor={field.value.primaryColor}
                foreignColor={field.value.foreignColor}
                disabled
              />
            </>
          )}
          name="color"
        />

        <Controller
          control={control}
          render={({ field }) => (
            <Tabs value={field.value} onValueChange={field.onChange}>
              <TabsList className="bg-gray-700 rounded-lg p-1 mb-3">
                <TabsTrigger
                  value="pixelize"
                  className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                >
                  Pixelize
                </TabsTrigger>
                <TabsTrigger
                  value="wave"
                  className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                >
                  Wave
                </TabsTrigger>
                <TabsTrigger
                  value="gradient"
                  className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                >
                  Gradient
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pixelize"></TabsContent>
              <TabsContent value="wave"></TabsContent>
              <TabsContent value="gradient">
                <div className="flex items-center gap-1">
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <>
                        <AnglePresets
                          currentAngle={field.value}
                          onAngleSelect={angle => {
                            field.onChange(angle);
                          }}
                          colorScheme={watch('color')}
                          size={70}
                        />
                        <div className="flex flex-col items-center w-full">
                          <AngleVisualizer
                            angle={field.value}
                            onChange={angle => field.onChange(angle)}
                            size={230}
                          />
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            {t('features.avatarGenerator.dragToRotate')}
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            {t('features.avatarGenerator.angleDescription')}
                          </p>
                        </div>
                      </>
                    )}
                    name="angle"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
          name="generatorType"
        />
        <div className="flex justify-center">
          <Button type="submit" className="w-full">
            Generate Classic Avatar
          </Button>
        </div>
      </form>

      {/* SHIT CODE HERE */}
      {isSuccess && <div>Avatar generated successfully</div>}
      {avatarData && <img src={getImageUrl(avatarData.id, { size: 8 })} alt="Avatar" />}
      {isSuccessV2 && <div>Gradient avatar generated successfully</div>}
      {avatarDataV2 && (
        <img src={getImageUrl(avatarDataV2.id, { size: 8 })} alt="Gradient Avatar" />
      )}
    </div>
  );
};
