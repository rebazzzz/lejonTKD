// Filter schedule by group functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterSelect = document.getElementById('group-filter');
    const scheduleDays = document.querySelectorAll('.schedule-day');

    if (!filterSelect || scheduleDays.length === 0) return;

    filterSelect.addEventListener('change', function () {
        const selectedValue = filterSelect.value.toLowerCase();

        scheduleDays.forEach(day => {
            const dayText = day.textContent.toLowerCase();

            if (selectedValue === 'alla' || dayText.indexOf(selectedValue) !== -1) {
                day.style.display = '';
            } else {
                day.style.display = 'none';
            }
        });
    });
});
