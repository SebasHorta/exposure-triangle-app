// Sebastian Horta
// script.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded!");
    
    // Prevent the user from accidentally losing data when discarding changes
    const discardButton = document.getElementById('discard-button');
    if (discardButton) {
        discardButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default navigation

            // Show confirmation dialog
            const userConfirmed = confirm("Are you sure you want to discard your changes?");

            if (userConfirmed) {
                // If confirmed, redirect to the song details page using the correct ID
                const songId = document.getElementById('song-id').value; // Ensure song ID is available in the form
                window.location.href = `/view/${songId}`; // Redirect to the song details page
            }
            // If canceled, stay on the current page and allow the user to keep editing
        });
    }

    // Populate popular songs on homepage
    let popularSongs = [
        {
            id: 1, 
            title: "Nights", 
            imageUrl: "/static/images/Blonde.jpeg", 
            album: "Blonde",
            year: 2016
        },
        {
            id: 2, 
            title: "Pink + White", 
            imageUrl: "/static/images/Blonde.jpeg", 
            album: "Blonde",
            year: 2016
        },
        {
            id: 3, 
            title: "Self Control", 
            imageUrl: "/static/images/Blonde.jpeg", 
            album: "Blonde",
            year: 2016
        }
    ];

    // Update result count dynamically
    const resultsList = document.getElementById("result-list");
    const resultsCount = document.getElementById("results-count");

    if (resultsList) {
        const resultItems = resultsList.getElementsByTagName("li");
        resultsCount.textContent = `${resultItems.length} result${resultItems.length !== 1 ? 's' : ''} found.`;
    }

    let songList = document.getElementById("popular-songs");

    if (songList) {
        popularSongs.forEach(song => {
            let listItem = document.createElement("a");
            listItem.href = `/view/${song.id}`;
            listItem.classList.add("list-group-item", "list-group-item-action", "d-flex", "align-items-center");

            // Create image element
            let image = document.createElement("img");
            image.src = song.imageUrl;
            // Set alt attribute with fallback text if title is missing or empty
            image.alt = song.title && song.title !== "" ? `${song.title} album cover` : "Blonde album cover image";
            image.classList.add("img-thumbnail", "me-3");
            image.style.width = "50px";  

            // Create a container for text
            let textContainer = document.createElement("div");

            // Add the title
            let titleElement = document.createElement("strong");
            titleElement.textContent = song.title;

            // Add album and year (small text)
            let detailsElement = document.createElement("small");
            detailsElement.textContent = ` - ${song.album} (${song.year})`;
            detailsElement.classList.add("text-muted", "ms-2");

            // Append elements
            textContainer.appendChild(titleElement);
            textContainer.appendChild(detailsElement);
            listItem.appendChild(image);
            listItem.appendChild(textContainer);
            songList.appendChild(listItem);
        });
    }

    // Autofocus on search bar
    let searchInput = document.querySelector("input[name='q']");
    if (searchInput) {
        searchInput.focus();
    }

    // Helper function to show errors
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    };

    // Handle AJAX comment submission
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    const commentInput = document.getElementById('comment');

    if (commentForm && commentInput) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(commentForm);

            fetch('/add_comment', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        // Create and append the new comment
                        const newComment = document.createElement('li');
                        newComment.classList.add("list-group-item", "d-flex", "align-items-start");
                        newComment.textContent = data.comment;

                        commentList.appendChild(newComment);

                        // Reset input and refocus
                        commentInput.value = '';
                        commentInput.focus();
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    // Handle AJAX form submission for adding new song
    const addSongForm = document.getElementById('add-song-form');
    const successMessage = document.getElementById('success-message');
    const viewLink = document.getElementById('view-link');

    if (addSongForm) {
        addSongForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;

            // Clear previous error messages
            document.querySelectorAll('.error').forEach(errorDiv => errorDiv.textContent = '');

            // Input fields
            const title = document.getElementById('title');
            const album = document.getElementById('album');
            const year = document.getElementById('year');
            const duration = document.getElementById('duration');
            const summary = document.getElementById('summary');
            const genres = document.getElementById('genres');
            const rating = document.getElementById('rating');

            // Input validations
            if (!title.value.trim()) showError('title-error', "Title is required.");
            if (!album.value.trim()) showError('album-error', "Album is required.");

            const yearValue = parseInt(year.value.trim(), 10);
            if (isNaN(yearValue) || yearValue < 1900 || yearValue > 2025) {
                showError('year-error', "Year must be between 1900 and 2025.");
                valid = false;
            }

            const durationPattern = /^(\d{1,2}:)?([0-5]?[0-9]):([0-5][0-9])$/;
            if (!duration.value.trim() || !durationPattern.test(duration.value)) {
                showError('duration-error', "Duration must be in m:ss, mm:ss, or h:mm:ss format.");
                valid = false;
            }

            if (!summary.value.trim()) showError('summary-error', "Summary is required.");
            if (!genres.value.trim()) showError('genres-error', "Genres are required.");

            const ratingPattern = /^(?:[0](?:\.[1-9])?|[1-9](?:\.\d{1})?|10(?:\.0)?)$/;
            const ratingValue = parseFloat(rating.value.trim());
            if (isNaN(ratingValue) || ratingValue < 0.1 || ratingValue > 10 || !ratingPattern.test(rating.value.trim())) {
                showError('rating-error', "Rating must be between 0.1 and 10.0 (e.g., 9.5).");
                valid = false;
            }

            if (!valid) return; // Stop if validation fails

            // Prepare form data for AJAX request
            const formData = new FormData(addSongForm);

            fetch('/add', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.errors) {
                        alert(data.errors.join("\n"));
                    } else {
                        // Show success message and link to the new song
                        successMessage.style.display = 'block';
                        viewLink.href = `/view/${data.id}`;

                        // Clear input fields and refocus on the first field
                        addSongForm.reset();
                        title.focus();
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    // Handle AJAX form submission for editing song
    const editSongForm = document.getElementById('edit-song-form');
    const songId = document.getElementById('song-id')?.value; // Ensure the song ID is passed correctly

    if (editSongForm && songId) {
        editSongForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;

            // Clear previous error messages
            document.querySelectorAll('.error').forEach(errorDiv => errorDiv.textContent = '');

            // Input fields
            const title = document.getElementById('title');
            const album = document.getElementById('album');
            const year = document.getElementById('year');
            const duration = document.getElementById('duration');
            const summary = document.getElementById('summary');
            const genres = document.getElementById('genres');
            const rating = document.getElementById('rating');

            // Input validations
            if (!title.value.trim()) showError('title-error', "Title is required.");
            if (!album.value.trim()) showError('album-error', "Album is required.");

            const yearValue = parseInt(year.value.trim(), 10);
            if (isNaN(yearValue) || yearValue < 1900 || yearValue > 2025) {
                showError('year-error', "Year must be between 1900 and 2025.");
                valid = false;
            }

            const durationPattern = /^(\d{1,2}:)?([0-5]?[0-9]):([0-5][0-9])$/;
            if (!duration.value.trim() || !durationPattern.test(duration.value)) {
                showError('duration-error', "Duration must be in m:ss, mm:ss, or h:mm:ss format.");
                valid = false;
            }

            if (!summary.value.trim()) showError('summary-error', "Summary is required.");
            if (!genres.value.trim()) showError('genres-error', "Genres are required.");

            const ratingPattern = /^(?:[0](?:\.[1-9])?|[1-9](?:\.\d{1})?|10(?:\.0)?)$/;
            const ratingValue = parseFloat(rating.value.trim());
            if (isNaN(ratingValue) || ratingValue < 0.1 || ratingValue > 10 || !ratingPattern.test(rating.value.trim())) {
                showError('rating-error', "Rating must be between 0.1 and 10.0 (e.g., 9.5).");
                valid = false;
            }

            if (!valid) return; // Stop if validation fails

            // Prepare form data for AJAX request
            const formData = new FormData(editSongForm);

            fetch(`/edit/${songId}`, { // Ensure the songId is passed correctly
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.errors) {
                        alert(data.errors.join("\n"));
                    } else {
                        // Show success message and link to the updated song
                        const successMessage = document.getElementById('success-message');
                        const viewLink = document.getElementById('view-link');
                        successMessage.style.display = 'block';
                        viewLink.href = `/view/${data.id}`;

                        // Clear input fields and refocus on the first field
                        editSongForm.reset();
                        title.focus();
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});
