export async function load({cookies}) {

    const data = {
        serwer: cookies.get('serwer'),
        token: cookies.get('token'),
        mies_rozl: cookies.get('mies_rozl'),
        data_raport: cookies.get('data_raport'),
        email: cookies.get('email')
    }

    const api_route = "https://" + data.serwer + "/api/v3"
    const api_token = data.token
    const endpoint = "channels?io=input&include=iodevice,location,state"

    const response = await fetch(api_route + "/" + endpoint, {
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

    type device = {
        channelId: number,
        channelCaption: string,
        deviceEnabled: boolean,
        deviceName: string,
        deviceComment: string,
        locationCaption: string,
        calculatedValue: number,
        unit: string,
        connected: boolean,
    }
    
    type responseDevice = {
        id: number,
        channelNumber: number,
        iodevice: {
            enabled: boolean,
            name: string,
            comment: string,
            id: number
            locationId: number
        },
        location: {
            caption: string,
            id: number
            enabled: boolean
        },
        caption: string,
        state: {
            calculatedValue: number,
            unit: string
            connected: boolean,
        }
    }
    
    const devices : device[] = []

    responseJson.forEach((device: responseDevice) => {
        devices.push({
            channelId: device.id,
            channelCaption: device.caption,
            deviceEnabled: device.iodevice.enabled,
            deviceName: device.iodevice.name,
            deviceComment: device.iodevice.comment,
            locationCaption: device.location.caption,
            calculatedValue: device.state.calculatedValue,
            unit: device.state.unit,
            connected: device.state.connected,
        })
    })

    return {
        props: devices
    }
}