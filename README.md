# Exposure Triangle App

An interactive web lesson to teach beginner photographers the Exposure Triangle—ISO, shutter speed, and aperture.

## Features
- Step-by-step learning guide
- Interactive sliders on each lesson to visualize ISO, shutter speed, and aperture effects in real time
- Hands-on example scenarios
- Mixed-format quiz including both multiple-choice and slider-based exposure challenges
- Detailed score summary and improvement areas at the end of the quiz

## Technology Stack
- Flask
- HTML/CSS
- Javascript

## Project Structure
```
/                      # Project root
├─ app.py              # Flask application and routing
├─ README.md           # Project documentation
├─ data/
│  ├─ lessons.json     # Lesson content and slider data
│  ├─ examples.json    # Example scenarios and recommended answers
│  └─ quiz.json        # Quiz questions (MC and slider types)
├─ templates/
│  ├─ base.html        # Base layout
│  ├─ home.html        # Homepage
│  ├─ guide.html       # Learning guide page
│  ├─ learn.html       # Individual lesson pages (with interactive slider)
│  ├─ examples.html    # List of example scenarios
│  ├─ example.html     # Single example page (with sliders + feedback)
│  ├─ quiz_format.html # Quiz introduction/format page
│  ├─ quiz.html        # Quiz question page (MC & slider)
│  ├─ result.html      # Quiz result and feedback page
├─ static/
│  ├─ css/
│  │  └─ main.css      # All custom styles
│  ├─ js/
│  │  └─ script.js     # App and quiz interactivity logic
│  └─ images/          # Image assets (placeholder & final photos)
|-
```

## Dependencies
Create and activate a virtual environment, then install requirements:
```bash
python3 -m venv ui-venv
source ui-venv/bin/activate
pip install Flask
```

## Running the App
1. Activate your venv (if you created one).
2. Start the server:
   ```bash
   python app.py
   ```
3. Open a browser and navigate to `http://localhost:5001` (default port 5001).
4. Explore: Home → Guide → Lessons → Examples → Recap → Quiz

## Authors
- Analisa Wood
- Joey Huang
- Raunak Agrawal
- Sebastian Horta