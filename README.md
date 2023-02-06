# buildspace 

## start

下記のhpに書き換え後の文章は生成予定
https://www.calmlywriter.com/online/?utm_source=buildspace.so&utm_medium=buildspace_project


## manifest.json
manifest.jsonでは、拡張機能の名前、必要なアセット、実行に必要なアクセス許可を
ブラウザーに伝え、バックグラウンドおよびページで実行するファイルを識別します。

### name, discription
Chromeの拡張機能ストアで表示される名前と詳細

### action
- default_title: 右クリックで表示する際の文章名
- default_popup: 拡張機能を押した際のpopupの表示ファイル

### background
データのrelayerを指定。
今回はservice_workerで、拡張機能側から読み込んだ文字をもとにchatGPTに通信をしに行く。
lisnerも同様

### permissions
拡張機能は基本的にブラウザで実行されるマルウェアになる可能性があるため、セキュリティはそれらにとって大きな問題です。拡張機能に必要な権限を明示的に宣言する必要があります。

### content_scripts
jsを追加時はmanifest.jsonでcontent_scriptsとして
読み込ませる。


```
curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer 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' \
  -d '{
  "model": "text-davinci-003",
  "prompt": "さっぱりだ",
  "max_tokens": 30,
  "temperature": 0.4
}'

```