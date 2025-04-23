# Sebastian Horta
# app.py

from flask import Flask, render_template, request, redirect, url_for, session
import json

app = Flask(__name__)
app.secret_key = 'super_secret_key'

with open('data/lessons.json') as f:
    lessons = json.load(f)

with open('data/quiz.json') as f:
    quiz = json.load(f)

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
    if request.method == 'POST':
        answer = request.form.get('answer')
        session['quiz_answers'].append(answer)

    if question_num > len(quiz):
        return redirect(url_for('result'))

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
        "image": "/static/images/iso.jpg"
    }, lesson_num=1)

if __name__ == '__main__':
    app.run(debug=True)
