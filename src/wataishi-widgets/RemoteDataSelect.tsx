import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const RemoteDataSelect = (props: any) => {
	const [options, setOptions] = useState([]);
	const [url, setUrl] = useState(props.schema.fetchUrl || '');

	function getRemoteData() {
		axios(url).then((res: any) => {
			setOptions(res.data.data);
		});
	}

	useEffect(() => {
		getRemoteData();
	}, []);

	const { value, uiOptions } = props;

	function renderOptions() {
		return (
			<>
				{options?.length &&
					options.map((d: any) => (
						<Option value={d.value} key={d.value}>
							{d.key}
						</Option>
					))}
			</>
		);
	}
	function handleChange(value: any) {
		const { addons } = props;
		addons.setValue(addons.dataPath, value);
	}

	return (
		<div style={{ width: '400px' }}>
			<Select
				{...uiOptions}
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
		</div>
	);
};

export default RemoteDataSelect;
