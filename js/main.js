/**
 * @author atsuk0r0
 * @since 2020/04/01
 */
'use strict';

{
  /**
   * -------------------- ローカル変数の定義 --------------------
   */

  /**
   * タイピングゲームの課題一覧
   * @type {string[]}
   */
  const words = ['apple', 'sky', 'blue', 'middle', 'set'];

  // 画面上の要素の取得
  const target = document.getElementById('target');
  const scoreLabel = document.getElementById('score');
  const missLabel = document.getElementById('miss');
  const timerLabel = document.getElementById('timer');

  /**
   * 初期開始時間
   * @constant {string}
   */
  const INIT_TIME = '0.00';

  /**
   * ゲーム再開時の画面表示文言
   * @type {string}
   */
  const REPLAY_MESSAGE = 'click to replay';

  /**
   * タイピングゲームの課題
   * @type {string}
   */
  let word;

  /**
   * 課題の文字列の位置
   * @type {number}
   */
  let location;

  /**
   * 成功数
   * @type {number}
   */
  let score;

  /**
   * 失敗数
   * @type {number}
   */
  let missCount;

  /**
   * 制限時間
   * @type {number}
   */
  const timeLimit = 3 * 1000;

  /**
   * ゲーム開始時間
   * @type {number}
   */
  let startTime;

  /**
   * ゲーム開始判定フラグ
   * @type {boolean}
   */
  let isPlaying = false;

  /**
   * -------------------- 関数の定義 --------------------
   */

  /**
   * 【関数の処理内容】
   * マッチした文字数分先頭から切り取り、'_'を文字列結合し画面に表示
   */
  function upDateTarget() {
    // プレースホルダの初期化
    let placeholder = '';

    // キーが合致した回数だけループを回し、プレースホルダに代入する。
    for (let i = 0; i < location; i++) {
      placeholder += '_';
    }

    target.textContent = placeholder + word.substring(location);
  }

  /**
   * 【関数の処理内容】
   * 経過時間を小数点第2位まで切り取り、画面に表示する。
   * 再帰的に呼び出される。
   */
  function upDateTimer() {
    // 処理時間の算出し、小数点第2位までを画面に描画する
    const elapsedTime = startTime + timeLimit - Date.now();
    timerLabel.textContent = (elapsedTime / 1000).toFixed(2);

    // 10ミリ秒毎に再帰的に呼び出し、タイマーIDを取得する
    const timeoutId = setTimeout(() => {
      upDateTimer();
    }, 10);

    // 経過時間が0秒だった際に画面上のタイマー表示を0.00と表示させる
    if (elapsedTime < 0) {
      isPlaying = false;
      // タイマーIDを基に再帰処理を停止
      clearTimeout(timeoutId);

      timerLabel.textContent = INIT_TIME;

      // ゲーム終了後にタイピングゲームの結果を表示
      setTimeout(() => {
        showResult();
      }, 100);

      // 画面上にゲーム再開時の文言を表示
      target.textContent = REPLAY_MESSAGE;
    }
  }

  /**
   * 【タイピングゲームの結果を表示】
   * タイピングの成功数をタイピングの成功数と失敗数の合計で割り、パーセント表示する。
   * 成功数と失敗数の合計が0だった際に0.00と表示する。
   */
  function showResult() {
    const accuracy =
      score + missCount === 0 ? 0 : (score / (score + missCount)) * 100;

    // 成功した数と失敗した数、成功したパーセンテージを表示
    alert(
      `${score} letters, ${missCount} misses, ${accuracy.toFixed(2)}% accuracy!`
    );
  }

  /**
   * 【画面上クリック時の挙動】
   * ゲーム実施判定フラグがtrueの場合、後続の処理を行わない。
   * ゲーム実施判定フラグがfalseの場合、変数の初期化を行ってタイピングゲームを開始する。
   */
  window.addEventListener('click', () => {
    if (isPlaying) {
      return;
    }
    isPlaying = true;

    // 変数の初期化
    location = 0;
    score = 0;
    missCount = 0;
    scoreLabel.textContent = score;
    missLabel.textContent = missCount;
    word = words[Math.floor(Math.random() * words.length)]; // タイピングゲームの課題一覧をランダムに取得する。
    target.textContent = word;
    startTime = Date.now(); // 現在時刻を取得

    // ゲーム経過時間を画面に表示
    upDateTimer();
  });

  /**
   * 【画面上で起きるキーダウンイベント時の挙動】
   * ゲーム開始判定フラグがfalseの時に処理終了。
   * ゲーム開始判定フラグがtrueの時は、タイピングの成功数と失敗数を画面に表示する。
   */
  window.addEventListener('keydown', (e) => {
    // ゲーム開始判定フラグがfalseの場合、処理終了
    if (!isPlaying) {
      return;
    }
    // 課題の文字位置と入力されたキーが同じ場合
    if (word[location] === e.key) {
      location++;

      // 課題の終端になった場合
      if (location === word.length) {
        // 課題一覧よりランダムに取得
        word = words[Math.floor(Math.random() * words.length)];
        // 開始位置を初期化
        location = 0;
      }
      // 入力したキーを'_'で表示
      upDateTarget();

      score++;
      // 成功した数を画面に表示
      scoreLabel.textContent = score;

      // 課題の文字位置と入力されたキーが異なる場合
    } else {
      missCount++;
      // 失敗した数を画面に表示
      missLabel.textContent = missCount;
    }
  });
}
