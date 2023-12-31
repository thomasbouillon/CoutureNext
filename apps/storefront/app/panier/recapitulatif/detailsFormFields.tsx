import { UseFormRegister } from 'react-hook-form';
import { FinalizeFormType } from './page';

type Props = {
  register: UseFormRegister<FinalizeFormType>;
  baseFieldPath: 'shipping' | 'billing';
  variant?: 'default' | 'with-country';
};

const DetailsFormFields = ({ register, baseFieldPath, variant }: Props) => {
  return (
    <>
      <label htmlFor="civility" className="mt-2 block">
        Civilité
      </label>
      <select
        {...register(`${baseFieldPath}.civility`, { required: true })}
        id="civility"
        className="border w-full p-2 bg-transparent"
      >
        <option value="Mme">Mme</option>
        <option value="M">M</option>
      </select>
      <div className="md:grid md:grid-cols-2 md:gap-2">
        <div>
          <label className="mt-2 block" htmlFor="lastName">
            Nom
          </label>
          <input
            {...register(`${baseFieldPath}.lastName`, { required: true })}
            type="text"
            className="border w-full p-2"
          />
        </div>
        <div>
          <label className="mt-2 block" htmlFor="firstName">
            Prénom
          </label>
          <input
            {...register(`${baseFieldPath}.firstName`, { required: true })}
            type="text"
            className="border w-full p-2"
          />
        </div>
      </div>
      <label className="mt-2 block" htmlFor="address">
        Adresse
      </label>
      <input {...register(`${baseFieldPath}.address`, { required: true })} type="text" className="border w-full p-2" />
      <label className="mt-2 block" htmlFor="addressComplement">
        Complement d&apos;adresse
      </label>
      <input {...register(`${baseFieldPath}.addressComplement`)} type="text" className="border w-full p-2" />
      <div className="md:grid md:grid-cols-2 md:gap-2">
        <div>
          <label className="mt-2 block" htmlFor="zipCode">
            Code postal
          </label>
          <input
            {...register(`${baseFieldPath}.zipCode`, { required: true })}
            type="text"
            className="border w-full p-2"
          />
        </div>
        <div>
          <label className="mt-2 block" htmlFor="city">
            Ville
          </label>
          <input {...register(`${baseFieldPath}.city`, { required: true })} type="text" className="border w-full p-2" />
        </div>
      </div>
      {variant === 'with-country' && (
        <>
          <label className="mt-2 block" htmlFor="country">
            Pays
          </label>
          <input
            {...register(`${baseFieldPath}.country`, { required: true })}
            type="text"
            className="border w-full p-2"
          />
        </>
      )}
    </>
  );
};
DetailsFormFields.displayName = 'DetailsFormFields';

export default DetailsFormFields;
