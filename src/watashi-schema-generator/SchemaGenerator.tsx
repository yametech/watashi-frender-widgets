import React, { useEffect } from 'react';
import Generator from 'fr-generator';
import { Modal, Button } from 'antd';
// fr-generator 1.0 未提交声明文件 等待 fr-generator 更新
// import {
// 	defaultSettings,
// 	defaultCommonSettings,
// 	defaultGlobalSettings,
// } from 'fr-generator';
import {
	defaultSettings,
	defaultCommonSettings,
	defaultGlobalSettings,
} from './settings';
import { useRef, useState } from 'react';
import RemoteDataSelect from '../wataishi-widgets/RemoteDataSelect';
import CascadeSelect from '../wataishi-widgets/CascadeSelect';
import { useForm } from 'form-render';
import { ExpandFormRender } from '../watashi-form-render/ExpandFormRender';

// const defaultValue = {
// 	schema: {
// 		type: 'object',
// 		properties: {
// 			inputName: {
// 				title: '简单输入框',
// 				type: 'string',
// 			},
// 		},
// 	},
// 	displayType: 'row',
// 	showDescIcon: true,
// 	labelWidth: 120,
// };

const defaultValue = {
	schema: {
		type: 'object',
		properties: {
			// inputName: {
			// 	title: '简单输入框',
			// 	type: 'string',
			// },
			// cascadeSelect_JFFNY3: {
			// 	title: '级联组件',
			// 	type: 'string',
			// 	'ui:widget': 'CascadeSelect',
			// 	searchBy: '{{formData.inputName}}',
			// },
			// cascadeSelect_JFFNY34: {
			// 	title: '级联组件',
			// 	type: 'string',
			// 	'ui:widget': 'CascadeSelect',
			// 	searchBy: '{{formData.cascadeSelect_JFFNY3}}',
			// },
		},
		'ui:displayType': 'row',
		'ui:showDescIcon': true,
	},
	displayType: 'row',
	showDescIcon: true,
};

type Props = {
	value?: any;
	templates?: any;
	schema?: any;
	onSave?: (value: any) => void;
	onChange?: (value: any) => void;
	onSchemaChange?: (schema: any) => void;
};

export function SchemaGenerator(props: Props) {
	const [data, setData] = useState({});
	const [effect, setEffect] = useState(false);
	const [schema, setSchma] = useState(() => props.schema || defaultValue);

	const genRef: any = useRef();
	const formRef = useForm();

	let settings: any = [
		{
			title: '自定义开发配置 随缘开发',
			widgets: [
				{
					text: '服务端下拉选框',
					name: 'asyncSelect',
					schema: {
						title: '来自服务端',
						type: 'string',
						'ui:widget': 'RemoteDataSelect',
					},
					widget: 'RemoteDataSelect',
					setting: {
						fetchUrl: { title: '请求地址', type: 'string' },
					},
				},
				{
					text: '级联组件',
					name: 'cascadeSelect',
					schema: {
						title: '级联组件',
						type: 'string',
						'ui:widget': 'CascadeSelect',
					},
					widget: 'CascadeSelect',
					setting: {
						searchBy: { title: '关联组件id', type: 'string' },
						fetchUrl: { title: '请求地址', type: 'string' },
					},
				}
			],
		},
	];

	// useEffect(() => {
	// 	if (JSON.stringify(props.schema) != '{}') {
	// 		setSchma(props.schema);
	// 	}
	// }, [props.schema]);

	let concatD = settings.concat(defaultSettings);

	return (
		<>
			<Generator
				widgets={{ RemoteDataSelect, CascadeSelect }}
				// defaultValue={JSON.stringify(schema) != '{}' ? schema : defaultValue}
				defaultValue={defaultValue}
				settings={concatD}
				ref={genRef}
				onChange={(data) => {
					setTimeout(() => {
						const schema = genRef.current && genRef.current.getValue();
						setSchma(schema);
						props.onSchemaChange && props.onSchemaChange(schema);
					}, 500);
					setData(data);
					props.onChange && props.onChange(data);
				}}
				extraButtons={[
					false,
					true,
					true,
					true,
					{
						text: '保存',
						onClick: () => {
							props.onSave && props.onSave(schema);
						},
					},
					{
						text: '展示',
						onClick: () => setEffect(true),
					},
				]}
			/>
			<Modal
				title='展示'
				visible={effect}
				onCancel={() => setEffect(false)}
				onOk={() => formRef.submit()}>
				<ExpandFormRender
					schema={schema?.schema}
					formRef={formRef}
					onFinish={(formData) => console.log(formData)}
				/>
			</Modal>
		</>
	);
}
