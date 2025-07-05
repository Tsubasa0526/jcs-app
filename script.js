document.addEventListener('DOMContentLoaded', () => {
    // JCSデータ
    const jcsData = [
        { score: 0, desc: '意識清明', level: 'I' },
        { score: 1, desc: '見当識障害はないが、意識は清明でない', level: 'I' },
        { score: 2, desc: '見当識障害がある', level: 'I' },
        { score: 3, desc: '自分の名前、生年月日が言えない', level: 'I' },
        { score: 10, desc: '普通の呼びかけで容易に開眼する', level: 'II' },
        { score: 20, desc: '大きな声または体を揺さぶることで開眼する', level: 'II' },
        { score: 30, desc: '痛み刺激を加えつつ、呼びかけを繰り返すことでかろうじて開眼する', level: 'II' },
        { score: 100, desc: '痛み刺激に対し、払いのけるような動作をする', level: 'III' },
        { score: 200, desc: '痛み刺激に対し、少し手足を動かしたり顔をしかめる', level: 'III' },
        { score: 300, desc: '痛み刺激に全く反応しない', level: 'III' },
    ];

    // --- モード切替 --- 
    const modeMeasureBtn = document.getElementById('mode-measure-btn');
    const modeLearnBtn = document.getElementById('mode-learn-btn');
    const measureMode = document.getElementById('measure-mode');
    const learnMode = document.getElementById('learn-mode');

    modeMeasureBtn.addEventListener('click', () => {
        measureMode.classList.add('active');
        learnMode.classList.remove('active');
        modeMeasureBtn.classList.add('active');
        modeLearnBtn.classList.remove('active');
    });

    modeLearnBtn.addEventListener('click', () => {
        learnMode.classList.add('active');
        measureMode.classList.remove('active');
        modeLearnBtn.classList.add('active');
        modeMeasureBtn.classList.remove('active');
        displayQuestion(); // 学習モードに切り替えたら最初の問題を作成
    });

    // --- 計測モード --- 
    const scoreDisplayElement = document.getElementById('score-display');
    const jcsButtonsWrapper = document.getElementById('jcs-buttons-wrapper');
    const resetButton = document.getElementById('reset-button');

    // JCSデータを基にボタンを生成
    jcsData.forEach(item => {
        const button = document.createElement('button');
        button.textContent = `${item.score}. ${item.desc}`;
        button.dataset.score = item.score;
        jcsButtonsWrapper.appendChild(button);
    });

    jcsButtonsWrapper.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.score) {
            scoreDisplayElement.textContent = event.target.dataset.score;
        }
    });

    resetButton.addEventListener('click', () => {
        scoreDisplayElement.textContent = '-';
    });

    // --- 学習モード --- 
    const questionArea = document.getElementById('question-area');
    const answerOptions = document.getElementById('answer-options');
    const feedbackArea = document.getElementById('feedback-area');
    const nextQuestionButton = document.getElementById('next-question');

    let correctAnswer = null;

    function displayQuestion() {
        feedbackArea.textContent = '';
        feedbackArea.className = '';
        nextQuestionButton.style.display = 'none';

        const questions = jcsData.filter(q => q.score > 0);
        correctAnswer = questions[Math.floor(Math.random() * questions.length)];
        
        questionArea.textContent = correctAnswer.desc;

        answerOptions.innerHTML = '';
        const options = [correctAnswer];
        const wrongAnswers = jcsData.filter(item => item.score !== correctAnswer.score);
        wrongAnswers.sort(() => 0.5 - Math.random());
        options.push(...wrongAnswers.slice(0, 3));
        options.sort(() => 0.5 - Math.random());

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = `${option.score}`;
            button.dataset.score = option.score;
            button.addEventListener('click', selectAnswer);
            answerOptions.appendChild(button);
        });
    }

    function selectAnswer(event) {
        Array.from(answerOptions.children).forEach(child => {
            child.removeEventListener('click', selectAnswer);
            child.disabled = true; // 回答後はボタンを無効化
        });

        const selectedScore = parseInt(event.target.dataset.score, 10);

        if (selectedScore === correctAnswer.score) {
            feedbackArea.textContent = '正解！';
            feedbackArea.className = 'correct';
        } else {
            feedbackArea.textContent = `不正解。正解は ${correctAnswer.score} です。`;
            feedbackArea.className = 'incorrect';
        }

        nextQuestionButton.style.display = 'block';
    }

    nextQuestionButton.addEventListener('click', displayQuestion);
});
