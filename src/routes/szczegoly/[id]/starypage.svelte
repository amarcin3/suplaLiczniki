<script lang="ts">
    import { Chart } from "chart.js/auto";
    import { onMount } from "svelte";

    type Measurement = {
        date_timestamp: number;
        calculated_value: number;
    };

    export let data: {
        id: string;
        data: string;
        images: string[];
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

    let images: string[] = data.images;

    // Number of evenly spaced points.
    const intervalCount: number = 65;

    // Toggle state (true = calculated values, false = differences)
    let showCalculated: boolean = true;

    let ctx: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let chartInstance: Chart;

    // Default date values based on measurements.
    let startDateStr: string =
        deviceMeasurements.length > 0
            ? new Date(deviceMeasurements[0].date_timestamp * 1000)
                .toISOString()
                .slice(0, 16)
            : "";
    let endDateStr: string =
        deviceMeasurements.length > 0
            ? new Date(
                deviceMeasurements[deviceMeasurements.length - 1].date_timestamp * 1000
            )
                .toISOString()
                .slice(0, 16)
            : "";

    // Generate evenly spaced Date objects between start and end.
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

    // For a given date, return the measurement closest to it.
    function getClosestMeasurement(target: Date): Measurement {
        let closest: Measurement = deviceMeasurements[0];
        let minDiff = Math.abs(new Date(closest.date_timestamp * 1000).getTime() - target.getTime());
        for (let measurement of deviceMeasurements) {
            const currentDiff = Math.abs(new Date(measurement.date_timestamp * 1000).getTime() - target.getTime());
            if (currentDiff < minDiff) {
                minDiff = currentDiff;
                closest = measurement;
            }
        }
        return closest;
    }

    // Build chart data based on user date inputs, toggle state, and measurement values.
    function getChartData() {
        // Ensure both dates are provided.
        if (!startDateStr || !endDateStr) {
            return { labels: [], data: [] };
        }
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Generate evenly spaced datetime labels.
        const labels: Date[] = generateEvenlySpacedDates(startDate, endDate, intervalCount);
        // Map each label to the closest measurement value.
        const values: number[] = labels.map(label => {
            const measurement = getClosestMeasurement(label);
            return measurement.calculated_value > 1000 ? measurement.calculated_value / 1000 : measurement.calculated_value;
        });

        if (showCalculated) {
            return { labels, data: values };
        } else {
            const diffs: number[] = [];
            for (let i = 0; i < values.length - 1; i++) {
                diffs.push(values[i + 1] - values[i]);
            }
            return { labels: labels.slice(1), data: diffs };
        }
    }

    // Update the chart with current data.
    function updateChart() {
        const { labels, data: chartData } = getChartData();
        if (!chartInstance) return;
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = chartData;
        chartInstance.data.datasets[0].label = showCalculated ? "Stan licznika" : "Zużycie";
        chartInstance.update();
    }

    // Update chart when the date inputs change.
    function onDateChange() {
        updateChart();
    }

    onMount(() => {
        ctx = canvas.getContext("2d")!;
        const { labels, data: chartData } = getChartData();
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: showCalculated ? "Stan licznika" : "Zużycie",
                        data: chartData,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 5, // Limit the number of ticks
                            callback: function(value, index, values) {
                                return new Date(labels[index]).toLocaleString(); // Format the label using the labels array
                            }
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
</script>

<svelte:head>
    <title>Szczegóły</title>
    <meta name="description" content="Szczegóły" />
</svelte:head>

<section>
    {data.device.channelCaption} {data.device.deviceName} ({data.device.deviceComment}) w {data.device.locationCaption} {data.device.calculatedValue}{data.device.unit}
    <!-- Date selection inputs -->
    <div style="margin-bottom: 1rem;">
        <div>
            <label>
                Start Date:
                <input type="datetime-local" bind:value={startDateStr} on:change={onDateChange}>
            </label>
        </div>
        <div>
            <label>
                End Date:
                <input type="datetime-local" bind:value={endDateStr} on:change={onDateChange}>
            </label>
        </div>
    </div>

    <!-- Toggle switch -->
    <div style="margin-bottom: 1rem;">
        <label>
            <input type="checkbox" bind:checked={showCalculated} on:change={updateChart}>
            Show Calculated Values
        </label>
    </div>

    {#each images as image (image)}
        <img src={"data:image/png;base64, " + image} alt="device" />
    {/each}

    <canvas bind:this={canvas} width={32} height={32}></canvas>
</section>