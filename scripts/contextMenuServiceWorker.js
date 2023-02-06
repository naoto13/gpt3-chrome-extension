// storageからkeyの取得
// Function to get + decode API key
const getKey = () => {
    console.log('start getKey');

    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
        if (result['openai-key']) {
            const decodedKey = atob(result['openai-key']);
            console.log('decodedKey:',decodedKey);
            resolve(decodedKey);
        }
        });
        console.log('chrome.storage.local Not Key:',chrome.storage.local);
    });
};

// activeなタブを探し、sendMassageにてDOMに挿入する文章を渡す
const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;
  
      chrome.tabs.sendMessage(
        activeTab,
        { message: 'inject', content },
        (response) => {
          if (response.status === 'failed') {
            console.log('injection failed.');
          }
        }
      );
    });
  };

const generate = async (prompt) => {
    console.log('start generate');
    console.log('prompt:',prompt);
    // Get your API key from storage
    const key = await getKey();
    console.log("key:",key);
    const url = 'https://api.openai.com/v1/completions';
        
    // Call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-002',
          prompt: prompt,
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });
    // console.log("completionResponse:",completionResponse);
    // console.log("completionResponse.choices:",completionResponse.choices);
    // // console.log("completionResponse.choices[0]:",completionResponse.choices[0]);
    // // console.log("completionResponse.choices[0].text:",completionResponse.choices.text);


    // if (completionResponse.ok){
        // Select the top choice and send back
        const completion = await completionResponse.json();
        return completion.choices.slice(-1)[0];
    // }else{
    //     console.log('=error=');
    //     console.log('completionResponse.status:',completionResponse.status);
    //     console.log('completionResponse.error:',completionResponse.error);
    // }
}

// infoが渡されるが、その中には、selectionText(ブラウザ上で表示されるもの)が含まれる
const generateCompletionAction = async (info) => {
    console.log('start generateCompletionAction')
    console.log('info:', info)
    try {
        sendMessage('generating...');

        const { selectionText } = info;
        const basePromptPrefix = `
        以下のtitleを用いたブログ記事の詳細を書いてください。
        Title:
        `;
        const baseCompletion = await generate(
            `${basePromptPrefix}${selectionText}\n`
          );

        // Add your second prompt here
        // const secondPrompt = `
        // Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
        
        // Title: ${selectionText}
        
        // Table of Contents: ${baseCompletion.text}
        
        // Blog Post:
        // `;

        // Call your second prompt
        // const secondPromptCompletion = await generate(secondPrompt);
        // const secondPromptCompletion = await generate(baseCompletion);

        console.log('baseCompletion:',baseCompletion);
        sendMessage(baseCompletion.text);
    } catch (error) {
        console.log(error);
        sendMessage(error.toString());
    }
};

// これにより右クリックで「Generate blog post」という名前で実行可能になる
// Add this in scripts/contextMenuServiceWorker.js
// chrome.runtime.onInstalled.addListener(() => {
//     console.log('start chrome.runtime.onInstalled.addListener');

    
//   console.log('chrome.contextMenus:', chrome.contextMenus)
// });
  
chrome.contextMenus.create({
    id: 'context-run',
    title: 'Generate blog post',
    contexts: ['selection'],
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);