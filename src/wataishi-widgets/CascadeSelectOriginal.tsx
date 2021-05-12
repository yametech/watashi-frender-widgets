import React from 'react';
import { Select } from 'antd';
import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import { useState } from 'react';
const { Option } = Select;

let timeout: NodeJS.Timeout | null;
let currentValue: any;

function fetch(value: any, callback: (arg0: any[]) => void) {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
	currentValue = value;

	function fake() {
		const str = querystring.encode({
			code: 'utf-8',
			q: value,
		});
		jsonp(`https://suggest.taobao.com/sug?${str}`)
			.then((response) => response.json())
			.then((d) => {
				if (currentValue === value) {
					const { result } = d;
					const data: any[] = [];
					result.forEach((r: any) => {
						data.push({
							value: r[0],
							text: r[0],
						});
					});
					callback(data);
				}
			});
	}

	timeout = setTimeout(fake, 300);
}

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

	function handleSearch() {
		const { schema, addons } = props;

		if (schema.searchBy) {
			fetch(schema.searchBy, (data: any) => setData(data));
		} else {
			setData([]);
		}
	}

	function handleChange(value: any) {
		const { onChange, name, addons } = props;
		addons.setValue(addons.dataPath, value);
	}

	let { value, options: uiOptions } = props;
	const options = data.map((d: any) => (
		<Option key={d.value} value={d.value}>
			{d.text}
		</Option>
	));

	return (
		<Select
			{...uiOptions}
			style={{ width: '100%' }}
			showSearch
			value={value || undefined}
			defaultActiveFirstOption={false}
			filterOption={false}
			onClick={handleSearch}
			onChange={handleChange}
			notFoundContent={null}>
			{options}
		</Select>
	);
}
