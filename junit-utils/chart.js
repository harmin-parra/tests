async function display_chart(data) {
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        datasets: {
          bar: {
            barThickness: 30
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              // display: false,
              minRotation: 60,
              maxRotation: 60,
            },
          },
          y: {
            beginAtZero: true,
            stacked: true
          },
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function() {
                return '';
              },
              footer: function(tooltipItems) {
                const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
                return 'Total: ' + total;
              },
            },
          },
        },
      },
    });
}

async function getChartData(url) {
    let chart_data;
    try {
        chart_data = await fetchJson(url);
    } catch (error) {
        return {};
    }

    if (!validateChartData(chart_data)) {
        console.error(`Chart data is invalid: labels and datasets have different sizes.\n${chart_data}`);
        return {};
    }

    data = {
      labels: chart_data.labels,
      datasets: [
        {
          label: 'passed',
          data: chart_data.datasets[0],
          backgroundColor: 'rgb(0, 190, 0)',
        },
        {
          label: 'failed',
          data: chart_data.datasets[1],
          backgroundColor: 'rgb(255, 0, 0)',
        },
        {
          label: 'skipped',
          data: chart_data.datasets[2],
          backgroundColor: 'rgb(0, 115, 255)',
        },
        {
          label: 'other',
          data: chart_data.datasets[3],
          backgroundColor: 'rgb(0, 0, 0)',
        },
      ],
    };
    return data;
}

function validateChartData(data) {
    const size = data.labels.length;
    return data.datasets.every(dataset => dataset.length === size);
}
