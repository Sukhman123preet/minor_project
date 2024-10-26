const ctx = document.getElementById('myChart').getContext('2d');

const labels = ['Exam 1', 'Exam 2', 'Exam 3', 'Others'];
const data = [150, 120, 100, 200]; // Replace with processed data from the previous step

new Chart(ctx, {
  type: 'pie',
  data: {
    labels: labels,
    datasets: [{
      label: 'Number of Students',
      data: data,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  }
});
