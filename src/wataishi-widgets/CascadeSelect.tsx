import React from 'react';
import { Select } from 'antd';
import querystring from 'querystring';
import { useState } from 'react';
import axios from 'axios';
const { Option } = Select;

let timeout: NodeJS.Timeout | null;
let currentValue: any;

interface Props {
	schema?: any;
	name?: string;
	value?: string;
	options?: any;
	onChange?: any;
	addons?: any;
	// fetch: (value: any, callback: any) => void;
}

export default function (props: Props) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [url, setUrl] = useState(props.schema.fetchUrl || '');

	function fetch(value: any, callback: (arg0: any[]) => void) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		currentValue = value;
	
		function request() {
			const str = querystring.encode({
				code: 'utf-8',
				q: value,
			});
			if(!url) { console.log('please set request url') }
			axios(`${url}?${str}`).then((res: any) => {
				callback(res.data?.data || [])
			})
		}
	
		timeout = setTimeout(request, 300);
	}

	function handleSearch() {
		const { schema, addons } = props;
		if (schema.searchBy) {
			setLoading(true)
			fetch(schema.searchBy, (data: any) => {
				setData(data)
				setLoading(false)
			});
		} else {
			setData([]);
			addons.setValue(addons.dataPath, undefined);
		}
	}

	function handleChange(value: any) {
		const { addons, schema } = props;
		addons.setValue(addons.dataPath, value);
		let affectArr = schema?.affectTo?.split(',') || []
		affectArr.forEach((item: any) => {
			addons.setValue(item, undefined);
		})
	}

	let { value, options: uiOptions } = props;
	const options = data.map((d: any) => (
		<Option key={d.value} value={d.value}>
			{d.label}
		</Option>
	));

	return (
		<Select
			{...uiOptions}
			placeholder='请选择'
			style={{ width: '100%' }}
			showSearch
			value={value || undefined}
			defaultActiveFirstOption={false}
			filterOption={false}
			onClick={handleSearch}
			onChange={handleChange}
			notFoundContent={null}
			loading={loading}>
			{options}
		</Select>
	);
}

