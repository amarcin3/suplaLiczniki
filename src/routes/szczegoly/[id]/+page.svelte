<script lang="ts">
	import { onMount } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let ApexCharts: any;
	async function loadApexCharts() {
		if (typeof window !== 'undefined') {
			ApexCharts = (await import('apexcharts')).default;
		}
	}
	type Measurement = {
		date_timestamp: number;
		calculated_value: number;
	};

	export let data: {
		id: string;
		data: string;
		images: {
			imageCropped: string;
			createdAt: string;
			resultMeasurement: number;
			measurementValid: boolean;
		}[];
		device: {
			channelId: string;
			channelCaption: string;
			deviceName: string;
			deviceComment: string;
			locationCaption: string;
			calculatedValue: number;
			unit: string;
		};
	};

	let deviceMeasurements: Measurement[] = JSON.parse(data.data);
	deviceMeasurements.sort((a, b) => a.date_timestamp - b.date_timestamp);

	let images: {
		imageCropped: string;
		createdAt: string;
		resultMeasurement: number;
		measurementValid: boolean;
	}[] = data.images;

	// Liczba równomiernie rozmieszczonych punktów.
	const intervalCount: number = 50;

	// Stan toggle (true = wartości licznika, false = zużycie)
	let showCalculated: boolean = true;

	// Referencja do kontenera wykresu.
	let chartElement: HTMLDivElement;
	// eslint-disable-next-line no-undef
	let chart: ApexCharts;

	let timeOffset = new Date().getTimezoneOffset() * 60 * 1000;
	// Domyślne wartości dat bazujące na pomiarach.
	let startDateStr: string =
		deviceMeasurements.length > 0
			? new Date(deviceMeasurements[0].date_timestamp * 1000 - timeOffset)
					.toISOString()
					.slice(0, 16)
			: '';
	let endDateStr: string =
		deviceMeasurements.length > 0
			? new Date(
					deviceMeasurements[deviceMeasurements.length - 1].date_timestamp * 1000 - timeOffset
				)
					.toISOString()
					.slice(0, 16)
			: '';

	// Generowanie równomiernie rozmieszczonych dat między start a end.
	function generateEvenlySpacedDates(start: Date, end: Date, count: number): Date[] {
		const dates: Date[] = [];
		const startTime = start.getTime();
		const endTime = end.getTime();
		const interval = (endTime - startTime) / (count - 1);
		for (let i = 0; i < count; i++) {
			dates.push(new Date(startTime + i * interval));
		}
		return dates;
	}

	// Dla danej daty zwróć pomiar najbliższy do niej.
	function getClosestMeasurement(target: Date): Measurement {
		let closest: Measurement = deviceMeasurements[0];
		let minDiff = Math.abs(new Date(closest.date_timestamp * 1000).getTime() - target.getTime());
		for (let measurement of deviceMeasurements) {
			const currentDiff = Math.abs(
				new Date(measurement.date_timestamp * 1000).getTime() - target.getTime()
			);
			if (currentDiff < minDiff) {
				minDiff = currentDiff;
				closest = measurement;
			}
		}
		return closest;
	}

	// Budowanie danych wykresu na podstawie dat, stanu toggle i pomiarów.
	function getChartData() {
		if (!startDateStr || !endDateStr) {
			return { labels: [], data: [] };
		}
		const startDate = new Date(startDateStr);
		const endDate = new Date(endDateStr);

		const labels: Date[] = generateEvenlySpacedDates(startDate, endDate, intervalCount);
		const values: number[] = labels.map((label) => {
			const measurement = getClosestMeasurement(label);
			const value =
				measurement.calculated_value > 1000
					? measurement.calculated_value / 1000
					: measurement.calculated_value;
			return parseFloat(value.toFixed(3));
		});

		if (showCalculated) {
			return { labels, data: values };
		} else {
			const diffs: number[] = [];
			for (let i = 0; i < values.length - 1; i++) {
				diffs.push(parseFloat((values[i + 1] - values[i]).toFixed(3)));
			}
			return { labels: labels.slice(1), data: diffs };
		}
	}

	// Budowanie opcji dla ApexCharts.
	function getChartOptions() {
		const { labels, data: chartData } = getChartData();
		return {
			chart: {
				type: 'bar',
				height: 350
			},
			series: [
				{
					name: showCalculated ? 'Stan licznika' : 'Zużycie',
					data: chartData
				}
			],
			xaxis: {
				categories: labels.map((date) => new Date(date).toTimeString().split(' ')[0]),
				labels: {
					rotate: 0,
					hideOverlappingLabels: true
				}
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '95%'
				}
			},
			dataLabels: {
				enabled: false
			},
			yaxis: {
				title: {
					text: showCalculated ? 'Stan licznika' : 'Zużycie'
				},
				min: 0
			}
		};
	}

	// Aktualizacja wykresu z aktualnymi danymi.
	function updateChart() {
		const options = getChartOptions();
		if (chart) {
			chart.updateOptions(options);
		}
	}

	// Aktualizacja wykresu przy zmianie dat.
	function onDateChange() {
		updateChart();
	}

	onMount(() => {
		loadApexCharts().then(() => {
			const options = getChartOptions();
			chart = new ApexCharts(chartElement, options);
			chart.render();
		});
	});
</script>

