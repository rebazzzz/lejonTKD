// Instructor Modal Functionality
(function() {
  'use strict';

  // Get modal elements
  const modal = document.getElementById('instructorModal');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const modalClose = modal?.querySelector('.modal-close');
  const readMoreButtons = document.querySelectorAll('.instructor-read-more');

  // Modal content elements
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalBelt = document.getElementById('modalBelt');
  const modalRole = document.getElementById('modalRole');
  const modalSpecialty = document.getElementById('modalSpecialty');
  const modalBio = document.getElementById('modalBio');

  // Function to open modal
  function openModal(instructorData) {
    if (!modal) return;

    // Populate modal with instructor data
    modalImage.src = instructorData.image;
    modalImage.alt = instructorData.name;
    modalTitle.textContent = instructorData.name;
    modalBelt.textContent = instructorData.belt;
    modalRole.textContent = instructorData.role;
    modalSpecialty.textContent = instructorData.specialty;
    modalBio.textContent = instructorData.bio;

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus on close button for accessibility
    modalClose?.focus();
  }

  // Function to close modal
  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Add click event listeners to all "Read More" buttons
  readMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
      const instructorData = {
        name: this.getAttribute('data-name'),
        belt: this.getAttribute('data-belt'),
        role: this.getAttribute('data-role'),
        specialty: this.getAttribute('data-specialty'),
        bio: this.getAttribute('data-bio'),
        image: this.getAttribute('data-image')
      };
      openModal(instructorData);
    });
  });

  // Close modal when clicking the close button
  modalClose?.addEventListener('click', closeModal);

  // Close modal when clicking the overlay
  modalOverlay?.addEventListener('click', closeModal);

  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  // Prevent modal content clicks from closing the modal
  const modalContent = modal?.querySelector('.modal-content');
  modalContent?.addEventListener('click', function(event) {
    event.stopPropagation();
  });

})();
