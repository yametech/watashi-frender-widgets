import React, { useEffect, useState } from 'react';
import { Menu, Dropdown, Collapse, Popconfirm } from 'antd';
import { DeleteTwoTone, DownOutlined } from '@ant-design/icons';
import FormRender, { useForm } from 'form-render';
import CascadeSelect from '../wataishi-widgets/CascadeSelect';
import { MenuInfo } from 'rc-menu/lib/interface';

const axios = require('axios');
const { SubMenu } = Menu;
const { Panel } = Collapse;

type Props = {
	onChange(forms: any): void;
	onValidate(): void;
	forms?: any[];
	url?: string;
	numbers?: number;
	axios?: any;
};

export function MixFormRender(props: Props) {
	const [url, setUrl] = useState(props.url || 'http://0.0.0.0:8000');
	const [forms, setForms] = useState(props.forms || []);
	const [numbers, setNumbers] = useState(10);
	const [menuList, setMenuList] = useState([]);

	const formRef = useForm();

	useEffect(() => {
		axios.get(url + `/api/fr/select/`).then((r: { data: { data: any } }) => {
			setMenuList(r.data.data);
		});
	}, [menuList]);

	function setFormData(index: number, data: any) {
		forms[index].formData = data;
		setForms(forms);
		props.onChange(forms);
	}

	function renderMenu() {
		return (
			<Menu>
				{menuList.map(
					(p: {
						title: string;
						children: {
							key: string;
							title: string;
						}[];
					}) => {
						return (
							<SubMenu title={p.title}>
								{p.children.map(
									(m: {
										key: React.Key | null | undefined;
										title:
											| boolean
											| React.ReactChild
											| React.ReactFragment
											| React.ReactPortal
											| null
											| undefined;
									}) => {
										return (
											<Menu.Item key={m.key} onClick={(e) => addStep(e)}>
												{m.title}
											</Menu.Item>
										);
									}
								)}
							</SubMenu>
						);
					}
				)}
			</Menu>
		);
	}

	function addStep(e: MenuInfo) {
		axios
			.get(url + `/api/fr/schema/${e.key}`)
			.then((r: { data: { data: { schema: any; key: any } } }) => {
				forms.push({
					schema: r.data.data.schema,
					formData: {},
					key: r.data.data.key,
				});
				setForms(forms);
			});
	}

	function genExtra(index: number) {
		return (
			<Popconfirm
				placement='topRight'
				title={'确认删除'}
				onConfirm={() => {
					forms.splice(index, 1);
					setForms(forms);
					props.onChange(forms);
				}}
				okText='是'
				cancelText='否'>
				<DeleteTwoTone />
			</Popconfirm>
		);
	}

	return (
		<div style={{ padding: 10 }}>
			{numbers > forms.length ? (
				<Dropdown overlay={renderMenu}>
					<a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
						添加步骤 <DownOutlined />
					</a>
				</Dropdown>
			) : null}
			<Collapse ghost defaultActiveKey={[0]}>
				{forms.map(
					(
						form: {
							key: string;
							id: string | number;
						},
						index: number
					) => {
						return (
							<Panel header={form.key} key={form.id} extra={genExtra(index)}>
								<FormRender
									schema={{}}
									form={formRef}
									onFinish={() => {}}
									// widgets={{ CascadeSelect }}
								/>
							</Panel>
						);
					}
				)}
			</Collapse>
		</div>
	);
}
