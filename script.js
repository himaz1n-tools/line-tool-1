// 暗号化処理
function encryptText() {
    const text = document.getElementById('textInput').value;
    const cipher = parseInt(document.getElementById('cipherValue').value);
    const encryptedText = caesarCipher(text, cipher);
    const unicodeText = convertToUnicode(encryptedText, cipher);
    document.getElementById('resultText').innerText = unicodeText;
}

// 翻訳処理
function translateUnicode() {
    const unicodeInput = document.getElementById('textInput').value;
    const decodedText = convertFromUnicode(unicodeInput);
    const cipher = parseInt(document.getElementById('cipherValue').value);
    const decryptedText = caesarCipher(decodedText, -cipher);
    document.getElementById('resultText').innerText = decryptedText;
}

// 暗号化
function caesarCipher(str, shift) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];

        // アルファベットのをシフト化
        if (char.match(/[a-zA-Z]/)) {
            const shiftValue = (i + shift) % 26; // 文字ごとに違ったシフトを適用
            const charCode = str.charCodeAt(i);
            const base = char.match(/[a-z]/) ? 97 : 65;
            result += String.fromCharCode(((charCode - base + shiftValue) % 26 + 26) % 26 + base);
        } else {
            result += char; // アルファベット以外はそのまま
        }
    }
    return result;
}

// 文字列をUnicode形式に変換
function convertToUnicode(str, cipher) {
    return Array.from(str)
        .map(char => {
            const unicode = '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
            // Unicode値を三倍する処理
            const modifiedUnicode = unicode.replace('\\u', '\\x'); // 変換後に`u`を`x`に変更
            const number = parseInt(modifiedUnicode.replace('\\x', ''), 16);
            const newNumber = number * cipher; // Unicodeの値を三倍
            const newUnicode = '\\u' + newNumber.toString(16).padStart(4, '0');
            return newUnicode.replace('\\u', '\\x'); // `u`を`x`に戻す
        })
        .join('/');
}

// Unicode形式をテキストに変換
function convertFromUnicode(unicodeStr) {
    return unicodeStr.split('/')
        .map(code => {
            // 'x'を'u'に戻してUnicodeに変換し、暗号数で割る
            const unicodeCode = code.replace('\\x', '\\u');
            const number = parseInt(unicodeCode.replace('\\u', ''), 16);
            const cipher = parseInt(document.getElementById('cipherValue').value);
            const newNumber = number / cipher; // Unicodeの値を暗号数で割る
            const newUnicode = '\\u' + Math.round(newNumber).toString(16).padStart(4, '0');
            return String.fromCharCode(parseInt(newUnicode.replace('\\u', ''), 16));
        })
        .join('');
}

// コピー機能
function copyToClipboard() {
    const resultText = document.getElementById('resultText').innerText;
    const textToCopy = resultText; // 結果をそのままコピー
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('結果をコピーしました!');
}

// 共有リンクをLINE用に生成する
function generateShareLink() {
    const resultText = document.getElementById('resultText').innerText;
    const encodedResult = encodeURIComponent(resultText);
    const shareLink = `line://share?text=${encodedResult}`;

    // 共有リンクをボタンとして表示
    const shareButton = document.createElement('a');
    shareButton.href = shareLink;
    shareButton.target = "_blank";
    shareButton.innerHTML = "LINEで共有する";
    shareButton.style.padding = "10px 20px";
    shareButton.style.backgroundColor = "#007bff";
    shareButton.style.color = "white";
    shareButton.style.borderRadius = "4px";
    shareButton.style.textDecoration = "none";
    shareButton.style.marginTop = "10px";

    // 共有リンクの場所にボタンを表示
    const shareLinkContainer = document.getElementById('shareLink');
    shareLinkContainer.innerHTML = '';  // 前のリンクを消す
    shareLinkContainer.appendChild(shareButton);
}

