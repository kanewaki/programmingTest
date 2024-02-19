const readline = require('readline');

// readline インターフェースの設定
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lineCount = 0; // 入力行数のカウンター
let bingoSize = 0; // ビンゴカードのサイズ
let bingoCard = []; // ビンゴカードの単語を格納する配列
let N = 0; // 選ばれた単語の数
let words = []; // 選ばれた単語を格納する配列

rl.on('line', (line) => {
  if (lineCount === 0) {//lineCountが０なら
    bingoSize = parseInt(line);//lineに入ってるデータ（1行目）をparseIntで文字列から整数にしてSに挿入
  } else if (lineCount <= bingoSize) {//lineCountがS以下なら
    bingoCard.push(line.split(' '));//bingoCardにスペースで区切られた単語を配列にして追加
  } else if (lineCount === bingoSize + 1) {//lineCountがS＋１行目であれば
    N = parseInt(line);//Nにlineに入ってきたデータを挿入
  } else {
    words.push(line);//wordsにデータを格納
    if (words.length === N) {//words配列に格納されてる数を.lengthで数えてNと同じ数値になったら
      rl.close(); // 全ての入力を受け取ったら入力の受付を終了
    }
  }
  lineCount++;//linesCountを＋１する
});

rl.on('close', () => {//入力が終わるとこの関数が呼ばれる
  // 勝利条件のチェック
  const result = checkBingo(bingoCard, words);//checkBingoに引数渡してビンゴ成立してるかを確認
  console.log(result ? 'Yes' : 'No');//結果を出力
});

function checkBingo(bingoCard, words) {//渡された引数を使用して
  const cardSize = bingoCard.length;//bingoCard配列に格納されている数を.lengthで数えてcardSizeに挿入
  const marked = [];//空の配列を用意
  for(let i = 0;i<cardSize;i++){//cardSize分の列を作成
    marked[i]= [];//ここで二次元配列になる
    for(let j = 0;j<cardSize;j++){
        marked[i][j]=false;//ここでi番目の配列のj番目の要素にfalseを設定する。
    }
  }
  words.forEach(word => {//
    for (let i = 0; i < cardSize; i++) {
      for (let j = 0; j < cardSize; j++) {//i行とj列のビンゴカードすべてを見るための二重ループ
        if (bingoCard[i][j] === word) {//bingoCardのi列とj行がwordと合致しているなら
          marked[i][j] = true;//markedの二次元配列にtrueを入れる
        }
      }
    }
  });

  for (let i = 0; i < cardSize; i++) {
    let rowMarked = true;//各行をすべてマークされてるか確認するための変数
    let colMarked = true;//各列をすべてマークされてるか確認するための変数
    for (let j = 0; j < cardSize; j++) {
      if (!marked[i][j]) rowMarked = false; //i行目のj列目がtrueでないならfalse
      if (!marked[j][i]) colMarked = false;//j行目のi列目がtrueでないならfalse
    }
    if (rowMarked || colMarked) return true;//rowMarkedとcolMarkedどちらかがtrueならtrueをリターンする
  }

  let diag1Marked = true;//左上から右下への対角線がすべてマークされてるか確認するための変数
  let diag2Marked = true;//右上から左下への対角線がすべてマークされてるか確認するための変数
  for (let i = 0; i < cardSize; i++) {
    if (!marked[i][i]) diag1Marked = false;//i行目のi列目がtrueでないならfalse
    if (!marked[i][cardSize - 1 - i]) diag2Marked = false;//i行目の[cardSize - 1 - i]列目がtrueでないならfalse
  }

  return diag1Marked || diag2Marked;//diag1Markedとdiag2Markedどちらかがtrueならtrueをリターンする
}
