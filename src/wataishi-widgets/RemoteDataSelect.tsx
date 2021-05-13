import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const RemoteDataSelect = (props: any) => {
	const [options, setOptions] = useState([]);
	const [url, setUrl] = useState(props.schema.fetchUrl || '');
	const [value, setValue] = useState(undefined);
	const [loading, setLoading] = useState(false)

	function getRemoteData() {
		setLoading(true)
		axios(url).then((res: any) => {
			setOptions(res.data.data);
			setLoading(false);
		}).catch(() => {
			setLoading(false);
		})
	}

	useEffect(() => {
		getRemoteData();
	}, []);

	function renderOptions() {
		return (
			<>
				{options?.length &&
					options.map((d: any) => (
						<Option value={d.value} key={d.id || d.value}>
							{d.label}
						</Option>
					))}
			</>
		);
	}
	function handleChange(value: any) {
		setValue(value)
		const { addons, schema } = props;
		addons.setValue(addons.dataPath, value);
		let affectArr = schema?.affectTo?.split(',') || []
		affectArr.forEach((item: any) => {
			addons.setValue(item, undefined);
		})
	}

	const { uiOptions } = props;
	
	return (
		<Select
			{...uiOptions}
			placeholder='请输入'
			style={{ width: '100%' }}
			showSearch
			value={value || undefined}
			defaultActiveFirstOption={false}
			onChange={handleChange}
			notFoundContent={null}
			filterOption={(input, option: any) =>
				option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			}>
			{renderOptions()}
		</Select>
	);
};

export default RemoteDataSelect;
