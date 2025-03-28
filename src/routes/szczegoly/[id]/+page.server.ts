export async function load({ params, cookies }) {
	const data = {
		serwer: cookies.get('serwer'),
		token: cookies.get('token'),
		mies_rozl: cookies.get('mies_rozl'),
		data_raport: cookies.get('data_raport'),
		email: cookies.get('email')
	};

	const api_route = 'https://' + data.serwer + '/api/v3';
	const api_token = data.token;
	const afterTimestamp = 1;
	const beforeTimestamp = new Date().getTime() / 1000;
	const endpoint = `channels/${params.id}/measurement-logs?afterTimestamp=${afterTimestamp}&beforeTimestamp=${beforeTimestamp}&order=DESC&limit=5000&offset=0`;

	const response = await fetch(api_route + '/' + endpoint, {
		method: 'GET',
		headers: {
			authorization: `Bearer ${api_token}`
		}
	});

	let responseJson = null;

	if (response.ok) {
		responseJson = await response.json();
	} else {
		return null;
	}

	type imageData = {
		imageCropped: string;
		createdAt: string;
		resultMeasurement: number;
		measurementValid: boolean;
	};

	const imageData: imageData[] = [];
	const imageResponse = await fetch(
		`https://${data.serwer}/api/integrations/ocr/${params.id}/images`,
		{
			method: 'GET',
			headers: {
				authorization: `Bearer ${api_token}`,
				'X-Accept-Version': '3'
			}
		}
	);

	type image = {
		imageCropped: string;
		createdAt: string;
		resultMeasurement: number;
		measurementValid: boolean;
	};

	let imageResponseJson = null;
	if (imageResponse.ok) {
		imageResponseJson = await imageResponse.json();
		imageResponseJson.forEach((image: image) => {
			imageData.push({
				imageCropped: image.imageCropped,
				createdAt: new Date(image.createdAt).toLocaleString(),
				resultMeasurement: image.resultMeasurement,
				measurementValid: image.measurementValid
			});
		});
	} else {
		return null;
	}

	let device = {};
	const deviceResponse = await fetch(
		`https://${data.serwer}/api/v3/channels/${params.id}?include=iodevice,connected,state,location`,
		{
			method: 'GET',
			headers: {
				authorization: `Bearer ${api_token}`
			}
		}
	);

	if (deviceResponse.ok) {
		const deviceJSON = await deviceResponse.json();
		device = {
			channelId: deviceJSON.id,
			channelCaption: deviceJSON.caption,
			deviceEnabled: deviceJSON.iodevice.enabled,
			deviceName: deviceJSON.iodevice.name,
			deviceComment: deviceJSON.iodevice.comment,
			locationCaption: deviceJSON.location.caption,
			calculatedValue: deviceJSON.state.calculatedValue,
			unit: deviceJSON.state.unit,
			connected: deviceJSON.state.connected
		};
	} else {
		return null;
	}

	return {
		id: params.id,
		data: JSON.stringify(responseJson),
		images: imageData,
		device: device
	};
}
