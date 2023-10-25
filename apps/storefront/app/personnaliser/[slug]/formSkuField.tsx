import { UseFormSetValue } from 'react-hook-form';
import { Field } from '@couture-next/ui';
import { Article, Sku } from '@couture-next/types';
import { AddToCartFormType } from './page';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

type Props = {
  article: Article;
  value: AddToCartFormType['skuId'];
  setValue: UseFormSetValue<AddToCartFormType>;
  onNextStep: () => void;
};

export default function FormSkuField({
  article,
  value,
  setValue,
  onNextStep,
}: Props) {
  const [selection, setSelection] = useState<Record<string, string>>({});
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // force selection to value
  useEffect(() => {
    if (value) {
      const sku = article.skus.find((sku) => sku.uid === value);
      if (sku) {
        setSelection(sku.characteristics);
      }
    }
  }, [article.skus, value, setSelection]);

  const selectSku = useCallback(
    (sku: Sku | undefined) => {
      const params = new URLSearchParams(queryParams.toString());
      if (sku) {
        setValue('skuId', sku.uid);
        params.set('sku', sku.uid);
      } else {
        setValue('skuId', '');
        params.delete('sku');
      }
      router.push(pathname + '?' + params.toString());
    },
    [pathname, router, setValue, queryParams]
  );

  // if only one sku, select it
  useEffect(() => {
    if (article.skus.length === 1) {
      selectSku(article.skus[0]);
      setSelection(article.skus[0].characteristics);
    }
  }, [article.skus, setSelection, selectSku]);

  const select = useCallback(
    (characteristicId: string, valueId: string) => {
      setSelection((selection) => {
        const nextSelection = {
          ...selection,
          [characteristicId]: valueId,
        };

        const sku = article.skus.find((sku) =>
          Object.entries(sku.characteristics).every(
            ([characteristicId, characteristicValueId]) =>
              selection[characteristicId] === characteristicValueId
          )
        );
        selectSku(sku);

        return nextSelection;
      });
    },
    [article.skus, setSelection, selectSku]
  );

  return (
    <>
      <h2 className="font-serif text-2xl mb-4">1. Je choisis ma couverture</h2>
      <div>
        <h3 className="font-bold">Description</h3>
        {article.description.split('\n').map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="grid gap-4">
          {Object.entries(article.characteristics).map(
            ([characteristicId, characteristic]) => (
              <div key={characteristicId}>
                <Field
                  label={characteristic.label}
                  labelClassName="!items-start"
                  widgetId={characteristicId}
                  renderWidget={(className) => (
                    <select
                      key={characteristicId}
                      className={className}
                      onChange={(e) => select(characteristicId, e.target.value)}
                      id={characteristicId}
                    >
                      <option value="">Choisissez une option</option>
                      {Object.entries(characteristic.values).map(
                        ([valueId, valueLabel]) => (
                          <option
                            key={valueId}
                            value={valueId}
                            selected={selection[characteristicId] === valueId}
                          >
                            {valueLabel}
                          </option>
                        )
                      )}
                    </select>
                  )}
                />
              </div>
            )
          )}
        </div>
        <button
          type="button"
          className={clsx(
            'btn-primary mx-auto mt-8',
            !value && 'opacity-50 cursor-not-allowed'
          )}
          onClick={onNextStep}
          disabled={!value}
        >
          Suivant
        </button>
      </div>
    </>
  );
}