// 開いたときにkeyが保存されているかチェック
const checkForKey = () => {
    console.log("start_checkForKey");

    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
        resolve(result['openai-key']);
        });
    });
};

const encode = (input) => {
  return btoa(input);
};

const saveKey = async () => {
    console.log("start_saveKey");

    try {
        await navigator.clipboard.writeText('hello world');
        console.log('success!');
    } catch (error) {
        console.log(error);
    }

    const input = document.getElementById('key_input');
    // openAIのkeyをencodeして、storageに保存する
    if (input) {
      const { value } = input;

      // みた目でわかりにくくしているだけ、実態はただのbase64
      // Encode String
      const encodedValue = encode(value);
  
      //　chrome.storage.local.setでstorageに保存
      // 終了時にcssを変更してダイアログを表示させている
      // Save to google storage
      chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
        document.getElementById('key_needed').style.display = 'none';
        document.getElementById('key_entered').style.display = 'block';
      });
    }
};

const changeKey = () => {
    console.log("start_changeKey");
    document.getElementById('key_needed').style.display = 'block';
    document.getElementById('key_entered').style.display = 'none';
};

document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);

checkForKey().then((response) => {
    console.log("start_checkForKey");
    if (response) {
        document.getElementById('key_needed').style.display = 'none';
        document.getElementById('key_entered').style.display = 'block';
    }
});