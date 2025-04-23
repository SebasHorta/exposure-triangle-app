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

# Update image paths in lessons
for lesson in lessons:
    if 'image' in lesson and not lesson['image'].startswith('/static'):
        lesson['image'] = url_for('static', filename=f"images/{os.path.basename(lesson['image'])}")

@app.route('/')
def home():
    session['quiz_answers'] = []
    return render_template('home.html')

@app.route('/learn/<int:lesson_num>')
def learn(lesson_num):
    if lesson_num > len(lessons):
        return redirect(url_for('quiz_route', question_num=1)) 
    lesson = lessons[lesson_num - 1]
    return render_template('learn.html', lesson=lesson, lesson_num=lesson_num)

@app.route('/quiz/<int:question_num>', methods=['GET', 'POST'])
def quiz_route(question_num):
    # Initialize quiz_answers in session if it doesn't exist
    if 'quiz_answers' not in session:
        session['quiz_answers'] = []
        
    if request.method == 'POST':
        answer = request.form.get('answer')
        
        # Store answer in session
        quiz_answers = session.get('quiz_answers', [])
        
        # If we're submitting a previous question again, update that answer
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
    return render_template('quiz.html', question=question, question_num=question_num)

@app.route('/quiz/result')
def result():
    correct_answers = [q['correct'] for q in quiz]
    user_answers = session.get('quiz_answers', [])
    score = sum(1 for u, c in zip(user_answers, correct_answers) if u == c)
    return render_template('result.html', score=score, total=len(quiz))

@app.route('/debug')
def debug():
    return render_template("learn.html", lesson={
        "title": "Test ISO",
        "content": "This is a debug lesson.",
        "image": url_for('static', filename="images/iso.jpg")
    }, lesson_num=1)

if __name__ == '__main__':
    app.run(debug=True)