<svelte:head>
	<title>Szczegóły</title>
	<meta name="description" content="Szczegóły" />
</svelte:head>

<section id="container">
	<div class="data">
		<div class="txt-group">
			<p class="large">{data.device.channelCaption}</p>
			<p class="small">Urządzenie: {data.device.deviceName} ({data.device.deviceComment})</p>
			<p class="small">Lokalizacja: {data.device.locationCaption}</p>
			<br />
			<p class="xl">
				Wskazanie:
				{#if data.device.calculatedValue === 0}
					<span class="possibly-out-of-date tooltip">
						<span class="tooltiptext xs"
							>Podana wartość może być przestarzała, zobacz zdjęcia aby odczytać najnowszą wartość</span
						>
						{data.device.calculatedValue !== 0
							? data.device.calculatedValue
							: deviceMeasurements[deviceMeasurements.length - 1].calculated_value}
					</span>
				{:else}
					{data.device.calculatedValue !== 0
						? data.device.calculatedValue
						: deviceMeasurements[deviceMeasurements.length - 1].calculated_value}
				{/if}
				{data.device.unit === 'm3' ? 'm<sup>3</sup>' : data.device.unit}
			</p>
		</div>
	</div>
	<div class="lastMeasurements">
		<p class="small">Ostatnie pomiary</p>
		<table>
			<thead>
				<tr>
					<td>Data</td>
					<td>Obraz</td>
					<td>Odczyt</td>
				</tr>
			</thead>
			<tbody>
				{#each images as image (image)}
					<tr class={image.measurementValid ? 'valid' : 'invalid'}>
						<td><p>{image.createdAt}</p></td>
						<td><img src={'data:image/png;base64, ' + image.imageCropped} alt="measurement" /></td>
						<td><p>{image.resultMeasurement}</p></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="chart">
		<div style="margin-bottom: 1rem;">
			<div>
				<label class="small">
					Od:
					<input type="datetime-local" bind:value={startDateStr} on:change={onDateChange} />
				</label>
				<label class="small">
					Do:
					<input type="datetime-local" bind:value={endDateStr} on:change={onDateChange} />
				</label>
				<label>
					<input type="checkbox" bind:checked={showCalculated} on:change={updateChart} />
					Pokaż stan licznika
				</label>
				<label>
					<input type="button" value="Zakresy czasu" />
					<ul class="dropdown-menu">
						<li value="6h">ostatnie 6 godzin</li>
						<li value="24h">ostatnie 24 godzin</li>
						<li value="today">dziś</li>
						<li value="yesterday">wczoraj</li>
						<li value="7d">ostatnie 7 dni</li>
						<li value="30d">ostatnie 30 dni</li>
						<li value="month">bieżący miesiąc</li>
						<li value="year">bieżący rok</li>
						<li value="all">cała historia</li>
					</ul>
				</label>
				<label>
					<select>
						<option>Agregacja: minuty</option>
					</select>
				</label>
			</div>
		</div>
		<div bind:this={chartElement}></div>
	</div>
</section>

<!--suppress CssUnusedSymbol -->
<style>
	* {
		font-family: Calibri, sans-serif;
		box-sizing: border-box;
		margin: 0;
	}

	#container {
		margin: 0 auto;
		width: 100%;
		display: grid;
		grid-template-columns: auto auto auto;
		grid-template-rows: auto auto;
		gap: 15px;
		grid-auto-flow: row;
		grid-template-areas:
			'data data lastMeasurements'
			'chart chart lastMeasurements';
	}

	#container > div {
		position: relative;
		background: var(--gray1);
		border-radius: 9px;
		overflow: auto;
	}

	.data {
		grid-area: data;
		display: flex;
		flex-direction: column;
		padding: 1em;
	}

	.lastMeasurements {
		grid-area: lastMeasurements;
		display: flex;
		flex-direction: column;
		padding: 1em;
	}

	.lastMeasurements table {
		width: 100%;
		border-collapse: collapse;
		text-align: center;
	}

	.lastMeasurements tr {
		border-bottom: 1px solid var(--gray2);
	}

	.lastMeasurements img {
		max-height: 23px;
		width: auto;
	}

	.lastMeasurements .valid {
		background-color: #d4edda;
	}

	.lastMeasurements .invalid {
		background-color: #f8d7da;
	}
	.chart {
		grid-area: chart;
	}
	.possibly-out-of-date {
		text-decoration-line: underline;
		text-decoration-color: red;
	}

	.tooltip {
		position: relative;
		display: inline-block;
		cursor: pointer;
	}

	.tooltip .tooltiptext {
		opacity: 0;
		background-color: black;
		color: #fff;
		text-align: center;
		padding: 5px 0;
		border-radius: 6px;

		transition: opacity 0.25s;

		position: absolute;
		z-index: 1;

		width: 240px;
		bottom: 100%;
		left: 50%;
		margin-left: -120px;
	}
	.tooltip:hover .tooltiptext {
		opacity: 1;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1000;
		display: none;
		float: left;
		min-width: 160px;
		padding: 5px 0;
		margin: 2px 0 0;
		font-size: 14px;
		text-align: left;
		list-style: none;
		background-color: #fff;
		background-clip: padding-box;
		border: 1px solid #ccc;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 4px;
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
	}
</style>
