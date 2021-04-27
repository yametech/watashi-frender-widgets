import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';
import { MixFormRender } from './watashi-form-render';
import { SchemaGenerator } from './watashi-schema-generator';

ReactDOM.render(
	<React.StrictMode>
		<SchemaGenerator
			onSave={(value: any) => console.log(value)}
			onChange={(schema: any) => {
				console.log(schema);
			}}
			onSchemaChange={(value: any) => {
				console.log(value);
			}}
		/>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
