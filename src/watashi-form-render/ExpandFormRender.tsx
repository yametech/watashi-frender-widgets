import React from 'react';
import FormRender, { useForm } from 'form-render';
import CascadeSelect from '../wataishi-widgets/CascadeSelect';
import RemoteDataSelect from '../wataishi-widgets/RemoteDataSelect';

type Props = {
	onFinish?: (formData: any) => void;
	formRef: any;
	schema: any;
};

export function ExpandFormRender(props: Props) {
	// const formRef = useForm();

	return (
		<FormRender
			schema={props.schema}
			form={props.formRef}
			onFinish={(formData: any) => {
				props.onFinish && props.onFinish(formData);
			}}
			widgets={{ CascadeSelect, RemoteDataSelect }}
		/>
	);
}
