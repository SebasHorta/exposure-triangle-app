# Sebastian Horta
# app.py

from flask import Flask, render_template, request, redirect, url_for, session
import json
import os

app = Flask(__name__)
app.secret_key = 'super_secret_key'

# Load JSON data
def load_json_data(filename):
    with open(os.path.join('data', filename)) as f:
        return json.load(f)

lessons = load_json_data('lessons.json')
quiz = load_json_data('quiz.json')
examples = load_json_data('examples.json')

# Update image paths in lessons: convert relative filenames to static, skip external/static URLs
for lesson in lessons:
    if 'image' in lesson:
        img = lesson['image']
        # Skip external URLs or already static paths
        if img.startswith('http://') or img.startswith('https://') or img.startswith('/static'):
            continue
        # Treat as filename relative to static/images
        filename = os.path.basename(img)
        lesson['image'] = url_for('static', filename=f"images/{filename}")

# Update image paths in examples: convert relative filenames to static, skip external/static URLs
for example in examples:
    if 'image' in example:
        img = example['image']
        # Skip external URLs or already static paths
        if img.startswith('http://') or img.startswith('https://') or img.startswith('/static'):
            continue
        # Treat as filename relative to static/images
        filename = os.path.basename(img)
        example['image'] = url_for('static', filename=f"images/{filename}")

@app.route('/')
def home():
    session['quiz_answers'] = []
    return render_template('home.html')

@app.route('/guide')
def guide():
    return render_template('guide.html')

@app.route('/learn/<int:lesson_num>')
def learn(lesson_num):
    if lesson_num > len(lessons):
        return redirect(url_for('recap')) 
    lesson = lessons[lesson_num - 1]
    return render_template('learn.html', lesson=lesson, lesson_num=lesson_num, total_lessons=len(lessons))

@app.route('/examples')
@app.route('/examples/<string:scenario>')
def examples_route(scenario=None):
    if scenario:
        # Find the specific example
        example = next((ex for ex in examples if ex['id'] == scenario), None)
        if example:
            return render_template('example.html', example=example)
    
    # If no scenario or scenario not found, show examples list
    return render_template('examples.html', examples=examples)

@app.route('/recap')
def recap():
    return render_template('recap.html')

@app.route('/quiz/format')
def quiz_format():
    return render_template('quiz_format.html')

@app.route('/quiz/<int:question_num>', methods=['GET', 'POST'])
def quiz_route(question_num):
    # Initialize quiz_answers in session if it doesn't exist
    if 'quiz_answers' not in session:
        session['quiz_answers'] = []

    # Handle form submission
    if request.method == 'POST':
        # Determine answer type: slider vs MC
        question = quiz[question_num - 1]
        if question.get('type') == 'slider':
            # Combine slider answers in order
            slider_answers = []
            for slider in question.get('sliders', []):
                key = f"{slider['id']}_answer"
                slider_answers.append(request.form.get(key, ''))
            answer = '|'.join(slider_answers)
        else:
            answer = request.form.get('answer')

        # Store answer in session
        quiz_answers = session.get('quiz_answers', [])
        current_index = question_num - 1
        if current_index < len(quiz_answers):
            quiz_answers[current_index] = answer
        else:
            quiz_answers.append(answer)
        session['quiz_answers'] = quiz_answers

        # Redirect to next question
        next_question = question_num + 1
        if next_question > len(quiz):
            return redirect(url_for('result'))
        else:
            return redirect(url_for('quiz_route', question_num=next_question))

    # Check if we've gone past the end of the quiz
    if question_num > len(quiz):
        return redirect(url_for('result'))

    # Display the current question
    question = quiz[question_num - 1]
    
    # Add progress information
    progress = {
        'current': question_num,
        'total': len(quiz)
    }
    
    # Prepare image source: external or static
    img = question.get('image', '')
    if img.startswith('http://') or img.startswith('https://'):
        question['img_src'] = img
    elif img:
        question['img_src'] = url_for('static', filename=f"images/{img}")
    else:
        question['img_src'] = url_for('static', filename='images/triangle.jpg')

    # Calculate progress percentage for template styling
    progress_pct = (progress['current'] / progress['total']) * 100
    return render_template('quiz.html', question=question, question_num=question_num, progress=progress, progress_pct=progress_pct)

@app.route('/quiz/result')
def result():
    correct_answers = [q['correct'] for q in quiz]
    user_answers = session.get('quiz_answers', [])
    
    # Calculate score and incorrect answers
    score = 0
    incorrect_questions = []
    
    for i, (u, c) in enumerate(zip(user_answers, correct_answers)):
        if u == c:
            score += 1
        else:
            incorrect_questions.append({
                'number': i + 1,
                'question': quiz[i]['question'],
                'user_answer': u,
                'correct_answer': c,
                'explanation': quiz[i].get('explanation', '')
            })
    
    # Determine areas of improvement
    improvement_areas = {
        'iso': False,
        'shutter': False,
        'aperture': False
    }
    
    for q in incorrect_questions:
        question_text = quiz[q['number'] - 1]['question'].lower()
        if 'iso' in question_text:
            improvement_areas['iso'] = True
        if 'shutter' in question_text or 'speed' in question_text:
            improvement_areas['shutter'] = True
        if 'aperture' in question_text or 'f-stop' in question_text or 'f/' in question_text:
            improvement_areas['aperture'] = True
    
    return render_template('result.html', 
                          score=score, 
                          total=len(quiz), 
                          incorrect_questions=incorrect_questions,
                          improvement_areas=improvement_areas)

@app.route('/debug')
def debug():
    return render_template("learn.html", lesson={
        "title": "Test ISO",
        "content": "This is a debug lesson.",
        "image": url_for('static', filename="images/iso.jpg"),
        "slider_label": "ISO Setting",
        "slider_min": "1",
        "slider_max": "5",
        "slider_default": "3",
        "slider_values": ["100", "400", "800", "1600", "3200"]
    }, lesson_num=1, total_lessons=4)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
