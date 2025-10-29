document.addEventListener('DOMContentLoaded', () => {
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const bookingForm = document.getElementById('bookingForm');
    const confirmationMsg = document.getElementById('confirmation');
    const availabilityMsg = document.getElementById('availabilityMsg');

    // --- 1. SET MINIMUM DATE (Today) ---
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);


    // --- 2. DEFINE AVAILABLE SLOTS (SIMULATION) ---
    // In a real app, this data would come from a server (API)
    const availableSlots = [
        "09:00", "10:30", "12:00", "13:30", "15:00", "16:30"
    ];

    // --- 3. FUNCTION TO POPULATE TIME SLOTS ---
    function populateTimeSlots(slots) {
        timeSelect.innerHTML = '<option value="">-- Select Time --</option>'; // Reset options
        if (slots.length > 0) {
            slots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                timeSelect.appendChild(option);
            });
            availabilityMsg.textContent = `Available slots found.`;
            availabilityMsg.className = 'message success';
            timeSelect.disabled = false;
        } else {
            availabilityMsg.textContent = 'No slots available for this date. Please choose another day.';
            availabilityMsg.className = 'message error';
            timeSelect.disabled = true;
        }
        availabilityMsg.style.display = 'block';
    }


    // --- 4. EVENT LISTENERS FOR DATE/SERVICE CHANGE ---
    // For a simple demo, we'll run the same simulation regardless of service,
    // but in a real app, service length affects available times.
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        
        if (!selectedDate) {
            availabilityMsg.style.display = 'none';
            timeSelect.innerHTML = '<option value="">-- Select Time --</option>';
            return;
        }

        // --- SIMULATION LOGIC ---
        // Simulate a "fully booked" date (e.g., all Sundays or a specific day)
        const dayOfWeek = new Date(selectedDate).getDay(); // 0 is Sunday, 6 is Saturday
        
        if (dayOfWeek === 0) { // If it's a Sunday (or any simulated fully booked date)
            populateTimeSlots([]); // Show no slots
        } else {
            populateTimeSlots(availableSlots); // Show all simulated slots
        }
    });


    // --- 5. FORM SUBMISSION HANDLER ---
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the form from submitting and reloading the page

        // Simple validation check (since HTML required attribute does most of the work)
        if (timeSelect.value === "") {
            alert("Please select a time slot.");
            return;
        }

        // --- GATHER DATA (for simulation only) ---
        const bookingDetails = {
            service: serviceSelect.options[serviceSelect.selectedIndex].textContent,
            date: dateInput.value,
            time: timeSelect.value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        // --- SIMULATED SUCCESS MESSAGE ---
        console.log("Booking Data:", bookingDetails);
        confirmationMsg.innerHTML = `✅ **Success!** Your booking for **${bookingDetails.service}** on **${bookingDetails.date} at ${bookingDetails.time}** has been confirmed. A confirmation email has been sent to ${bookingDetails.email}.`;
        confirmationMsg.style.display = 'block';

        // Clear the form after a simulated successful submission
        bookingForm.reset();
        timeSelect.innerHTML = '<option value="">-- Select Time --</option>'; // Reset time slot
        availabilityMsg.style.display = 'none'; // Hide availability message
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const dateInput = document.getElementById('booking-date');
    const timeInput = document.getElementById('booking-time');
    const timeMessage = document.getElementById('time-message');
    
    // Set the minimum selectable time for weekdays (Monday=1 to Friday=5)
    const MIN_WEEKDAY_TIME = '17:30'; // 5:00 PM
    
    // Function to update the time input constraints
    const updateTimeConstraints = () => {
        const selectedDateValue = dateInput.value;
        
        // If no date is selected, do nothing
        if (!selectedDateValue) {
            timeInput.removeAttribute('min');
            timeMessage.textContent = '';
            return;
        }
        
        // 1. Get the day of the week (0 = Sunday, 6 = Saturday)
        const selectedDate = new Date(selectedDateValue);
        const dayOfWeek = selectedDate.getDay(); 
        
        // 2. Check if it's a Weekday (Monday: 1 to Friday: 5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // It's a Weekday (Mon-Fri)
            
            // Set the minimum time to 5:00 PM (17:00)
            timeInput.setAttribute('min', MIN_WEEKDAY_TIME);
            timeMessage.textContent = '⚠️ Weekday booking: Time must be 5:30 PM or later.';
            
            // If a time has already been selected that is before 5 PM, clear it
            if (timeInput.value && timeInput.value < MIN_WEEKDAY_TIME) {
                timeInput.value = MIN_WEEKDAY_TIME; 
            }
            
        } else {
            // It's a Weekend (Sunday: 0 or Saturday: 6)
            
            // Remove the minimum time constraint
            timeInput.removeAttribute('min');
           
            timeMessage.textContent = '✅ Weekend booking: Any time is available.';
            
            // Reset the time input's value to allow any time selection
            if (timeInput.value === MIN_WEEKDAY_TIME) {
                 timeInput.value = ''; // Clear or set a default early time if needed
            }
        }
    };

    // Event listeners to call the function whenever the date changes
    dateInput.addEventListener('change', updateTimeConstraints);
    
    // Also run it once on page load if the date input has a default value
    updateTimeConstraints();
});