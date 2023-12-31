'use client';

import { ButtonWithLoading, Field } from '@couture-next/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import env from 'apps/storefront/env';
import useFunctions from 'apps/storefront/hooks/useFunctions';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useMemo, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Format de l'email invalide"),
  subject: z.string().min(5, 'Le sujet doit faire au moins 5 caractères'),
  message: z.string().min(5, 'Le message doit faire au moins 5 caractères'),
  botField: z.string().max(0, 'Suspition de spam, rechargez la page'),
  recaptchaToken: z.any().transform(async (recaptcha, ctx) => {
    if (!recaptcha || !recaptcha.executeAsync) {
      ctx.addIssue({
        code: 'custom',
        message: 'Impossible de vérifier le recaptcha, rechargez la page',
        path: [],
      });
      return z.NEVER;
    }
    try {
      const token = await (recaptcha as ReCAPTCHA).executeAsync();
      if (!token) {
        ctx.addIssue({
          code: 'custom',
          message: 'Suspition de spam, rechargez la page',
          path: [],
        });
        return z.NEVER;
      }
      return token;
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        message: 'Impossible de vérifier le recaptcha, rechargez la page',
        path: [],
      });
      return z.NEVER;
    }
  }),
});

type SchemaType = z.infer<typeof schema>;

export default function Form() {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema, {
      async: true,
    }),
    defaultValues: {
      botField: '',
    },
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    form.setValue('recaptchaToken', recaptchaRef.current as any);
  }, [recaptchaRef.current]);

  const functions = useFunctions();
  const callSendContactForm = useMemo(() => httpsCallable(functions, 'callSendContactEmail'), [functions]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await callSendContactForm(data);
    } catch (e) {}
  });

  return (
    <form className="max-w-prose mx-auto" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 mb-6">
        <Field
          label="Sujet"
          widgetId="subject"
          labelClassName="!items-start mt-4"
          error={form.formState.errors.subject?.message}
          renderWidget={(className) => (
            <input {...form.register('subject')} className={className} required type="subject" />
          )}
        />
        <Field
          label="Email"
          widgetId="email"
          error={form.formState.errors.email?.message}
          labelClassName="!items-start"
          renderWidget={(className) => <input {...form.register('email')} className={className} required />}
        />
        <Field
          label="Message"
          widgetId="message"
          error={form.formState.errors.message?.message}
          labelClassName="!items-start"
          renderWidget={(className) => <textarea {...form.register('message')} className={className} required />}
        />
        <div className="sr-only" aria-hidden>
          <label htmlFor="bot-field">Ne pas remplir si vous êtes un humain</label>
          <input {...form.register('botField')} />
        </div>
        <ReCAPTCHA sitekey={env.RECAPTCHA_SITE_KEY} size="invisible" ref={recaptchaRef} />

        <p className="text-red-500 empty:hidden text-xs">{form.formState.errors.botField?.message}</p>
        <p className="text-red-500 empty:hidden text-xs">{form.formState.errors.recaptchaToken?.message}</p>
      </div>

      <ButtonWithLoading loading={form.formState.isSubmitting} type="submit" className="mx-auto btn-primary">
        Envoyer
      </ButtonWithLoading>
    </form>
  );
}
