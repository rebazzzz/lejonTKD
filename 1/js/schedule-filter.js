// Filter schedule by group functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterSelect = document.getElementById('group-filter');
    const scheduleDays = document.querySelectorAll('.schedule-day');

    if (!filterSelect || scheduleDays.length === 0) return;

    filterSelect.addEventListener('change', function () {
        const selectedGroup = filterSelect.value;

        scheduleDays.forEach(day => {
            const groupSlots = day.querySelectorAll('.group-slot');
            
            if (selectedGroup === 'alla') {
                // Show all days and all group slots
                day.style.display = '';
                groupSlots.forEach(slot => {
                    slot.style.display = '';
                });
            } else {
                // Check if this day has the selected group
                let hasSelectedGroup = false;
                
                groupSlots.forEach(slot => {
                    const slotGroup = slot.getAttribute('data-group');
                    
                    if (slotGroup === selectedGroup) {
                        // Show only the selected group's slot
                        slot.style.display = '';
                        hasSelectedGroup = true;
                    } else {
                        // Hide other groups' slots
                        slot.style.display = 'none';
                    }
                });
                
                // Show the day only if it has the selected group
                if (hasSelectedGroup) {
                    day.style.display = '';
                } else {
                    day.style.display = 'none';
                }
            }
        });
    });
});
