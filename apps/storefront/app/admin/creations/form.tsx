import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment, PropsWithChildren, useEffect } from 'react';
import GeneralPropsFields from './generalPropsFields';
import SeoPropsFields from './seoPropsFields';
import z from 'zod';
import { UseFormReset, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import ImagesPropsFields from './imagesPropsFields';
import { Spinner } from '@couture-next/ui';

const schema = z.object({
  name: z.string().min(3, 'Le nom doit faire au moins 3 caractères'),
  description: z
    .string()
    .min(3, 'La description doit faire au moins 3 caractères'),
  seo: z.object({
    title: z.string().min(3, 'Le nom doit faire au moins 3 caractères'),
    description: z
      .string()
      .min(3, 'La description doit faire au moins 3 caractères'),
  }),
  images: z.array(z.string()).min(1, 'Il faut au moins une image'),
});

export type ArticleFormType = z.infer<typeof schema>;

export type OnSubmitArticleFormCallback = (
  data: ArticleFormType,
  reset: UseFormReset<ArticleFormType>
) => void;

export default function ArticleForm({
  defaultValues,
  onSubmitCallback,
  isLoading,
}: {
  defaultValues?: ArticleFormType;
  onSubmitCallback: OnSubmitArticleFormCallback;
  isLoading?: boolean;
}) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<ArticleFormType>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => onSubmitCallback(data, reset));

  return (
    <form
      className="max-w-3xl mx-auto mt-8 shadow-sm bg-white rounded-md px-4 py-6 border"
      onSubmit={onSubmit}
    >
      <Tab.Group>
        <Tab.List className="flex gap-4 items-baseline border-b">
          <TabHeader containsErrors={!!errors.name || !!errors.description}>
            Général
          </TabHeader>
          <TabHeader containsErrors={!!errors.images}>Images</TabHeader>
          <TabHeader containsErrors={!!errors.seo}>SEO</TabHeader>
          <button
            type="submit"
            disabled={!isDirty || isLoading}
            className={clsx(
              'ml-auto mr-2',
              isDirty && 'animate-bounce',
              !isDirty && 'opacity-20 cursor-not-allowed'
            )}
          >
            {!isLoading && (
              <CheckCircleIcon className="h-6 w-6 text-primary-100" />
            )}
            {isLoading && <Spinner className="w-6 h-6 text-primary-100" />}
          </button>
        </Tab.List>
        <Tab.Panels className="p-4">
          <Tab.Panel>
            <GeneralPropsFields register={register} errors={errors} />
          </Tab.Panel>
          <Tab.Panel>
            <ImagesPropsFields
              images={watch('images')}
              setImages={(images) => setValue('images', images)}
              errors={errors}
            />
          </Tab.Panel>
          <Tab.Panel>
            <SeoPropsFields register={register} errors={errors} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </form>
  );
}

const TabHeader: React.FC<
  PropsWithChildren<{
    containsErrors?: boolean;
  }>
> = ({ children, containsErrors }) => (
  <Tab as={Fragment}>
    {({ selected }) => (
      <span
        className={clsx(
          selected && 'border-b-2',
          'px-4 py-2 cursor-pointer outline-none gap-2 relative'
        )}
      >
        {children}
        {!!containsErrors && (
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500 absolute left-full -translate-x-[80%] top-1/2 -translate-y-[45%]" />
        )}
      </span>
    )}
  </Tab>
);
